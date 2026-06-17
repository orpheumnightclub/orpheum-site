// ===== Firebase init =====
var firebaseConfig = {
    apiKey: "AIzaSyAty51T9ZL89zPrT0WOyeBptEep604Vdd4",
    authDomain: "orpheum-1a815.firebaseapp.com",
    databaseURL: "https://orpheum-1a815-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "orpheum-1a815",
    storageBucket: "orpheum-1a815.firebasestorage.app",
    messagingSenderId: "459230463541",
    appId: "1:459230463541:web:c7615d494a0395e13cd37c"
};
firebase.initializeApp(firebaseConfig);
var db = firebase.database();

// ===== Telegram detection =====
var tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
var isMiniApp = tg && tg.initDataUnsafe && tg.initDataUnsafe.user;
var TG_BOT_TOKEN = '8841778405:AAGxnnq7rC_OqG8b4Po4ZuGur1o37XFs-Fg';
var TG_CHAT_ID = '-1004472996150';

// ===== Init Telegram Mini App =====
if (tg && isMiniApp) {
    tg.ready();
    tg.expand();
    tg.setHeaderColor('#000000');
    tg.setBackgroundColor('#000000');
    var user = tg.initDataUnsafe.user;
    var userInfoDiv = document.getElementById('userInfo');
    if (userInfoDiv) {
        userInfoDiv.style.display = 'flex';
        userInfoDiv.innerHTML = '<img src="' + (user.photo_url || '') + '" alt="avatar" onerror="this.style.display=\'none\'">' +
            '<span>@' + (user.username || user.first_name) + '</span>';
    }
    var nameInput = document.getElementById('name');
    if (nameInput && user.first_name) {
        nameInput.value = user.first_name + (user.last_name ? ' ' + user.last_name : '');
    }
}

