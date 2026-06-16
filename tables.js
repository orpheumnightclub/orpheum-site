var tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
var isMiniApp = tg && tg.initDataUnsafe && tg.initDataUnsafe.user;
var TG_BOT_TOKEN = '8841778405:AAGxnnq7rC_OqG8b4Po4ZuGur1o37XFs-Fg';
var TG_CHAT_ID = '-1004472996150';

if (tg && isMiniApp) {
    tg.ready();
    tg.expand();
    tg.setHeaderColor('#0a0a0a');
    tg.setBackgroundColor('#0a0a0a');
}

var STORAGE_KEY = 'orpheum_tables_data';

var tablesConfig = {
    floor1: {
        zones: {
            vip: { name: 'VIP', color: '#5a8a20' },
            standard: { name: 'Стандарт', color: '#333' },
            bar: { name: 'Бар', color: '#5a8a20' }
        },
        tables: [
            { id: 'f1-b1', x: 0, y: 0, w: 14, h: 13, seats: 6, zone: 'vip', label: 'Г-банкетка 1', type: 'booth' },
            { id: 'f1-t1', x: 28, y: 3, w: 12, h: 11, seats: 4, zone: 'standard', label: 'Стіл 1', type: 'tilted' },
            { id: 'f1-t2', x: 60, y: 3, w: 12, h: 11, seats: 4, zone: 'standard', label: 'Стіл 2', type: 'tilted' },
            { id: 'f1-b2', x: 86, y: 0, w: 14, h: 13, seats: 6, zone: 'vip', label: 'Г-банкетка 2', type: 'booth' },

            { id: 'f1-b3', x: 0, y: 18, w: 14, h: 18, seats: 8, zone: 'vip', label: 'Банкетка 3', type: 'booth' },
            { id: 'f1-t3', x: 28, y: 20, w: 11, h: 11, seats: 4, zone: 'standard', label: 'Стіл 3', type: 'standard' },
            { id: 'f1-t4', x: 61, y: 20, w: 11, h: 11, seats: 4, zone: 'standard', label: 'Стіл 4', type: 'standard' },
            { id: 'f1-b4', x: 86, y: 18, w: 14, h: 18, seats: 8, zone: 'vip', label: 'Банкетка 4', type: 'booth' },

            { id: 'f1-t5', x: 28, y: 38, w: 12, h: 11, seats: 4, zone: 'standard', label: 'Стіл 5', type: 'tilted' },
            { id: 'f1-t6', x: 60, y: 38, w: 12, h: 11, seats: 4, zone: 'standard', label: 'Стіл 6', type: 'tilted' },

            { id: 'f1-b5', x: 0, y: 44, w: 14, h: 13, seats: 6, zone: 'vip', label: 'Г-банкетка 5', type: 'booth' },
            { id: 'f1-t7', x: 28, y: 46, w: 11, h: 10, seats: 4, zone: 'standard', label: 'Стіл 7', type: 'standard' },
            { id: 'f1-t8', x: 61, y: 46, w: 11, h: 10, seats: 4, zone: 'standard', label: 'Стіл 8', type: 'standard' },
            { id: 'f1-b6', x: 86, y: 44, w: 14, h: 13, seats: 6, zone: 'vip', label: 'Г-банкетка 6', type: 'booth' },

            { id: 'f1-t9', x: 28, y: 60, w: 12, h: 11, seats: 4, zone: 'standard', label: 'Стіл 9', type: 'tilted' },
            { id: 'f1-t10', x: 60, y: 60, w: 12, h: 11, seats: 4, zone: 'standard', label: 'Стіл 10', type: 'tilted' },

            { id: 'f1-t11', x: 14, y: 74, w: 22, h: 8, seats: 8, zone: 'vip', label: 'Стіл 11', type: 'standard' },
            { id: 'f1-t12', x: 64, y: 74, w: 22, h: 8, seats: 8, zone: 'vip', label: 'Стіл 12', type: 'standard' },

            { id: 'f1-bar', x: 10, y: 86, w: 80, h: 5, seats: 0, zone: 'bar', label: 'Барна стійка', type: 'bar' },

            { id: 'f1-wall', x: 0, y: 83, w: 100, h: 0, seats: 0, zone: 'bar', label: '', type: 'wall' }
        ]
    },
    floor2: {
        zones: {
            vip: { name: 'VIP', color: '#5a8a20' },
            lounge: { name: 'Лаунж', color: '#8b5cf6' }
        },
        tables: [
            { id: 'f2-v1', x: 5, y: 5, w: 16, h: 12, seats: 10, zone: 'vip', label: 'VIP 1', type: 'booth' },
            { id: 'f2-v2', x: 79, y: 5, w: 16, h: 12, seats: 10, zone: 'vip', label: 'VIP 2', type: 'booth' },
            { id: 'f2-v3', x: 5, y: 78, w: 16, h: 12, seats: 10, zone: 'vip', label: 'VIP 3', type: 'booth' },
            { id: 'f2-v4', x: 79, y: 78, w: 16, h: 12, seats: 10, zone: 'vip', label: 'VIP 4', type: 'booth' },

            { id: 'f2-l1', x: 30, y: 10, w: 10, h: 10, seats: 4, zone: 'lounge', label: 'Лаунж 1', type: 'round' },
            { id: 'f2-l2', x: 60, y: 10, w: 10, h: 10, seats: 4, zone: 'lounge', label: 'Лаунж 2', type: 'round' },
            { id: 'f2-l3', x: 30, y: 35, w: 10, h: 10, seats: 4, zone: 'lounge', label: 'Лаунж 3', type: 'round' },
            { id: 'f2-l4', x: 60, y: 35, w: 10, h: 10, seats: 4, zone: 'lounge', label: 'Лаунж 4', type: 'round' },

            { id: 'f2-l5', x: 15, y: 55, w: 10, h: 10, seats: 6, zone: 'lounge', label: 'Лаунж 5', type: 'round' },
            { id: 'f2-l6', x: 45, y: 55, w: 10, h: 10, seats: 6, zone: 'lounge', label: 'Лаунж 6', type: 'round' },
            { id: 'f2-l7', x: 75, y: 55, w: 10, h: 10, seats: 6, zone: 'lounge', label: 'Лаунж 7', type: 'round' },

            { id: 'f2-l8', x: 30, y: 78, w: 10, h: 10, seats: 4, zone: 'lounge', label: 'Лаунж 8', type: 'round' },
            { id: 'f2-l9', x: 60, y: 78, w: 10, h: 10, seats: 4, zone: 'lounge', label: 'Лаунж 9', type: 'round' }
        ]
    }
};

