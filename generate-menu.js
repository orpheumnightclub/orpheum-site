const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const doc = new PDFDocument({ size: 'A4', margin: 0 });
const outputPath = path.join(__dirname, 'menu.pdf');
doc.pipe(fs.createWriteStream(outputPath));

const W = 595.28;
const H = 841.89;
const MARGIN = 50;
const GOLD = '#c9a84c';
const WHITE = '#ffffff';
const GRAY = '#999999';
const DARK = '#1a1a1a';

const img1 = path.join(__dirname, 'template-img-img_p0_1.png');
const img2 = path.join(__dirname, 'template-img-img_p0_2.png');
const img3 = path.join(__dirname, 'template-img-img_p0_3.png');
const img4 = path.join(__dirname, 'template-img-img_p0_4.png');

function bg() { doc.rect(0, 0, W, H).fill(DARK); }

function drawHeader() {
    doc.fontSize(10).fillColor(GRAY).font('Helvetica');
    doc.text('COCKTAILS', MARGIN, 40, { width: W - MARGIN * 2, align: 'center' });

    doc.fontSize(32).fillColor(WHITE).font('Helvetica-Bold');
    doc.text('ORPHEUM', MARGIN, 60, { width: W - MARGIN * 2, align: 'center' });

    doc.fontSize(8).fillColor(GRAY).font('Helvetica');
    doc.text('050 900 12 92', MARGIN, 100, { width: W - MARGIN * 2, align: 'center' });
    doc.text('orpheumnightclub.github.io/orpheum-site', MARGIN, 112, { width: W - MARGIN * 2, align: 'center' });

    doc.moveTo(MARGIN, 132).lineTo(W - MARGIN, 132).lineWidth(0.5).strokeColor(GOLD).stroke();
}

function sectionTitle(title, y) {
    doc.fontSize(16).fillColor(WHITE).font('Helvetica-Bold');
    doc.text(title, MARGIN, y, { width: W - MARGIN * 2, align: 'center' });
    return y + 30;
}

function item(name, price, desc, y) {
    if (y > H - 80) { doc.addPage(); bg(); y = 60; }
    const nameWidth = W - MARGIN * 2 - 60;
    doc.fontSize(10).fillColor(WHITE).font('Helvetica-Bold');
    doc.text(name, MARGIN, y, { width: nameWidth });
    doc.fontSize(10).fillColor(GOLD).font('Helvetica-Bold');
    doc.text(price, W - MARGIN - 55, y, { width: 55, align: 'right' });
    doc.fontSize(8).fillColor(GRAY).font('Helvetica-Oblique');
    doc.text(desc, MARGIN, y + 14, { width: W - MARGIN * 2 - 20 });
    return y + 32;
}

function divider(y) {
    doc.moveTo(MARGIN + 100, y).lineTo(W - MARGIN - 100, y).lineWidth(0.3).strokeColor('#333333').stroke();
    return y + 10;
}

function placeImage(imgPath, x, y, w) {
    try { doc.image(imgPath, x, y, { width: w }); } catch(e) {}
}

// ===== PAGE 1 =====
bg();
drawHeader();

doc.image(img1, W / 2 - 90, 145, { width: 180 });
let y = 340;

y = sectionTitle('COCKTAILS', y);
y = item('CLASSIC MOJITO', '$170', 'Ром, свіжий лайм, м\'ята та цукор.', y);
y = item('ROYAL MARTINI', '$190', 'Свіжозварена кава з ромом та лаймом.', y);
y = item('RASPBERRY MOJITO', '$180', 'Ром з малиною, свіжою м\'ятою, лаймом та цукром.', y);
y = item('DAIQUIRI', '$180', 'Ром, лимонний сік та цукор з яблуком.', y);
y = item('PREMIUM MARGARITA', '$190', 'Текіла, лаймовий сік, ром з дрібкою солі.', y);
y = item('COSMOPOLITAN', '$190', 'Vodka Citron, Cointreau, журавлина, лайм.', y);
y = item('NEGRONI', '$200', 'Джин, Campari, солодкий вермут.', y);
y = divider(y);

// ===== PAGE 2 =====
doc.addPage();
bg();

placeImage(img2, MARGIN, 40, 160);
placeImage(img3, W / 2 - 55, 40, 110);

y = 260;
y = sectionTitle('WHISKEY', y);
y = item('MANHATTAN', '$200', 'Білий ром з віскі та цукром.', y);
y = item('WHISKEY SOUR', '$200', 'Свіжий лимонний сік з преміум віскі та лаймом.', y);
y = item('BOURBON FLIP', '$210', 'Преміум віскі, лайм з цукровим сиропом.', y);
y = item('OLD FASHIONED', '$200', 'Коричневий цукор, лайм та цукор з віскі.', y);
y = item('PAPER PLANE', '$210', 'Преміум віскі з лаймом та цукром.', y);
y = item('MIDNIGHT VELVET', '$220', 'Віскі, лаванда, мед, лимон.', y);
y = divider(y);

y = sectionTitle('ORPHEUM SIGNATURE', y);
y = item('GREEN NIGHT', '$200', 'Джин, м\'ята, лайм, тонік, зелений колір.', y);
y = item('ORPHEUS SUNSET', '$210', 'Текіла, манго, маракуйя, чилі.', y);
y = item('PURPLE RAIN', '$200', 'Vodka, блюküracao, лимон, тонік.', y);
y = divider(y);

placeImage(img4, W / 2 - 80, y, 160);
y += 170;

// ===== PAGE 3 =====
doc.addPage();
bg();

placeImage(img1, W - MARGIN - 140, 40, 140);

y = 50;
y = sectionTitle('WEEKEND SPECIAL', y);
y = item('PASSION FRUIT MOJITO', '$250', 'Ром, маракуйя, лаймовий сік, м\'ята та цукор.', y);
y = item('BLUE ISLAND ICE RUM', '$250', 'Vodka, фруктова текіла з колою та преміум ромом.', y);
y = item('ORPHEUS SUNSET', '$220', 'Текіла, манго, маракуйя, чилі — фірмовий коктейль клубу.', y);
y = divider(y + 10);

y = sectionTitle('БЕЗАЛКОГОЛЬНІ', y);
y = item('VIRGIN MOJITO', '$120', 'М\'ята, лайм, цукор, сода.', y);
y = item('BERRY SMASH', '$120', 'Малина, чорниця, лимон, м\'ята.', y);
y = item('TROPICAL SUNRISE', '$130', 'Манго, ананас, маракуйя, сода.', y);
y = divider(y + 10);

y = sectionTitle('ШОТИ', y);
y = item('JÄGERBOMB', '$120', 'Jägermeister, Red Bull.', y);
y = item('B-52', '$100', 'Kahlúa, Baileys, Grand Marnier.', y);
y = item('TEQUILA SHOT', '$80', 'Текіла, сіль, лайм.', y);
y = item('KAMIKAZE', '$90', 'Vodka, Cointreau, лайм.', y);

placeImage(img2, MARGIN, H - 200, 120);
placeImage(img3, W / 2 - 50, H - 200, 100);

doc.end();
console.log('PDF created:', outputPath);
