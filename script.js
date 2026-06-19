// ===== Telegram detection =====
var tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
var isMiniApp = tg && tg.initDataUnsafe && tg.initDataUnsafe.user;
var TG_BOT_TOKEN = '8841778405:AAGxnnq7rC_OqG8b4Po4ZuGur1o37XFs-Fg';
var TG_CHAT_ID = '-1004472996150';

// ===== Init Telegram Mini App =====
if (tg && isMiniApp)     { day: '19', month: 'Черв', name: 'День Фермера', time: '21:00 — 03:00', dj: 'RESIDENT DJs', price: '100 ₴', banner: 'https://res.cloudinary.com/deiitwupc/image/upload/v1781868107/orpheum/images/banners/2026-06-19.png', date: '2026-06-19' }
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
var lightboxBody = document.getElementById('lightboxBody');
var lightboxSlide = document.getElementById('lightboxSlide');

var lbCurrentAlbum = null;
var lbCurrentIdx = 0;

function openLightbox(albumIdx) {
    lbCurrentAlbum = galleryAlbums[albumIdx];
    lbCurrentIdx = 0;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    renderLightboxImg();
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function renderLightboxImg() {
    if (!lbCurrentAlbum) return;
    lightboxImg.src = lbCurrentAlbum.images[lbCurrentIdx];
    lightboxImg.alt = lbCurrentAlbum.name;
    lightboxTitle.textContent = lbCurrentAlbum.name + ' — ' + lbCurrentAlbum.date;
    lightboxCounter.textContent = (lbCurrentIdx + 1) + ' / ' + lbCurrentAlbum.images.length;
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

if (lightboxClose) lightboxClose.onclick = closeLightbox;

if (lightboxBody) {
    lightboxBody.onclick = function(e) {
        if (e.target === lightboxBody) closeLightbox();
    };
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lbPrev();
    if (e.key === 'ArrowRight') lbNext();
});

// Swipe navigation
var lbTouchStartX = 0;
var lbTouchStartY = 0;
var lbSwiping = false;

if (lightboxBody) {
    lightboxBody.addEventListener('touchstart', function(e) {
        if (e.touches.length === 1) {
            lbTouchStartX = e.touches[0].clientX;
            lbTouchStartY = e.touches[0].clientY;
            lbSwiping = true;
        }
    }, { passive: true });

    lightboxBody.addEventListener('touchmove', function(e) {
        if (!lbSwiping || e.touches.length !== 1) return;
        var dx = e.touches[0].clientX - lbTouchStartX;
        var dy = Math.abs(e.touches[0].clientY - lbTouchStartY);
        if (dy > Math.abs(dx)) { lbSwiping = false; return; }
        if (Math.abs(dx) > 10) e.preventDefault();
    }, { passive: false });

    lightboxBody.addEventListener('touchend', function(e) {
        if (!lbSwiping) return;
        lbSwiping = false;
        var dx = e.changedTouches[0].clientX - lbTouchStartX;
        if (Math.abs(dx) > 50) {
            if (dx < 0) lbNext(); else lbPrev();
        }
    }, { passive: true });
}
