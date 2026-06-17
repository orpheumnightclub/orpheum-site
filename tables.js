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

var tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
var isMiniApp = tg && tg.initDataUnsafe && tg.initDataUnsafe.user;
var TG_BOT_TOKEN = '8841778405:AAGxnnq7rC_OqG8b4Po4ZuGur1o37XFs-Fg';
var TG_CHAT_ID = '-1004472996150';
var isAdmin = false;

if (tg && isMiniApp) {
    tg.ready();
    tg.expand();
    tg.setHeaderColor('#0a0a0a');
    tg.setBackgroundColor('#0a0a0a');
    checkAdmin(tg.initDataUnsafe.user.id);
}

function checkAdmin(userId) {
    fetch('https://api.telegram.org/bot' + TG_BOT_TOKEN + '/getChatMember?chat_id=' + TG_CHAT_ID + '&user_id=' + userId)
        .then(function(r) { return r.json(); })
        .then(function(res) {
            if (res.ok && res.result) {
                var s = res.result.status;
                isAdmin = (s === 'administrator' || s === 'creator' || s === 'member');
            }
            updateUI();
        })
        .catch(function() { isAdmin = false; updateUI(); });
}

function updateUI() {
    document.querySelectorAll('.table-seat').forEach(function(el) {
        if (!isAdmin) {
            el.style.cursor = 'default';
        }
    });
    var panel = document.getElementById('tableInfoPanel');
    if (panel && !isAdmin) {
        var bookBtn = document.getElementById('bookTableBtn');
        var sellBtn = document.getElementById('sellTableBtn');
        var cancelBtn = document.getElementById('cancelBookBtn');
        if (bookBtn) bookBtn.style.display = 'none';
        if (sellBtn) sellBtn.style.display = 'none';
        if (cancelBtn) cancelBtn.style.display = 'none';
    }
    var closeShiftBtn = document.getElementById('closeShiftBtn');
    if (closeShiftBtn) closeShiftBtn.style.display = isAdmin ? 'block' : 'none';
}

function renderAll() {
    renderFloor(1);
    renderFloor(2);
    updateUI();
}

var tablesConfig = {
    floor1: {
        zones: {
            vip: { name: 'VIP', color: '#5a8a20' },
            standard: { name: 'Стандарт', color: '#333' },
            bar: { name: 'Бар', color: '#5a8a20' }
        },
        tables: [
            { id: 'f1-b1', x: 0, y: 0, w: 14, h: 13, seats: 6, zone: 'vip', label: 'Г-банкетка 1', type: 'booth' },
            { id: 'f1-b2', x: 86, y: 0, w: 14, h: 13, seats: 6, zone: 'vip', label: 'Г-банкетка 2', type: 'booth' },

            { id: 'f1-t1', x: 28, y: 4, w: 13, h: 12, seats: 4, zone: 'standard', label: 'Стіл 1', type: 'tilted' },
            { id: 'f1-t2', x: 59, y: 4, w: 13, h: 12, seats: 4, zone: 'standard', label: 'Стіл 2', type: 'tilted' },

            { id: 'f1-b3', x: 0, y: 20, w: 14, h: 20, seats: 8, zone: 'vip', label: 'Банкетка 3', type: 'booth' },
            { id: 'f1-b4', x: 86, y: 20, w: 14, h: 20, seats: 8, zone: 'vip', label: 'Банкетка 4', type: 'booth' },

            { id: 'f1-t3', x: 28, y: 24, w: 12, h: 12, seats: 4, zone: 'standard', label: 'Стіл 3', type: 'standard' },
            { id: 'f1-t4', x: 60, y: 24, w: 12, h: 12, seats: 4, zone: 'standard', label: 'Стіл 4', type: 'standard' },

            { id: 'f1-t5', x: 26, y: 46, w: 13, h: 12, seats: 4, zone: 'standard', label: 'Стіл 5', type: 'tilted' },
            { id: 'f1-t6', x: 61, y: 46, w: 13, h: 12, seats: 4, zone: 'standard', label: 'Стіл 6', type: 'tilted' },

            { id: 'f1-b5', x: 0, y: 48, w: 14, h: 13, seats: 6, zone: 'vip', label: 'Г-банкетка 5', type: 'booth' },
            { id: 'f1-b6', x: 86, y: 48, w: 14, h: 13, seats: 6, zone: 'vip', label: 'Г-банкетка 6', type: 'booth' },

            { id: 'f1-t7', x: 36, y: 68, w: 12, h: 10, seats: 4, zone: 'standard', label: 'Стіл 7', type: 'tilted' },
            { id: 'f1-t8', x: 52, y: 68, w: 12, h: 10, seats: 4, zone: 'standard', label: 'Стіл 8', type: 'tilted' },

            { id: 'f1-t9', x: 18, y: 80, w: 24, h: 8, seats: 8, zone: 'vip', label: 'Стіл 9', type: 'standard' },
            { id: 'f1-t10', x: 58, y: 80, w: 24, h: 8, seats: 8, zone: 'vip', label: 'Стіл 10', type: 'standard' },

            { id: 'f1-bar', x: 10, y: 92, w: 80, h: 4, seats: 0, zone: 'bar', label: 'Бар', type: 'decoration' }
        ]
    },
    floor2: {
        zones: {
            vip: { name: 'VIP', color: '#5a8a20' }
        },
        tables: [
            { id: 'f2-t4', x: 0, y: 44, w: 14, h: 18, seats: 8, zone: 'vip', label: 'VIP 4', type: 'booth' },
            { id: 'f2-t5', x: 0, y: 22, w: 14, h: 14, seats: 6, zone: 'vip', label: 'VIP 5', type: 'booth' },
            { id: 'f2-t6', x: 0, y: 0, w: 14, h: 18, seats: 8, zone: 'vip', label: 'VIP 6', type: 'booth' },

            { id: 'f2-t2', x: 0, y: 86, w: 35, h: 14, seats: 6, zone: 'vip', label: 'VIP 2', type: 'booth' },
            { id: 'f2-t3', x: 40, y: 86, w: 35, h: 14, seats: 8, zone: 'vip', label: 'VIP 3', type: 'booth' }
        ]
    }
};

