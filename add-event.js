const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

const envFile = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
const match = envFile.match(/CLOUDINARY_URL=(.+)/);
if (match) {
    const url = match[1].trim();
    const parts = url.replace('cloudinary://', '').split('@');
    const keys = parts[0].split(':');
    cloudinary.config({
        cloud_name: parts[1],
        api_key: keys[0],
        api_secret: keys[1]
    });
    console.log('Cloudinary:', parts[1]);
}

const MONTHS_UA = [
    'Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Черв',
    'Лип', 'Серп', 'Вер', 'Жов', 'Лист', 'Груд'
];
const DAYS_UA = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота'];

const imagesDir = path.join(__dirname, 'images');
const urlMapPath = path.join(__dirname, 'cloudinary-urls.json');
const scriptPath = path.join(__dirname, 'script.js');

let urlMap = {};
if (fs.existsSync(urlMapPath)) {
    urlMap = JSON.parse(fs.readFileSync(urlMapPath, 'utf8'));
}

function parseInfoFile(folderPath) {
    const infoPath = path.join(folderPath, 'info.txt');
    if (!fs.existsSync(infoPath)) return null;
    const content = fs.readFileSync(infoPath, 'utf8');
    const info = {};
    content.split('\n').forEach(line => {
        const idx = line.indexOf(':');
        if (idx === -1) return;
        const key = line.substring(0, idx).trim().toLowerCase();
        const val = line.substring(idx + 1).trim();
        info[key] = val;
    });
    return info;
}

function findEventImages(folderPath, folderName) {
    const files = fs.readdirSync(folderPath);
    const poster = files.find(f => {
        const base = path.basename(f, path.extname(f));
        return base === folderName && /\.(jpg|jpeg|png|webp)$/i.test(f);
    });
    const banner = files.find(f => {
        const base = path.basename(f, path.extname(f));
        return base === folderName + '_banner' && /\.(jpg|jpeg|png|webp)$/i.test(f);
    });
    const extras = files.filter(f => {
        if (f === 'info.txt') return false;
        if (f === poster || f === banner) return false;
        return /\.(jpg|jpeg|png|webp)$/i.test(f);
    });
    return { poster, banner, extras };
}

async function uploadToCloudinary(localPath, publicId) {
    const result = await cloudinary.uploader.upload(localPath, {
        public_id: publicId,
        resource_type: 'image',
        overwrite: true,
        transformation: [
            { width: 1200, height: 750, crop: 'limit', quality: 'auto:good', format: 'auto' }
        ]
    });
    return result.secure_url;
}

async function processEvent(folderName) {
    const folderPath = path.join(imagesDir, folderName);
    if (!fs.statSync(folderPath).isDirectory()) return null;

    const info = parseInfoFile(folderPath);
    if (!info || !info.name) {
        console.log('Skip:', folderName, '(no info.txt or no name)');
        return null;
    }

    const images = findEventImages(folderPath, folderName);
    if (!images.poster && !images.banner) {
        console.log('Skip:', folderName, '(no poster or banner)');
        return null;
    }

    console.log('\nEvent:', info.name, '(' + folderName + ')');

    const urls = {};
    if (images.poster) {
        const posterPath = path.join(folderPath, images.poster);
        const publicId = 'orpheum/images/' + folderName + '/poster/' + path.basename(images.poster, path.extname(images.poster));
        urls.poster = await uploadToCloudinary(posterPath, publicId);
        console.log('  Poster:', urls.poster);
    }
    if (images.banner) {
        const bannerPath = path.join(folderPath, images.banner);
        const publicId = 'orpheum/images/banners/' + folderName;
        urls.banner = await uploadToCloudinary(bannerPath, publicId);
        console.log('  Banner:', urls.banner);
    }
    for (const extra of images.extras) {
        const extraPath = path.join(folderPath, extra);
        const base = path.basename(extra, path.extname(extra));
        const publicId = 'orpheum/images/' + folderName + '/' + base;
        const url = await uploadToCloudinary(extraPath, publicId);
        if (!urls.extras) urls.extras = [];
        urls.extras.push(url);
        console.log('  Photo:', url);
    }

    const parts = folderName.split('-');
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    const day = parseInt(parts[2]);
    const dateObj = new Date(year, month, day);
    const dayOfWeek = dateObj.getDay();
    const dateStr = day + '.' + (month + 1 < 10 ? '0' + (month + 1) : month + 1) + '.' + year;

    const allImageUrls = [];
    if (urls.poster) allImageUrls.push(urls.poster);
    if (urls.extras) allImageUrls.push(...urls.extras);

    return {
        folderName,
        info,
        dateStr,
        day: String(day),
        monthShort: MONTHS_UA[month],
        dayName: DAYS_UA[dayOfWeek],
        posterUrl: urls.poster || null,
        bannerUrl: urls.banner || null,
        imageUrls: allImageUrls
    };
}