function loadTableStatus() {
    try {
        var data = localStorage.getItem(STORAGE_KEY);
        if (data) return JSON.parse(data);
    } catch(e) {}
    var status = {};
    Object.keys(tablesConfig).forEach(function(floor) {
        tablesConfig[floor].tables.forEach(function(t) {
            status[t.id] = { status: 'free', date: '', time: '', name: '', phone: '' };
        });
    });
    return status;
}

function saveTableStatus(status) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(status));
}

var tableStatus = loadTableStatus();

function renderFloor(floorNum) {
    var container = document.getElementById('floor' + floorNum);
    container.innerHTML = '';
    var floor = tablesConfig['floor' + floorNum];

    if (floorNum === 1) {
        var entrance = document.createElement('div');
        entrance.className = 'entrance';
        entrance.style.cssText = 'right:0;bottom:12%;left:auto;transform:none;width:40px;height:40px;border-radius:8px 0 0 8px;';
        entrance.textContent = 'Вхід';
        container.appendChild(entrance);
    }

    if (floorNum === 2) {
        var stageArea = document.createElement('div');
        stageArea.className = 'dance-floor';
        stageArea.style.cssText = 'left:30%;top:42%;width:40%;height:16%;';
        stageArea.textContent = 'Лаунж зона';
        container.appendChild(stageArea);

        var staircase = document.createElement('div');
        staircase.className = 'staircase';
        staircase.style.cssText = 'left:44%;bottom:2%;width:12%;height:4%;';
        staircase.textContent = 'Сходи';
        container.appendChild(staircase);
    }

    floor.tables.forEach(function(table) {
        if (table.type === 'wall') return;

        var el = document.createElement('div');
        var status = tableStatus[table.id] || { status: 'free' };
        el.className = 'table-seat table-seat--' + table.type + ' ' + status.status;
        el.dataset.id = table.id;
        el.style.cssText = 'left:' + table.x + '%;top:' + table.y + '%;width:' + table.w + '%;height:' + table.h + '%;';

        var text = document.createElement('span');
        text.textContent = table.seats > 0 ? table.seats : '';
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
    document.getElementById('tableInfoSeats').textContent = 'Місць: ' + table.seats;

    var bookBtn = document.getElementById('bookTableBtn');
    var cancelBtn = document.getElementById('cancelBookBtn');
    var bookedInfo = document.getElementById('tableInfoBooked');

    if (status.status === 'free') {
        document.getElementById('tableInfoStatus').textContent = 'Статус: Вільний';
        document.getElementById('tableInfoStatus').style.color = '#10b981';
        bookBtn.style.display = 'block';
        cancelBtn.style.display = 'none';
        bookedInfo.style.display = 'none';
    } else if (status.status === 'booked') {
        document.getElementById('tableInfoStatus').textContent = 'Статус: Заброньовано';
        document.getElementById('tableInfoStatus').style.color = '#ef4444';
        bookBtn.style.display = 'none';
        cancelBtn.style.display = 'none';
        bookedInfo.style.display = 'block';
        document.getElementById('tableInfoBookedDetails').textContent = status.date + ' ' + status.time + ' — ' + status.name;
    } else if (status.status === 'reserved') {
        document.getElementById('tableInfoStatus').textContent = 'Статус: Зарезервовано';
        document.getElementById('tableInfoStatus').style.color = '#f59e0b';
        bookBtn.style.display = 'none';
        cancelBtn.style.display = 'block';
        bookedInfo.style.display = 'block';
        document.getElementById('tableInfoBookedDetails').textContent = status.date + ' ' + status.time + ' — ' + status.name;
    }

    panel.classList.add('active');

    bookBtn.onclick = function() { openBookingModal(table); };
    cancelBtn.onclick = function() { cancelBooking(table); };
}

function openBookingModal(table) {
    document.getElementById('bookTableId').value = table.id;
    document.getElementById('tableInfoPanel').classList.remove('active');
    document.getElementById('bookingModal').style.display = 'flex';

    if (isMiniApp && tg.initDataUnsafe.user) {
        var u = tg.initDataUnsafe.user;
        document.getElementById('bookName').value = u.first_name + (u.last_name ? ' ' + u.last_name : '');
    }
}

function cancelBooking(table) {
    var status = tableStatus[table.id];
    if (status) {
        status.status = 'free';
        status.date = '';
        status.time = '';
        status.name = '';
        status.phone = '';
        saveTableStatus(tableStatus);
        renderAll();
        showTableInfo(table);
    }
}

function renderAll() {
    renderFloor(1);
    renderFloor(2);
}

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

    if (name.length < 2) return;
    var phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) return;
    if (!date || date.length < 10) return;
    if (!time) return;

    var table = null;
    Object.keys(tablesConfig).forEach(function(floor) {
        tablesConfig[floor].tables.forEach(function(t) {
            if (t.id === tableId) table = t;
        });
    });
    if (!table) return;

    tableStatus[tableId] = { status: 'reserved', date: date, time: time, name: name, phone: phone };
    saveTableStatus(tableStatus);

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
    msg += '👥 *Місць:* ' + table.seats;

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
                renderAll();
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