db.ref('tables_config').set(tablesConfig);

function loadTableStatus() {
    return new Promise(function(resolve) {
        db.ref('tables').once('value').then(function(snapshot) {
            var data = snapshot.val();
            if (data) { resolve(data); return; }
            var status = {};
            Object.keys(tablesConfig).forEach(function(floor) {
                tablesConfig[floor].tables.forEach(function(t) {
                    status[t.id] = { status: 'free', date: '', time: '', name: '', phone: '', seats: 0 };
                });
            });
            db.ref('tables').set(status);
            resolve(status);
        }).catch(function() {
            var status = {};
            Object.keys(tablesConfig).forEach(function(floor) {
                tablesConfig[floor].tables.forEach(function(t) {
                    status[t.id] = { status: 'free', date: '', time: '', name: '', phone: '', seats: 0 };
                });
            });
            resolve(status);
        });
    });
}

function saveTableStatus(status) {
    return db.ref('tables').set(status);
}

function listenTableStatus(callback) {
    db.ref('tables').on('value', function(snapshot) {
        var data = snapshot.val();
        if (data) callback(data);
    });
}

var tableStatus = {};

loadTableStatus().then(function(data) {
    tableStatus = data;
    renderAll();
});

listenTableStatus(function(data) {
    tableStatus = data;
    renderAll();
});

function renderFloor(floorNum) {
    var container = document.getElementById('floor' + floorNum);
    container.innerHTML = '';
    var floor = tablesConfig['floor' + floorNum];

    if (floorNum === 1) {
        var entrance = document.createElement('div');
        entrance.className = 'entrance';
        entrance.style.cssText = 'right:0;bottom:20%;left:auto;transform:none;width:40px;height:40px;border-radius:8px 0 0 8px;';
        entrance.textContent = 'Вхід';
        container.appendChild(entrance);
    }

    if (floorNum === 2) {
        var entrance2 = document.createElement('div');
        entrance2.className = 'entrance';
        entrance2.style.cssText = 'right:0;bottom:20%;left:auto;transform:none;width:40px;height:40px;border-radius:8px 0 0 8px;';
        entrance2.textContent = 'Вхід';
        container.appendChild(entrance2);

        var staircase = document.createElement('div');
        staircase.className = 'staircase';
        staircase.style.cssText = 'right:0;bottom:10%;left:auto;transform:none;width:40px;height:30px;';
        staircase.textContent = 'Сходи';
        container.appendChild(staircase);
    }

    floor.tables.forEach(function(table) {
        if (table.type === 'wall') return;

        if (table.type === 'decoration') {
            var dec = document.createElement('div');
            dec.className = 'entrance';
            dec.style.cssText = 'left:' + table.x + '%;top:' + table.y + '%;width:' + table.w + '%;height:' + table.h + '%;border-radius:4px;bottom:auto;transform:none;';
            dec.textContent = table.label || 'Бар';
            container.appendChild(dec);
            return;
        }

        var el = document.createElement('div');
        var status = tableStatus[table.id] || { status: 'free' };
        el.className = 'table-seat table-seat--' + table.type + ' ' + status.status;
        el.dataset.id = table.id;
        el.style.cssText = 'left:' + table.x + '%;top:' + table.y + '%;width:' + table.w + '%;height:' + table.h + '%;';

        var text = document.createElement('span');
        if (table.seats > 0) {
            var bookedSeats = status.seats || 0;
            text.innerHTML = table.seats;
            if (bookedSeats > 0) {
                text.innerHTML += ' <span style="color:#ef4444;font-size:0.7em">(' + bookedSeats + ')</span>';
            }
        }
        el.appendChild(text);

        var label = document.createElement('span');
        label.className = 'table-seat__label';
        label.textContent = table.label;
        el.appendChild(label);

        el.addEventListener('click', function() { showTableInfo(table); });
        container.appendChild(el);
    });
}

