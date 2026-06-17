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

if (window.location.search.indexOf('admin') !== -1) {
    isAdmin = true;
}

if (tg && isMiniApp) {
    tg.ready();
    tg.expand();
    tg.setHeaderColor('#0a0a0a');
    tg.setBackgroundColor('#0a0a0a');
    checkAdmin(tg.initDataUnsafe.user.id);
} else if (isAdmin) {
    updateUI();
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
            var selectedEl = document.querySelector('.table-seat.selected');
            if (selectedEl) {
                var tableId = selectedEl.dataset.id;
                var table = findTableById(tableId);
                if (table) showTableInfo(table);
            }
        })
        .catch(function() { isAdmin = false; updateUI(); });
}

function findTableById(tableId) {
    var found = null;
    Object.keys(tablesConfig).forEach(function(floor) {
        tablesConfig[floor].tables.forEach(function(t) {
            if (t.id === tableId) found = t;
        });
    });
    return found;
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
        if (bookBtn) bookBtn.style.display = 'none';
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
            { id: 'f1-b1', x: 0, y: 0, w: 14, h: 13, seats: 6, zone: 'vip', label: 'Банкетка 1', type: 'booth' },
            { id: 'f1-b2', x: 86, y: 0, w: 14, h: 13, seats: 6, zone: 'vip', label: 'Банкетка 2', type: 'booth' },

            { id: 'f1-t1', x: 28, y: 4, w: 13, h: 12, seats: 4, zone: 'standard', label: 'Стіл 1', type: 'tilted' },
            { id: 'f1-t2', x: 59, y: 4, w: 13, h: 12, seats: 4, zone: 'standard', label: 'Стіл 2', type: 'tilted' },

            { id: 'f1-b3', x: 0, y: 20, w: 14, h: 20, seats: 8, zone: 'vip', label: 'Банкетка 3', type: 'booth' },
            { id: 'f1-b4', x: 86, y: 20, w: 14, h: 20, seats: 8, zone: 'vip', label: 'Банкетка 4', type: 'booth' },

            { id: 'f1-t3', x: 28, y: 24, w: 12, h: 12, seats: 4, zone: 'standard', label: 'Стіл 3', type: 'standard' },
            { id: 'f1-t4', x: 60, y: 24, w: 12, h: 12, seats: 4, zone: 'standard', label: 'Стіл 4', type: 'standard' },

            { id: 'f1-t5', x: 26, y: 46, w: 13, h: 12, seats: 4, zone: 'standard', label: 'Стіл 5', type: 'tilted' },
            { id: 'f1-t6', x: 61, y: 46, w: 13, h: 12, seats: 4, zone: 'standard', label: 'Стіл 6', type: 'tilted' },

            { id: 'f1-b5', x: 0, y: 48, w: 14, h: 13, seats: 6, zone: 'vip', label: 'Банкетка 5', type: 'booth' },
            { id: 'f1-b6', x: 86, y: 48, w: 14, h: 13, seats: 6, zone: 'vip', label: 'Банкетка 6', type: 'booth' },

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

function getTableReservations(tableId) {
    var status = tableStatus[tableId] || {};
    if (status.reservations && typeof status.reservations === 'object') {
        return status.reservations;
    }
    if (status.status && status.status !== 'free' && status.name) {
        return { _legacy: { name: status.name, phone: status.phone || '', date: status.date || '', time: status.time || '', seats: status.seats || 0, status: status.status === 'sold' ? 'sold' : 'reserved' } };
    }
    return {};
}

function calcTableReserved(tableId) {
    var res = getTableReservations(tableId);
    var total = 0;
    Object.keys(res).forEach(function(k) {
        if (res[k].status === 'reserved') total += (res[k].seats || 0);
    });
    return total;
}

function calcTableSold(tableId) {
    var res = getTableReservations(tableId);
    var total = 0;
    Object.keys(res).forEach(function(k) {
        if (res[k].status === 'sold') total += (res[k].seats || 0);
    });
    return total;
}

function getTableDisplayStatus(tableId) {
    var res = getTableReservations(tableId);
    var keys = Object.keys(res);
    if (keys.length === 0) return 'free';
    var hasReserved = false;
    var allSold = true;
    keys.forEach(function(k) {
        if (res[k].status === 'reserved') hasReserved = true;
        if (res[k].status !== 'sold') allSold = false;
    });
    if (allSold) return 'sold';
    if (hasReserved) return 'reserved';
    return 'free';
}

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
        var displayStatus = getTableDisplayStatus(table.id);
        var bookedSeats = calcTableReserved(table.id);
        var soldSeats = calcTableSold(table.id);
        var totalSeats = table.seats || 1;
        var freeSeats = totalSeats - bookedSeats - soldSeats;

        var soldPct = Math.round((soldSeats / totalSeats) * 100);
        var reservedPct = Math.round((bookedSeats / totalSeats) * 100);
        var freePct = 100 - soldPct - reservedPct;

        var gradient = 'linear-gradient(to right';
        var pos = 0;
        if (soldPct > 0) {
            gradient += ', #8b5cf6 ' + pos + '%, #8b5cf6 ' + (pos + soldPct) + '%';
            pos += soldPct;
        }
        if (reservedPct > 0) {
            gradient += ', #f59e0b ' + pos + '%, #f59e0b ' + (pos + reservedPct) + '%';
            pos += reservedPct;
        }
        if (freePct > 0) {
            gradient += ', #10b981 ' + pos + '%, #10b981 ' + (pos + freePct) + '%';
        }
        gradient += ')';

        el.className = 'table-seat table-seat--' + table.type + ' ' + displayStatus;
        el.dataset.id = table.id;
        el.style.cssText = 'left:' + table.x + '%;top:' + table.y + '%;width:' + table.w + '%;height:' + table.h + '%;background:' + gradient + ';border:2px solid ' + (soldPct === 100 ? '#8b5cf6' : reservedPct > 0 ? '#f59e0b' : '#10b981') + ';';

        var text = document.createElement('span');
        if (table.seats > 0) {
            text.innerHTML = table.seats;
            if (bookedSeats > 0 || soldSeats > 0) {
                var parts = [];
                if (soldSeats > 0) parts.push('<span style="color:#c4b5fd">' + soldSeats + '</span>');
                if (bookedSeats > 0) parts.push('<span style="color:#fde68a">' + bookedSeats + '</span>');
                text.innerHTML += ' (' + parts.join('/') + ')';
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
    var floorName = table.id.startsWith('f1') ? '1 поверх' : '2 поверх';
    var zoneConfig = tablesConfig[table.id.startsWith('f1') ? 'floor1' : 'floor2'].zones[table.zone];
    var bookedSeats = calcTableReserved(table.id);
    var soldSeats = calcTableSold(table.id);
    var availableSeats = table.seats - bookedSeats - soldSeats;

    document.getElementById('tableInfoTitle').textContent = table.label;
    document.getElementById('tableInfoZone').textContent = 'Зона: ' + (zoneConfig ? zoneConfig.name : table.zone) + ' (' + floorName + ')';

    var bookBtn = document.getElementById('bookTableBtn');
    bookBtn.style.display = 'none';

    var reservationsList = document.getElementById('reservationsList');
    if (!reservationsList) {
        reservationsList = document.createElement('div');
        reservationsList.id = 'reservationsList';
        reservationsList.style.cssText = 'margin-top:12px;border-top:1px solid #333;padding-top:12px;';
        document.querySelector('.table-info-panel__body').appendChild(reservationsList);
    }
    reservationsList.innerHTML = '';

    if (isAdmin) {
        var displayStatus = getTableDisplayStatus(table.id);
        var statusColors = { free: '#10b981', reserved: '#f59e0b', sold: '#8b5cf6' };
        var statusLabels = { free: 'Вільний', reserved: 'Зарезервовано', sold: 'Продано' };
        document.getElementById('tableInfoStatus').textContent = 'Статус: ' + (statusLabels[displayStatus] || displayStatus);
        document.getElementById('tableInfoStatus').style.color = statusColors[displayStatus] || '#888';
        document.getElementById('tableInfoSeats').innerHTML =
            'Місць: ' + table.seats +
            (bookedSeats > 0 ? ' <span style="color:#f59e0b">(зарез. ' + bookedSeats + ')</span>' : '') +
            (soldSeats > 0 ? ' <span style="color:#8b5cf6">(продано ' + soldSeats + ')</span>' : '') +
            (availableSeats > 0 ? ' <span style="color:#10b981">(вільно ' + availableSeats + ')</span>' : '');

        var reservations = getTableReservations(table.id);
        var resKeys = Object.keys(reservations);
        if (resKeys.length > 0) {
            resKeys.forEach(function(k) {
                var r = reservations[k];
                var item = document.createElement('div');
                item.style.cssText = 'background:#222;border-radius:8px;padding:10px;margin-bottom:8px;font-family:Montserrat,sans-serif;font-size:0.8rem;color:#ccc;';
                var rStatus = r.status === 'sold' ? '✅ Продано' : '🟡 Зарезервовано';
                var rColor = r.status === 'sold' ? '#8b5cf6' : '#f59e0b';
                item.innerHTML =
                    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">' +
                        '<span style="font-weight:600;color:#fff">' + r.name + '</span>' +
                        '<span style="color:' + rColor + ';font-size:0.75rem">' + rStatus + '</span>' +
                    '</div>' +
                    '<div style="font-size:0.75rem;color:#999">' +
                        '📅 ' + r.date + ' ' + r.time + ' · 👥 ' + r.seats + ' міс.' +
                        (r.amount ? ' · 💰 ' + r.amount + ' грн' : '') +
                    '</div>';
                if (r.status === 'reserved') {
                    var actions = document.createElement('div');
                    actions.style.cssText = 'display:flex;gap:6px;margin-top:8px;';
                    var sellR = document.createElement('button');
                    sellR.textContent = '💰 Продати';
                    sellR.style.cssText = 'flex:1;padding:6px;border:none;border-radius:6px;background:#8b5cf6;color:#fff;font-size:0.75rem;font-weight:600;cursor:pointer;';
                    sellR.onclick = function(e) { e.stopPropagation(); openSellModal(table, k, r); };
                    var cancelR = document.createElement('button');
                    cancelR.textContent = '✕ Скасувати';
                    cancelR.style.cssText = 'flex:1;padding:6px;border:none;border-radius:6px;background:#ef4444;color:#fff;font-size:0.75rem;font-weight:600;cursor:pointer;';
                    cancelR.onclick = function(e) { e.stopPropagation(); cancelReservation(table.id, k); };
                    actions.appendChild(sellR);
                    actions.appendChild(cancelR);
                    item.appendChild(actions);
                }
                reservationsList.appendChild(item);
            });
        }

        if (availableSeats > 0) {
            bookBtn.style.display = 'block';
        }
    } else {
        document.getElementById('tableInfoStatus').textContent = availableSeats > 0 ? 'Є вільні місця' : 'Немає вільних місць';
        document.getElementById('tableInfoStatus').style.color = availableSeats > 0 ? '#10b981' : '#ef4444';
        document.getElementById('tableInfoSeats').textContent = 'Всього: ' + table.seats + ' · Вільно: ' + availableSeats;
        if (availableSeats > 0) {
            bookBtn.style.display = 'block';
        }
    }

    document.getElementById('tableInfoBooked').style.display = 'none';

    panel.classList.add('active');

    bookBtn.onclick = function() {
        openBookingModal(table);
    };
}

function openBookingModal(table) {
    document.getElementById('bookTableId').value = table.id;
    document.getElementById('tableInfoPanel').classList.remove('active');
    document.getElementById('bookingModal').style.display = 'flex';

    populateDatePickers();

    var available = table.seats - calcTableReserved(table.id) - calcTableSold(table.id);
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

function cancelReservation(tableId, reservationId) {
    if (!confirm('Скасувати цю бронь?')) return;
    db.ref('tables/' + tableId + '/reservations/' + reservationId).remove();
}

function openSellModal(table, reservationId, reservation) {
    document.getElementById('sellTableId').value = table.id;
    document.getElementById('sellReservationId').value = reservationId;
    var floorName = table.id.startsWith('f1') ? '1 поверх' : '2 поверх';
    document.getElementById('sellTableInfo').textContent = table.label + ' (' + floorName + ') — ' + reservation.name + ' — ' + reservation.seats + ' міс.';
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
    var reservationId = document.getElementById('sellReservationId').value;
    var amount = parseInt(document.getElementById('sellAmount').value);
    if (!tableId || !reservationId || !amount || amount < 1) return;

    var reservations = getTableReservations(tableId);
    var r = reservations[reservationId];
    if (!r) return;

    var sellerName = '';
    if (isMiniApp && tg.initDataUnsafe.user) {
        var u = tg.initDataUnsafe.user;
        sellerName = u.first_name + (u.last_name ? ' ' + u.last_name : '');
    }

    db.ref('tables/' + tableId + '/reservations/' + reservationId).update({
        status: 'sold',
        amount: amount,
        soldBy: sellerName,
        soldAt: Date.now()
    });

    db.ref('sales').push({
        tableId: tableId,
        tableLabel: findTableLabel(tableId),
        reservationName: r.name,
        reservationPhone: r.phone || '',
        date: r.date || '',
        time: r.time || '',
        seats: r.seats || 0,
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
var bookDay = document.getElementById('bookDay');
var bookMonth = document.getElementById('bookMonth');
var bookYear = document.getElementById('bookYear');
var monthNames = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'];

function padZero(n) { return n < 10 ? '0' + n : '' + n; }

function populateDatePickers() {
    var now = new Date();
    var curYear = now.getFullYear();
    bookYear.innerHTML = '<option value="">Рік</option>';
    for (var y = curYear; y <= curYear + 1; y++) {
        var o = document.createElement('option');
        o.value = y; o.textContent = y;
        bookYear.appendChild(o);
    }
    bookMonth.innerHTML = '<option value="">Місяць</option>';
    for (var m = 1; m <= 12; m++) {
        var o = document.createElement('option');
        o.value = padZero(m); o.textContent = monthNames[m - 1];
        bookMonth.appendChild(o);
    }
    updateDays();
}

function updateDays() {
    var y = parseInt(bookYear.value) || 2026;
    var m = parseInt(bookMonth.value) || 1;
    var dim = new Date(y, m, 0).getDate();
    var curDay = bookDay.value;
    bookDay.innerHTML = '<option value="">День</option>';
    for (var d = 1; d <= dim; d++) {
        var o = document.createElement('option');
        o.value = padZero(d); o.textContent = d;
        bookDay.appendChild(o);
    }
    if (curDay && parseInt(curDay) <= dim) bookDay.value = curDay;
    updateHiddenDate();
}

function updateHiddenDate() {
    if (bookDay.value && bookMonth.value && bookYear.value) {
        dateInput.value = bookDay.value + '.' + bookMonth.value + '.' + bookYear.value;
    } else {
        dateInput.value = '';
    }
}

if (bookDay) bookDay.addEventListener('change', updateHiddenDate);
if (bookMonth) bookMonth.addEventListener('change', function() { updateDays(); updateHiddenDate(); });
if (bookYear) bookYear.addEventListener('change', function() { updateDays(); updateHiddenDate(); });

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

    var reserved = calcTableReserved(tableId);
    var sold = calcTableSold(tableId);
    if (reserved + sold + guests > table.seats) return;

    var sellerName = '';
    if (isMiniApp && tg.initDataUnsafe.user) {
        var u = tg.initDataUnsafe.user;
        sellerName = u.first_name + (u.last_name ? ' ' + u.last_name : '');
    }

    var zoneLabels = { vip: 'VIP', standard: 'Стандарт', bar: 'Бар' };
    var floorName = tableId.startsWith('f1') ? '1 поверх' : '2 поверх';

    var btn = document.getElementById('bookSubmitBtn');
    btn.textContent = 'Надсилаємо...';
    btn.disabled = true;

    if (isAdmin) {
        db.ref('tables/' + tableId + '/reservations').push({
            name: name,
            phone: phone,
            date: date,
            time: time,
            seats: guests,
            status: 'reserved',
            createdAt: Date.now(),
            createdBy: sellerName
        });

        var msg = '🎾 *Нова бронь (адмін)*\n\n';
        msg += '🪑 *Стіл:* ' + table.label + ' (' + floorName + ')\n';
        msg += '💎 *Зона:* ' + (zoneLabels[table.zone] || table.zone) + '\n';
        msg += '👤 *Ім\'я:* ' + name + '\n';
        msg += '📞 *Телефон:* ' + phone + '\n';
        msg += '📅 *Дата:* ' + date + '\n';
        msg += '🕐 *Час:* ' + time + '\n';
        msg += '👥 *Місць:* ' + guests;

        fetch('https://api.telegram.org/bot' + TG_BOT_TOKEN + '/sendMessage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: TG_CHAT_ID, text: msg, parse_mode: 'Markdown' })
        }).then(function() {
            btn.textContent = '✅ Заброньовано!';
            btn.style.background = '#10b981';
            setTimeout(function() {
                document.getElementById('bookingModal').style.display = 'none';
                btn.textContent = 'Забронювати';
                btn.style.background = '';
                btn.disabled = false;
                document.getElementById('tableBookingForm').reset();
            }, 1500);
        }).catch(function() {
            btn.textContent = '❌ Помилка';
            btn.style.background = '#ef4444';
            setTimeout(function() {
                btn.textContent = 'Забронювати';
                btn.style.background = '';
                btn.disabled = false;
            }, 2000);
        });
    } else {
        var pendingRef = db.ref('pending_bookings').push();
        var pendingId = pendingRef.key;
        var tgUserId = (isMiniApp && tg.initDataUnsafe.user) ? tg.initDataUnsafe.user.id : null;
        var tgUsername = (isMiniApp && tg.initDataUnsafe.user) ? (tg.initDataUnsafe.user.username || '') : '';

        pendingRef.set({
            name: name,
            phone: phone,
            date: date,
            time: time,
            tableId: tableId,
            tableLabel: table.label,
            zone: table.zone,
            floor: tableId.startsWith('f1') ? '1' : '2',
            seats: guests,
            tgUserId: tgUserId,
            tgUsername: tgUsername,
            createdAt: Date.now()
        }).then(function() {
            var msg = '🎾 *Нова заявка на бронювання*\n\n';
            if (tgUserId) {
                msg += '🆔 *Telegram:* @' + (tgUsername || 'немає') + ' (ID: ' + tgUserId + ')\n';
            }
            msg += '🪑 *Стіл:* ' + table.label + ' (' + floorName + ')\n';
            msg += '💎 *Зона:* ' + (zoneLabels[table.zone] || table.zone) + '\n';
            msg += '👤 *Ім\'я:* ' + name + '\n';
            msg += '📞 *Телефон:* ' + phone + '\n';
            msg += '📅 *Дата:* ' + date + '\n';
            msg += '🕐 *Час:* ' + time + '\n';
            msg += '👥 *Місць:* ' + guests;

            var inlineKeyboard = {
                inline_keyboard: [[
                    { text: '✅ Одобрити', callback_data: 'approve_' + pendingId },
                    { text: '❌ Скасувати', callback_data: 'cancel_' + pendingId }
                ]]
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
                setTimeout(function() {
                    document.getElementById('bookingModal').style.display = 'none';
                    btn.textContent = 'Забронювати';
                    btn.style.background = '';
                    btn.disabled = false;
                    document.getElementById('tableBookingForm').reset();
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
    }
});

renderAll();