// ===== Header scroll effect =====
window.addEventListener('scroll', function() {
    var header = document.getElementById('header');
    if (header) {
        if (window.pageYOffset > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

// ===== Mobile menu =====
var burger = document.getElementById('burger');
var mobileMenu = document.getElementById('mobileMenu');
if (burger && mobileMenu) {
    burger.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        burger.classList.toggle('active');
    });
    document.querySelectorAll('.mobile-menu__link, .mobile-menu__btn').forEach(function(link) {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            burger.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ===== Smooth scroll =====
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        var target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ===== Phone mask =====
var phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        var digits = e.target.value.replace(/\D/g, '');
        if (digits.length === 0) { e.target.value = ''; return; }
        if (digits[0] === '3' && digits[1] === '8') digits = digits.substring(2);
        if (digits[0] === '0') digits = digits.substring(1);
        var f = '+38 (0';
        if (digits.length > 0) f += digits.substring(0, 2);
        if (digits.length <= 2) { e.target.value = f; return; }
        f += ') ' + digits.substring(2, 5);
        if (digits.length > 5) f += '-' + digits.substring(5, 7);
        if (digits.length > 7) f += '-' + digits.substring(7, 9);
        e.target.value = f;
    });
    phoneInput.addEventListener('keydown', function(e) {
        if (e.key === 'Backspace' && e.target.value === '+38 (0)') e.target.value = '';
    });
}

// ===== Date mask =====
var dateInput = document.getElementById('date');
if (dateInput) {
    dateInput.addEventListener('input', function(e) {
        var digits = e.target.value.replace(/\D/g, '');
        if (digits.length === 0) { e.target.value = ''; return; }
        var f = digits.substring(0, 2);
        if (digits.length > 2) f += '.' + digits.substring(2, 4);
        if (digits.length > 4) f += '.' + digits.substring(4, 8);
        e.target.value = f;
        if (e.target.closest('.booking__form-group').classList.contains('error')) validateDate();
    });
}

// ===== Validation =====
function showError(fieldId, msg) {
    var el = document.getElementById(fieldId);
    if (!el) return;
    var g = el.closest('.booking__form-group');
    var err = document.getElementById(fieldId + 'Error');
    if (g) g.classList.add('error');
    if (g) g.classList.remove('success');
    if (err) err.textContent = msg;
}

function clearError(fieldId) {
    var el = document.getElementById(fieldId);
    if (!el) return;
    var g = el.closest('.booking__form-group');
    var err = document.getElementById(fieldId + 'Error');
    if (g) g.classList.remove('error');
    if (err) err.textContent = '';
}

function markOk(fieldId) {
    var el = document.getElementById(fieldId);
    if (!el) return;
    var g = el.closest('.booking__form-group');
    if (g) g.classList.remove('error');
    if (g) g.classList.add('success');
}

function validateName() {
    var v = document.getElementById('name').value.trim();
    if (v.length < 2) { showError('name', 'Мінімум 2 символи'); return false; }
    if (!/^[a-zA-Zа-яА-ЯіІїЇєЄґҐ\-\s']+$/.test(v)) { showError('name', 'Тільки літери, дефіс або апостроф'); return false; }
    clearError('name'); markOk('name'); return true;
}

function validatePhone() {
    var v = document.getElementById('phone').value.replace(/\D/g, '');
    if (v.length < 10) { showError('phone', 'Введіть повний номер: +38 (0XX) XXX-XX-XX'); return false; }
    if (v.length > 12) { showError('phone', 'Надто багато цифр'); return false; }
    clearError('phone'); markOk('phone'); return true;
}

function validateDate() {
    var v = document.getElementById('date').value;
    if (!v) { showError('date', 'Оберіть дату'); return false; }
    var p = v.split('.');
    if (p.length !== 3 || p[0].length !== 2 || p[1].length !== 2 || p[2].length !== 4) { showError('date', 'Формат: ДД.ММ.РРРР'); return false; }
    var d = parseInt(p[0], 10), m = parseInt(p[1], 10), y = parseInt(p[2], 10);
    if (m < 1 || m > 12) { showError('date', 'Невірний місяць (01-12)'); return false; }
    var dim = new Date(y, m, 0).getDate();
    if (d < 1 || d > dim) { showError('date', 'Невірний день для цього місяця'); return false; }
    if (y < 2025 || y > 2030) { showError('date', 'Рік має бути від 2025 до 2030'); return false; }
    var sel = new Date(y, m - 1, d), now = new Date(); now.setHours(0,0,0,0);
    if (sel < now) { showError('date', 'Дата не може бути в минулому'); return false; }
    var max = new Date(); max.setMonth(max.getMonth() + 3); max.setHours(0,0,0,0);
    if (sel > max) { showError('date', 'Максимум 3 місяці вперед'); return false; }
    clearError('date'); markOk('date'); return true;
}

// ===== Table loading from Firebase =====
var tablesConfig = {};

function loadTablesConfig() {
    return db.ref('tables_config').once('value').then(function(snap) {
        var data = snap.val();
        if (data) { tablesConfig = data; return; }
        tablesConfig = {
            floor1: {
                zones: { vip: { name: 'VIP' }, standard: { name: 'Стандарт' }, bar: { name: 'Бар' } },
                tables: [
                    { id: 'f1-b1', seats: 6, zone: 'vip', label: 'Г-банкетка 1', type: 'booth' },
                    { id: 'f1-b2', seats: 6, zone: 'vip', label: 'Г-банкетка 2', type: 'booth' },
                    { id: 'f1-t1', seats: 4, zone: 'standard', label: 'Стіл 1', type: 'tilted' },
                    { id: 'f1-t2', seats: 4, zone: 'standard', label: 'Стіл 2', type: 'tilted' },
                    { id: 'f1-b3', seats: 8, zone: 'vip', label: 'Банкетка 3', type: 'booth' },
                    { id: 'f1-b4', seats: 8, zone: 'vip', label: 'Банкетка 4', type: 'booth' },
                    { id: 'f1-t3', seats: 4, zone: 'standard', label: 'Стіл 3', type: 'standard' },
                    { id: 'f1-t4', seats: 4, zone: 'standard', label: 'Стіл 4', type: 'standard' },
                    { id: 'f1-t5', seats: 4, zone: 'standard', label: 'Стіл 5', type: 'tilted' },
                    { id: 'f1-t6', seats: 4, zone: 'standard', label: 'Стіл 6', type: 'tilted' },
                    { id: 'f1-b5', seats: 6, zone: 'vip', label: 'Г-банкетка 5', type: 'booth' },
                    { id: 'f1-b6', seats: 6, zone: 'vip', label: 'Г-банкетка 6', type: 'booth' },
                    { id: 'f1-t7', seats: 4, zone: 'standard', label: 'Стіл 7', type: 'tilted' },
                    { id: 'f1-t8', seats: 4, zone: 'standard', label: 'Стіл 8', type: 'tilted' },
                    { id: 'f1-t9', seats: 8, zone: 'vip', label: 'Стіл 9', type: 'standard' },
                    { id: 'f1-t10', seats: 8, zone: 'vip', label: 'Стіл 10', type: 'standard' }
                ]
            },
            floor2: {
                zones: { vip: { name: 'VIP' } },
                tables: [
                    { id: 'f2-t4', seats: 8, zone: 'vip', label: 'VIP 4', type: 'booth' },
                    { id: 'f2-t5', seats: 6, zone: 'vip', label: 'VIP 5', type: 'booth' },
                    { id: 'f2-t6', seats: 8, zone: 'vip', label: 'VIP 6', type: 'booth' },
                    { id: 'f2-t2', seats: 6, zone: 'vip', label: 'VIP 2', type: 'booth' },
                    { id: 'f2-t3', seats: 8, zone: 'vip', label: 'VIP 3', type: 'booth' }
                ]
            }
        };
        return db.ref('tables_config').set(tablesConfig);
    });
}

function populateTableSelect(floorNum) {
    var tableSelect = document.getElementById('bookTableSelect');
    var seatsSelect = document.getElementById('bookSeats');
    tableSelect.innerHTML = '<option value="">Оберіть стіл</option>';
    seatsSelect.innerHTML = '<option value="">Спочатку оберіть стіл</option>';

    var floorKey = 'floor' + floorNum;
    var floor = tablesConfig[floorKey];
    if (!floor) return;

    var statusData = {};
    db.ref('tables').once('value').then(function(snap) {
        statusData = snap.val() || {};

        floor.tables.forEach(function(t) {
            if (t.type === 'decoration' || t.type === 'wall') return;
            var st = statusData[t.id] || { status: 'free', seats: 0 };
            var booked = st.seats || 0;
            var available = t.seats - booked;
            if (available <= 0) return;

            var zoneConfig = floor.zones[t.zone];
            var zoneName = zoneConfig ? zoneConfig.name : t.zone;
            var opt = document.createElement('option');
            opt.value = t.id;
            opt.textContent = t.label + ' (' + zoneName + ', вільно ' + available + '/' + t.seats + ')';
            opt.dataset.maxSeats = available;
            tableSelect.appendChild(opt);
        });
    });
}

var bookFloorSelect = document.getElementById('bookFloor');
var bookTableSelect = document.getElementById('bookTableSelect');
var bookSeatsSelect = document.getElementById('bookSeats');

if (bookFloorSelect) {
    bookFloorSelect.addEventListener('change', function() {
        populateTableSelect(this.value);
        bookSeatsSelect.innerHTML = '<option value="">Спочатку оберіть стіл</option>';
    });
}

if (bookTableSelect) {
    bookTableSelect.addEventListener('change', function() {
        var opt = this.options[this.selectedIndex];
        var maxSeats = parseInt(opt.dataset.maxSeats) || 0;
        bookSeatsSelect.innerHTML = '<option value="">Оберіть кількість</option>';
        for (var i = 1; i <= maxSeats; i++) {
            var s = document.createElement('option');
            s.value = i;
            s.textContent = i + ' місце' + (i > 1 && i < 5 ? 'а' : i >= 5 ? 'ь' : '');
            bookSeatsSelect.appendChild(s);
        }
    });
}

loadTablesConfig().then(function() {
    if (bookFloorSelect) populateTableSelect(bookFloorSelect.value);
});

var nameEl = document.getElementById('name');
var phoneEl = document.getElementById('phone');
var dateEl = document.getElementById('date');
if (nameEl) { nameEl.addEventListener('blur', validateName); nameEl.addEventListener('input', function() { if (this.closest('.booking__form-group').classList.contains('error')) validateName(); }); }
if (phoneEl) { phoneEl.addEventListener('blur', validatePhone); phoneEl.addEventListener('input', function() { if (this.closest('.booking__form-group').classList.contains('error')) validatePhone(); }); }
if (dateEl) { dateEl.addEventListener('blur', validateDate); }

// ===== Submit =====
var bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();

        var n = validateName(), p = validatePhone(), d = validateDate();
        if (!n || !p || !d) {
            if (tg && tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('error');
            return;
        }

        var formData = new FormData(bookingForm);
        var data = Object.fromEntries(formData.entries());

        if (!data.tableId) { showError('bookTableSelect', 'Оберіть стіл'); return; }
        if (!data.time) { showError('bookTime', 'Оберіть час'); return; }
        if (!data.seats) { showError('bookSeats', 'Оберіть кількість місць'); return; }

        var tableInfo = null;
        var floorKey = 'floor' + data.floor;
        if (tablesConfig[floorKey]) {
            tablesConfig[floorKey].tables.forEach(function(t) {
                if (t.id === data.tableId) tableInfo = t;
            });
        }
        if (!tableInfo) return;

        var floorName = data.floor === '1' ? '1 поверх' : '2 поверх (VIP)';
        var zoneConfig = tablesConfig[floorKey] && tablesConfig[floorKey].zones[tableInfo.zone];
        var zoneName = zoneConfig ? zoneConfig.name : tableInfo.zone;

        var msg = '🎾 *Нова заявка на бронювання*\n\n';
        if (isMiniApp && tg.initDataUnsafe.user) {
            var u = tg.initDataUnsafe.user;
            msg += '🆔 *Telegram:* @' + (u.username || 'немає') + ' (ID: ' + u.id + ')\n';
        }
        msg += '👤 *Ім\'я:* ' + data.name.trim() + '\n';
        msg += '📞 *Телефон:* ' + data.phone + '\n';
        msg += '📅 *Дата:* ' + data.date + '\n';
        msg += '🕐 *Час:* ' + data.time + '\n';
        msg += '🪑 *Стіл:* ' + tableInfo.label + ' (' + floorName + ')\n';
        msg += '💎 *Зона:* ' + zoneName + '\n';
        msg += '👥 *Місць:* ' + data.seats + ' з ' + tableInfo.seats;

        var btn = document.getElementById('submitBtn');
        var originalText = btn.textContent;
        btn.textContent = 'Надсилаємо...';
        btn.disabled = true;

        var pendingRef = db.ref('pending_bookings').push();
        var pendingId = pendingRef.key;
        var tgUserId = (isMiniApp && tg.initDataUnsafe.user) ? tg.initDataUnsafe.user.id : null;
        var tgUsername = (isMiniApp && tg.initDataUnsafe.user) ? (tg.initDataUnsafe.user.username || '') : '';

        pendingRef.set({
            name: data.name.trim(),
            phone: data.phone,
            date: data.date,
            time: data.time,
            tableId: data.tableId,
            tableLabel: tableInfo.label,
            zone: tableInfo.zone,
            floor: data.floor,
            seats: parseInt(data.seats),
            tgUserId: tgUserId,
            tgUsername: tgUsername,
            createdAt: Date.now()
        }).then(function() {
            var inlineKeyboard = {
                inline_keyboard: [
                    [
                        { text: '✅ Одобрити', callback_data: 'approve_' + pendingId },
                        { text: '❌ Скасувати', callback_data: 'cancel_' + pendingId }
                    ]
                ]
            };

            return fetch('https://api.telegram.org/bot' + TG_BOT_TOKEN + '/sendMessage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: TG_CHAT_ID,
                    text: msg,
                    parse_mode: 'Markdown',
                    reply_markup: inlineKeyboard
                })
            });
        })
        .then(function(r) { return r.json(); })
        .then(function(res) {
            if (res.ok) {
                btn.textContent = '✅ Заявку надіслано!';
                btn.style.background = '#10b981';
                bookingForm.reset();
                document.querySelectorAll('.booking__form-group').forEach(function(g) { g.classList.remove('success', 'error'); });
                bookSeatsSelect.innerHTML = '<option value="">Спочатку оберіть стіл</option>';
                if (bookFloorSelect) populateTableSelect(bookFloorSelect.value);
                if (tg && tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
                if (isMiniApp) setTimeout(function() { tg.close(); }, 2000);
            } else { throw new Error(); }
        })
        .catch(function() {
            btn.textContent = '❌ Помилка. Спробуйте ще раз';
            btn.style.background = '#ef4444';
            if (tg && tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('error');
        })
        .finally(function() {
            setTimeout(function() {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        });
    });
}

// ===== Intersection Observer for animations =====
var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.about__card, .event-card, .gallery__item, .contacts__item').forEach(function(el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

var style = document.createElement('style');
style.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
document.head.appendChild(style);