function showTableInfo(table) {
    document.querySelectorAll('.table-seat').forEach(function(el) { el.classList.remove('selected'); });
    var el = document.querySelector('[data-id="' + table.id + '"]');
    if (el) el.classList.add('selected');

    var panel = document.getElementById('tableInfoPanel');
    var status = tableStatus[table.id] || { status: 'free' };
    var floorName = table.id.startsWith('f1') ? '1 поверх' : '2 поверх';
    var zoneConfig = tablesConfig[table.id.startsWith('f1') ? 'floor1' : 'floor2'].zones[table.zone];

    document.getElementById('tableInfoTitle').textContent = table.label;
    document.getElementById('tableInfoZone').textContent = 'Зона: ' + (zoneConfig ? zoneConfig.name : table.zone) + ' (' + floorName + ')';
    var bookedSeats = status.seats || 0;
    var availableSeats = table.seats - bookedSeats;
    document.getElementById('tableInfoSeats').innerHTML = 'Місць: ' + table.seats + (bookedSeats > 0 ? ' <span style="color:#ef4444">(зайнято ' + bookedSeats + ')</span>' : '') + ' <span style="color:#10b981">(вільно ' + availableSeats + ')</span>';

    var bookBtn = document.getElementById('bookTableBtn');
    var sellBtn = document.getElementById('sellTableBtn');
    var cancelBtn = document.getElementById('cancelBookBtn');
    var bookedInfo = document.getElementById('tableInfoBooked');

    bookBtn.style.display = 'none';
    sellBtn.style.display = 'none';
    cancelBtn.style.display = 'none';
    bookedInfo.style.display = 'none';

    if (status.status === 'sold') {
        document.getElementById('tableInfoStatus').textContent = 'Статус: Продано';
        document.getElementById('tableInfoStatus').style.color = '#8b5cf6';
        bookedInfo.style.display = 'block';
        document.getElementById('tableInfoBookedDetails').textContent = status.date + ' ' + status.time + ' — ' + status.name + ' — ' + (status.amount || 0) + ' грн';
    } else if (status.status === 'reserved') {
        document.getElementById('tableInfoStatus').textContent = 'Статус: Зарезервовано';
        document.getElementById('tableInfoStatus').style.color = '#f59e0b';
        bookedInfo.style.display = 'block';
        document.getElementById('tableInfoBookedDetails').textContent = status.date + ' ' + status.time + ' — ' + status.name + ' (' + bookedSeats + ' міс.)';
        if (isAdmin) {
            sellBtn.style.display = 'block';
            cancelBtn.style.display = 'block';
        }
    } else if (status.status === 'free') {
        document.getElementById('tableInfoStatus').textContent = 'Статус: Вільний';
        document.getElementById('tableInfoStatus').style.color = '#10b981';
        if (isAdmin) {
            bookBtn.style.display = 'block';
        }
    }

    panel.classList.add('active');

    bookBtn.onclick = function() {
        if (!isAdmin) return;
        openBookingModal(table);
    };
    sellBtn.onclick = function() {
        if (!isAdmin) return;
        openSellModal(table);
    };
    cancelBtn.onclick = function() { cancelBooking(table); };
}

function openBookingModal(table) {
    document.getElementById('bookTableId').value = table.id;
    document.getElementById('tableInfoPanel').classList.remove('active');
    document.getElementById('bookingModal').style.display = 'flex';

    var status = tableStatus[table.id] || { status: 'free', seats: 0 };
    var available = table.seats - (status.seats || 0);
    var guestsSelect = document.getElementById('bookGuests');
    guestsSelect.innerHTML = '<option value="">Оберіть кількість</option>';
    for (var i = 1; i <= available; i++) {
        var opt = document.createElement('option');
        opt.value = i;
        opt.textContent = i + ' місце' + (i > 1 && i < 5 ? 'а' : i >= 5 ? 'ь' : '');
        guestsSelect.appendChild(opt);
    }

    if (isMiniApp && tg.initDataUnsafe.user) {
        var u = tg.initDataUnsafe.user;
        document.getElementById('bookName').value = u.first_name + (u.last_name ? ' ' + u.last_name : '');
    }
}

