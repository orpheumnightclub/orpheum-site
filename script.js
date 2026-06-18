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

// ===== Intersection Observer for animations =====
var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

function observeElements() {
    document.querySelectorAll('.about__card, .event-card, .gallery__album, .contacts__item').forEach(function(el) {
        if (el.classList.contains('visible')) return;
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

observeElements();

var animStyle = document.createElement('style');
animStyle.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
document.head.appendChild(animStyle);

// ===== Gallery: date-based albums =====
var galleryAlbums = [
    {
        date: '19.06.2026',
        dayName: 'П\'ятниця',
        name: 'День Фермера',
        folder: '2026-06-19',
        images: ['https://res.cloudinary.com/deiitwupc/image/upload/v1781790286/orpheum/images/2026-06-19/2026-06-19.png', 'https://res.cloudinary.com/deiitwupc/image/upload/v1781790289/orpheum/images/2026-06-19/2026-06-19_2.png', 'https://res.cloudinary.com/deiitwupc/image/upload/v1781790292/orpheum/images/2026-06-19/2026-06-19_3.png'],
        poster: 'https://res.cloudinary.com/deiitwupc/image/upload/v1781790284/orpheum/images/2026-06-19/poster/2026.06.19.png'
    }
];

// ===== Events data =====
var eventsData = [
    { day: '19', month: 'Черв', name: 'День Фермера', time: '22:00 — 06:00', dj: 'RESIDENT DJs', price: '100 ₴', banner: 'https://res.cloudinary.com/deiitwupc/image/upload/v1781790264/orpheum/images/banners/2026-06-19.jpg', date: '2026-06-19' }
];

// Render events
var eventsGrid = document.getElementById('eventsGrid');
if (eventsGrid) {
    eventsData.forEach(function(ev) {
        var card = document.createElement('a');
        card.className = 'event-card';
        card.href = 'tables.html?date=' + ev.date;
        card.innerHTML =
            '<div class="event-card__bg" style="background-image:url(\'' + ev.banner + '\')"></div>' +
            '<div class="event-card__overlay"></div>' +
            '<div class="event-card__content">' +
                '<div class="event-card__date">' +
                    '<span class="event-card__day">' + ev.day + '</span>' +
                    '<span class="event-card__month">' + ev.month + '</span>' +
                '</div>' +
                '<div class="event-card__info">' +
                    '<h3 class="event-card__name">' + ev.name + '</h3>' +
                    '<p class="event-card__time">' + ev.time + '</p>' +
                    '<p class="event-card__dj">' + ev.dj + '</p>' +
                '</div>' +
                '<div class="event-card__price">' + ev.price + '</div>' +
            '</div>';
        eventsGrid.appendChild(card);
    });
    observeElements();
}

// Render album cards
var albumsContainer = document.getElementById('galleryAlbums');
if (albumsContainer) {
    galleryAlbums.forEach(function(album, idx) {
        var card = document.createElement('div');
        card.className = 'gallery__album';
        card.dataset.index = idx;
        card.innerHTML =
            '<img src="' + album.poster + '" alt="' + album.name + '" class="gallery__album-poster" loading="lazy">' +
            '<div class="gallery__album-overlay">' +
                '<div class="gallery__album-date">' + album.dayName + ' · ' + album.date + '</div>' +
                '<div class="gallery__album-name">' + album.name + '</div>' +
                '<div class="gallery__album-count"><span>' + album.images.length + '</span> фото</div>' +
            '</div>';
        card.addEventListener('click', function() { openLightbox(idx); });
        albumsContainer.appendChild(card);
    });
    observeElements();
}

// ===== Lightbox =====
var lightbox = document.getElementById('lightbox');
var lightboxImg = document.getElementById('lightboxImg');
var lightboxTitle = document.getElementById('lightboxTitle');
var lightboxCounter = document.getElementById('lightboxCounter');
var lightboxClose = document.getElementById('lightboxClose');
var lightboxPrev = document.getElementById('lightboxPrev');
var lightboxNext = document.getElementById('lightboxNext');
var lightboxDownload = document.getElementById('lightboxDownload');
var lightboxBody = document.getElementById('lightboxBody');

var lbCurrentAlbum = null;
var lbCurrentIdx = 0;
var lbScale = 1;
var lbTranslateX = 0;
var lbTranslateY = 0;

function openLightbox(albumIdx) {
    lbCurrentAlbum = galleryAlbums[albumIdx];
    lbCurrentIdx = 0;
    lbScale = 1;
    lbTranslateX = 0;
    lbTranslateY = 0;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    renderLightboxImg();
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lbScale = 1;
    lbTranslateX = 0;
    lbTranslateY = 0;
    if (lightboxImg) {
        lightboxImg.style.transform = '';
    }
}

function renderLightboxImg() {
    if (!lbCurrentAlbum) return;
    lightboxImg.src = lbCurrentAlbum.images[lbCurrentIdx];
    lightboxImg.alt = lbCurrentAlbum.name;
    lightboxTitle.textContent = lbCurrentAlbum.name + ' — ' + lbCurrentAlbum.date;
    lightboxCounter.textContent = (lbCurrentIdx + 1) + ' / ' + lbCurrentAlbum.images.length;
    lbScale = 1;
    lbTranslateX = 0;
    lbTranslateY = 0;
    lightboxImg.style.transform = '';
}

function lbNext() {
    if (!lbCurrentAlbum) return;
    lbCurrentIdx = (lbCurrentIdx + 1) % lbCurrentAlbum.images.length;
    renderLightboxImg();
}

function lbPrev() {
    if (!lbCurrentAlbum) return;
    lbCurrentIdx = (lbCurrentIdx - 1 + lbCurrentAlbum.images.length) % lbCurrentAlbum.images.length;
    renderLightboxImg();
}

function lbDownload() {
    if (!lbCurrentAlbum) return;
    var src = lbCurrentAlbum.images[lbCurrentIdx];
    var a = document.createElement('a');
    a.href = src;
    a.download = 'ORPHEUM_' + lbCurrentAlbum.folder + '_' + (lbCurrentIdx + 1) + '.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightboxPrev) lightboxPrev.addEventListener('click', lbPrev);
if (lightboxNext) lightboxNext.addEventListener('click', lbNext);
if (lightboxDownload) lightboxDownload.addEventListener('click', lbDownload);

// Close on backdrop click
if (lightboxBody) {
    lightboxBody.addEventListener('click', function(e) {
        if (e.target === lightboxBody) closeLightbox();
    });
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lbPrev();
    if (e.key === 'ArrowRight') lbNext();
});

// ===== Touch: swipe + pinch-to-zoom =====
var touchStartX = 0;
var touchStartY = 0;
var touchDist = 0;
var isSwiping = false;
var isPinching = false;

function getTouchDist(t) {
    var dx = t[0].clientX - t[1].clientX;
    var dy = t[0].clientY - t[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

if (lightboxBody) {
    lightboxBody.addEventListener('touchstart', function(e) {
        if (e.touches.length === 1) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            isSwiping = true;
            isPinching = false;
        } else if (e.touches.length === 2) {
            isPinching = true;
            isSwiping = false;
            touchDist = getTouchDist(e.touches);
        }
    }, { passive: true });

    lightboxBody.addEventListener('touchmove', function(e) {
        if (isPinching && e.touches.length === 2) {
            e.preventDefault();
            var newDist = getTouchDist(e.touches);
            var scaleDelta = newDist / touchDist;
            lbScale = Math.min(Math.max(lbScale * scaleDelta, 0.5), 5);
            touchDist = newDist;
            applyTransform();
        } else if (isSwiping && e.touches.length === 1 && lbScale <= 1) {
            var dx = e.touches[0].clientX - touchStartX;
            lightboxImg.style.transform = 'translateX(' + dx + 'px)';
        }
    }, { passive: false });

    lightboxBody.addEventListener('touchend', function(e) {
        if (isPinching) {
            isPinching = false;
            if (lbScale < 1) { lbScale = 1; applyTransform(); }
        } else if (isSwiping && lbScale <= 1) {
            var dx = e.changedTouches[0].clientX - touchStartX;
            if (Math.abs(dx) > 60) {
                if (dx < 0) lbNext(); else lbPrev();
            }
            lightboxImg.style.transform = '';
        }
        isSwiping = false;
    }, { passive: true });

    // Double-tap to zoom
    var lastTap = 0;
    lightboxBody.addEventListener('touchend', function(e) {
        var now = Date.now();
        if (now - lastTap < 300 && e.touches.length === 0) {
            if (lbScale > 1) { lbScale = 1; lbTranslateX = 0; lbTranslateY = 0; }
            else { lbScale = 2.5; }
            applyTransform();
        }
        lastTap = now;
    });
}

function applyTransform() {
    if (lightboxImg) {
        lightboxImg.style.transition = 'transform 0.2s ease';
        lightboxImg.style.transform = 'scale(' + lbScale + ') translate(' + lbTranslateX + 'px, ' + lbTranslateY + 'px)';
        setTimeout(function() { lightboxImg.style.transition = ''; }, 200);
    }
}

// Mouse wheel zoom for desktop
if (lightboxBody) {
    lightboxBody.addEventListener('wheel', function(e) {
        if (!lightbox.classList.contains('active')) return;
        e.preventDefault();
        var delta = e.deltaY > 0 ? 0.9 : 1.1;
        lbScale = Math.min(Math.max(lbScale * delta, 0.5), 5);
        applyTransform();
    }, { passive: false });
}