function updateScriptJs(events) {
    let content = fs.readFileSync(scriptPath, 'utf8');

    for (const ev of events) {
        if (content.includes("'" + ev.folderName + "'")) {
            console.log('Already in script.js:', ev.folderName);
            continue;
        }

        const albumEntry =
            '    {\n' +
            '        date: \'' + ev.dateStr + '\',\n' +
            '        dayName: \'' + ev.dayName + '\',\n' +
            '        name: \'' + ev.info.name.replace(/'/g, "\\'") + '\',\n' +
            '        folder: \'' + ev.folderName + '\',\n' +
            '        images: [' + ev.imageUrls.map(u => '\'' + u + '\'').join(', ') + '],\n' +
            '        poster: \'' + (ev.posterUrl || '') + '\'\n' +
            '    }';

        const albumInsertBefore = '];';
        const albumRegex = /(var galleryAlbums = \[\s*\n)([\s\S]*?)(\n\];)/;
        const albumMatch = content.match(albumRegex);
        if (albumMatch) {
            const lastEntryEnd = albumMatch[2].trimEnd();
            const hasTrailingComma = lastEntryEnd.endsWith(',');
            const comma = hasTrailingComma ? '' : ',';
            content = content.replace(albumRegex, '$1' + lastEntryEnd + comma + '\n' + albumEntry + '\n$3');
        }

        const timeStr = ev.info.time || '21:00 — 03:00';
        const priceStr = ev.info.price || '';
        const djStr = ev.info.dj || 'RESIDENT DJs';

        const eventEntry =
            '    { day: \'' + ev.day + '\', month: \'' + ev.monthShort + '\', name: \'' + ev.info.name.replace(/'/g, "\\'") + '\', time: \'' + timeStr + '\', dj: \'' + djStr + '\', price: \'' + priceStr + '\', banner: \'' + (ev.bannerUrl || '') + '\', date: \'' + ev.folderName + '\' }';

        const eventRegex = /(var eventsData = \[\s*\n)([\s\S]*?)(\n\];)/;
        const eventMatch = content.match(eventRegex);
        if (eventMatch) {
            const lastEntryEnd = eventMatch[2].trimEnd();
            const hasTrailingComma = lastEntryEnd.endsWith(',');
            const comma = hasTrailingComma ? '' : ',';
            content = content.replace(eventRegex, '$1' + lastEntryEnd + comma + '\n' + eventEntry + '\n$3');
        }
    }

    fs.writeFileSync(scriptPath, content, 'utf8');
    console.log('\nscript.js updated');
}

function updateUrlMap(events) {
    for (const ev of events) {
        if (ev.posterUrl) urlMap['images/' + ev.folderName + '/poster/' + ev.folderName] = ev.posterUrl;
        if (ev.bannerUrl) urlMap['images/banners/' + ev.folderName + '.jpg'] = ev.bannerUrl;
        if (ev.imageUrls) {
            ev.imageUrls.forEach((url, i) => {
                const suffix = i === 0 ? '' : '_' + (i + 1);
                urlMap['images/' + ev.folderName + '/' + ev.folderName + suffix + '.png'] = url;
            });
        }
    }
    fs.writeFileSync(urlMapPath, JSON.stringify(urlMap, null, 2), 'utf8');
    console.log('cloudinary-urls.json updated');
}

async function main() {
    const args = process.argv.slice(2);
    let folders;

    if (args.length > 0) {
        folders = args;
    } else {
        folders = fs.readdirSync(imagesDir).filter(f => {
            const fp = path.join(imagesDir, f);
            if (!fs.statSync(fp).isDirectory()) return false;
            const infoPath = path.join(fp, 'info.txt');
            if (!fs.existsSync(infoPath)) return false;
            return !urlMap['images/' + f + '/poster/' + f];
        });
    }

    if (folders.length === 0) {
        console.log('No new events found.');
        console.log('Usage: node add-event.js [folder-name]');
        console.log('Or create images/YYYY-MM-DD/info.txt and run without args.');
        return;
    }

    console.log('Found events:', folders.join(', '));

    const results = [];
    for (const folder of folders) {
        const result = await processEvent(folder);
        if (result) results.push(result);
    }

    if (results.length > 0) {
        updateScriptJs(results);
        updateUrlMap(results);
    }

    console.log('\nDone! Events processed:', results.length);
    console.log('Next steps:');
    console.log('  1. git add . && git commit -m "add event"');
    console.log('  2. git push');
}

main();