function cancelBooking(table) {
    var status = tableStatus[table.id];
    if (status) {
        var update = {};
        update[table.id + '/status'] = 'free';
        update[table.id + '/date'] = '';
        update[table.id + '/time'] = '';
        update[table.id + '/name'] = '';
        update[table.id + '/phone'] = '';
        update[table.id + '/seats'] = 0;
        db.ref('tables').update(update);
    }
}

function openSellModal(table) {
    document.getElementById('sellTableId').value = table.id;
    var status = tableStatus[table.id] || {};
    var floorName = table.id.startsWith('f1') ? '1 поверх' : '2 поверх';
    document.getElementById('sellTableInfo').textContent = table.label + ' (' + floorName + ') — ' + (status.seats || 0) + ' міс.';
    document.getElementById('sellAmount').value = '';
    document.getElementById('tableInfoPanel').classList.remove('active');
    document.getElementById('sellModal').style.display = 'flex';
}

document.getElementById('closeSellModal').addEventListener('click', function() {
    document.getElementById('sellModal').style.display = 'none';
});

document.getElementById('sellModal').addEventListener('click', function(e) {
    if (e.target === this) this.style.display = 'none';
});

document.getElementById('sellForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var tableId = document.getElementById('sellTableId').value;
    var amount = parseInt(document.getElementById('sellAmount').value);
    if (!tableId || !amount || amount < 1) return;

    var status = tableStatus[tableId] || {};
    var sellerName = '';
    if (isMiniApp && tg.initDataUnsafe.user) {
        var u = tg.initDataUnsafe.user;
        sellerName = u.first_name + (u.last_name ? ' ' + u.last_name : '');
    }

    var update = {};
    update[tableId + '/status'] = 'sold';
    update[tableId + '/amount'] = amount;
    update[tableId + '/soldBy'] = sellerName;
    update[tableId + '/soldAt'] = Date.now();
    db.ref('tables').update(update);

    db.ref('sales').push({
        tableId: tableId,
        tableLabel: findTableLabel(tableId),
        zone: status.zone || '',
        date: status.date || '',
        time: status.time || '',
        name: status.name || '',
        phone: status.phone || '',
        seats: status.seats || 0,
        amount: amount,
        soldBy: sellerName,
        soldAt: Date.now()
    });

    document.getElementById('sellModal').style.display = 'none';
    document.getElementById('sellAmount').value = '';
});

function findTableLabel(tableId) {
    var label = tableId;
    Object.keys(tablesConfig).forEach(function(floor) {
        tablesConfig[floor].tables.forEach(function(t) {
            if (t.id === tableId) label = t.label;
        });
    });
    return label;
}

function closeShift() {
    db.ref('sales').once('value').then(function(snap) {
        var sales = snap.val() || {};
        var keys = Object.keys(sales);
        if (keys.length === 0) {
            alert('Немає продаж за цю зміну');
            return;
        }

        var total = 0;
        var items = '';
        keys.forEach(function(k, i) {
            var s = sales[k];
            total += s.amount || 0;
            items += (i + 1) + '. ' + (s.tableLabel || s.tableId) + ' — ' + (s.amount || 0) + ' грн' + (s.soldBy ? ' (' + s.soldBy + ')' : '') + '\n';
        });

        var msg = '📊 *Звіт по зміні*\n\n' +
            items + '\n' +
            '💰 *Загалом:* ' + total + ' грн\n' +
            '📋 *Продаж:* ' + keys.length;

        fetch('https://api.telegram.org/bot' + TG_BOT_TOKEN + '/sendMessage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: TG_CHAT_ID, text: msg, parse_mode: 'Markdown' })
        }).then(function() {
            db.ref('sales').remove();
            alert('Звіт надіслано в групу!');
        });
    });
}

document.getElementById('closeShiftBtn').addEventListener('click', function() {
    if (confirm('Надіслати звіт по зміні в групу?')) {
        closeShift();
    }
});

document.querySelectorAll('.floor-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.floor-btn').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var floor = parseInt(btn.dataset.floor);
        document.querySelectorAll('.tables-floor').forEach(function(f) { f.classList.remove('active'); });
        document.getElementById('floor' + floor).classList.add('active');
        document.getElementById('tableInfoPanel').classList.remove('active');
    });
});

