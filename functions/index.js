const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.database();

const TG_BOT_TOKEN = "8841778405:AAGxnnq7rC_OqG8b4Po4ZuGur1o37XFs-Fg";
const TG_CHAT_ID = "-1004472996150";
const TG_API = `https://api.telegram.org/bot${TG_BOT_TOKEN}`;

async function tgApi(method, body) {
    const res = await fetch(`${TG_API}/${method}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    return res.json();
}

exports.webhook = onRequest(async (req, res) => {
    if (req.method !== "POST") { res.status(200).send("ok"); return; }

    const body = req.body;

    if (body.message) {
        const msg = body.message;
        const chatId = msg.chat.id;
        const text = msg.text || "";

        if (text === "/start") {
            const welcomeText =
                "🔥 *Ласкаво просимо до ORPHEUM!*\n\n" +
                "Нічний клуб у Шостці — місце, де ніч оживає.\n\n" +
                "📅 *Найближча вечірка:*\n" +
                "🎉 День Фермера\n" +
                "🗓 19 червня (пт)\n" +
                "⏰ 21:00 — 03:00\n" +
                "💰 100 ₴ вхід\n\n" +
                "Натисни кнопку нижче, щоб обрати стіл та забронювати 👇";

            const keyboard = {
                inline_keyboard: [
                    [
                        { text: "🪑 Забронювати стіл", url: "https://orpheum.site/tables.html" }
                    ],
                    [
                        { text: "📸 Галерея", url: "https://orpheum.site/#gallery" },
                        { text: "📞 Контакти", url: "https://orpheum.site/#contacts" }
                    ]
                ]
            };

            await tgApi("sendMessage", {
                chat_id: chatId,
                text: welcomeText,
                parse_mode: "Markdown",
                reply_markup: keyboard,
            });

            return res.status(200).send("ok");
        }
    }

    if (body.callback_query) {
        const cq = body.callback_query;
        const data = cq.data;
        const chatId = cq.message.chat.id;
        const messageId = cq.message.message_id;

        if (data.startsWith("approve_")) {
            const pendingId = data.replace("approve_", "");
            const snap = await db.ref(`pending_bookings/${pendingId}`).once("value");
            const booking = snap.val();

            if (!booking) {
                await tgApi("answerCallbackQuery", {
                    callback_query_id: cq.id,
                    text: "Заявка не знайдена або вже оброблена",
                });
                return res.status(200).send("ok");
            }

            const update = {};
            update[`${booking.tableId}/status`] = "reserved";
            update[`${booking.tableId}/date`] = booking.date;
            update[`${booking.tableId}/time`] = booking.time;
            update[`${booking.tableId}/name`] = booking.name;
            update[`${booking.tableId}/phone`] = booking.phone;
            update[`${booking.tableId}/seats`] = booking.seats;
            await db.ref("tables").update(update);

            await db.ref(`pending_bookings/${pendingId}`).remove();

            const newText = `✅ *Затверджено*\n\n` +
                `🪑 Стіл: ${booking.tableLabel}\n` +
                `👤 ${booking.name}\n` +
                `📞 ${booking.phone}\n` +
                `📅 ${booking.date} о ${booking.time}\n` +
                `👥 ${booking.seats} міс.`;

            await tgApi("editMessageText", {
                chat_id: chatId,
                message_id: messageId,
                text: newText,
                parse_mode: "Markdown",
            });

            await tgApi("answerCallbackQuery", {
                callback_query_id: cq.id,
                text: "Затверджено!",
            });
        }

        if (data.startsWith("cancel_")) {
            const pendingId = data.replace("cancel_", "");
            const snap = await db.ref(`pending_bookings/${pendingId}`).once("value");
            const booking = snap.val();

            if (!booking) {
                await tgApi("answerCallbackQuery", {
                    callback_query_id: cq.id,
                    text: "Заявка не знайдена",
                });
                return res.status(200).send("ok");
            }

            await db.ref(`pending_bookings/${pendingId}`).remove();

            const newText = `❌ *Скасовано*\n\n` +
                `🪑 Стіл: ${booking.tableLabel}\n` +
                `👤 ${booking.name}\n` +
                `📅 ${booking.date} о ${booking.time}`;

            await tgApi("editMessageText", {
                chat_id: chatId,
                message_id: messageId,
                text: newText,
                parse_mode: "Markdown",
            });

            await tgApi("answerCallbackQuery", {
                callback_query_id: cq.id,
                text: "Скасовано",
            });
        }
    }

    res.status(200).send("ok");
});

exports.setWebhook = onRequest(async (req, res) => {
    const url = req.query.url;
    if (!url) { res.status(400).send("missing url param"); return; }
    const result = await tgApi("setWebhook", { url: url + "/webhook" });
    res.json(result);
});

exports.setBotMenu = onRequest(async (req, res) => {
    const baseUrl = req.query.url || "https://orpheum.site";

    await tgApi("setMyCommands", {
        commands: [
            { command: "start", description: "Почати" }
        ]
    });

    await tgApi("setChatMenuButton", {
        menu_button: {
            type: "web_app",
            text: "🪑 Забронювати стіл",
            web_app: { url: baseUrl + "/tables.html" }
        }
    });

    res.json({ ok: true, message: "Bot menu configured" });
});