document.getElementById('closePanel').addEventListener('click', function() {
    document.getElementById('tableInfoPanel').classList.remove('active');
    document.querySelectorAll('.table-seat').forEach(function(el) { el.classList.remove('selected'); });
});

document.getElementById('closeModal').addEventListener('click', function() {
    document.getElementById('bookingModal').style.display = 'none';
});

document.getElementById('bookingModal').addEventListener('click', function(e) {
    if (e.target === this) this.style.display = 'none';
});

var phoneInput = document.getElementById('bookPhone');
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
}

var dateInput = document.getElementById('bookDate');
if (dateInput) {
    dateInput.addEventListener('input', function(e) {
        var digits = e.target.value.replace(/\D/g, '');
        if (digits.length === 0) { e.target.value = ''; return; }
        var f = digits.substring(0, 2);
        if (digits.length > 2) f += '.' + digits.substring(2, 4);
        if (digits.length > 4) f += '.' + digits.substring(4, 8);
        e.target.value = f;
    });
}

document.getElementById('tableBookingForm').addEventListener('submit', function(e) {
    e.preventDefault();

    var tableId = document.getElementById('bookTableId').value;
    var name = document.getElementById('bookName').value.trim();
    var phone = document.getElementById('bookPhone').value;
    var date = document.getElementById('bookDate').value;
    var time = document.getElementById('bookTime').value;
    var guests = parseInt(document.getElementById('bookGuests').value);

    if (name.length < 2) return;
    var phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) return;
    if (!date || date.length < 10) return;
    if (!time) return;
    if (!guests || guests < 1) return;

    var table = null;
    Object.keys(tablesConfig).forEach(function(floor) {
        tablesConfig[floor].tables.forEach(function(t) {
            if (t.id === tableId) table = t;
        });
    });
    if (!table) return;

    var currentStatus = tableStatus[tableId] || { status: 'free', seats: 0 };
    var currentSeats = currentStatus.seats || 0;
    if (currentSeats + guests > table.seats) return;

    var newSeats = currentSeats + guests;
    var update = {};
    update[tableId + '/status'] = 'reserved';
    update[tableId + '/date'] = date;
    update[tableId + '/time'] = time;
    update[tableId + '/name'] = name;
    update[tableId + '/phone'] = phone;
    update[tableId + '/seats'] = newSeats;
    db.ref('tables').update(update);

    var zoneLabels = { vip: 'VIP', standard: 'Стандарт', bar: 'Бар', lounge: 'Лаунж' };
    var floorName = tableId.startsWith('f1') ? '1 поверх' : '2 поверх';

    var msg = '🎾 *Нова заявка на бронювання стола*\n\n';
    if (isMiniApp && tg.initDataUnsafe.user) {
        var u = tg.initDataUnsafe.user;
        msg += '🆔 *Telegram:* @' + (u.username || 'немає') + ' (ID: ' + u.id + ')\n';
    }
    msg += '🪑 *Стіл:* ' + table.label + ' (' + floorName + ')\n';
    msg += '💎 *Зона:* ' + (zoneLabels[table.zone] || table.zone) + '\n';
    msg += '👤 *Ім\'я:* ' + name + '\n';
    msg += '📞 *Телефон:* ' + phone + '\n';
    msg += '📅 *Дата:* ' + date + '\n';
    msg += '🕐 *Час:* ' + time + '\n';
    msg += '👥 *Заброньовано місць:* ' + guests + ' з ' + table.seats;

    var btn = document.getElementById('bookSubmitBtn');
    btn.textContent = 'Надсилаємо...';
    btn.disabled = true;

    fetch('https://api.telegram.org/bot' + TG_BOT_TOKEN + '/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TG_CHAT_ID, text: msg, parse_mode: 'Markdown' })
    })
    .then(function(r) { return r.json(); })
    .then(function(res) {
        if (res.ok) {
            btn.textContent = '✅ Заявку надіслано!';
            btn.style.background = '#10b981';
            setTimeout(function() {
                document.getElementById('bookingModal').style.display = 'none';
                btn.textContent = 'Забронювати';
                btn.style.background = '';
                btn.disabled = false;
                document.getElementById('tableBookingForm').reset();
// renderAll is called after Firebase loads data
            }, 1500);
        } else { throw new Error(); }
    })
    .catch(function() {
        btn.textContent = '❌ Помилка';
        btn.style.background = '#ef4444';
        setTimeout(function() {
            btn.textContent = 'Забронювати';
            btn.style.background = '';
            btn.disabled = false;
        }, 2000);
    });
});

renderAll();
