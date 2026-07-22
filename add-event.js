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
    const imgFiles = files.filter(f => f !== 'info.txt' && /\.(jpg|jpeg|png|webp)$/i.test(f));

    const poster = imgFiles.find(f => {
        const base = path.basename(f, path.extname(f));
        return base === folderName + '_poster';
    });
    const banner = imgFiles.find(f => {
        const base = path.basename(f, path.extname(f));
        return base === folderName + '_banner' || base === folderName + '_baner';
    });
    const photos = imgFiles.filter(f => f !== poster && f !== banner).sort();
    return { poster, banner, photos };
}

async function uploadToCloudinary(localPath, publicId, transformation) {
    const options = {
        public_id: publicId,
        resource_type: 'image',
        overwrite: true
    };
    if (transformation) {
        options.transformation = [transformation];
    } else {
        options.transformation = [
            { width: 1200, height: 750, crop: 'limit', quality: 'auto:good', format: 'auto' }
        ];
    }
    const result = await cloudinary.uploader.upload(localPath, options);
    return result.secure_url;
}

function isAlreadyUploaded(localPath, folderName, fileName) {
    const base = path.basename(fileName, path.extname(fileName));
    const ext = path.extname(fileName).substring(1);
    const mapKey = 'images/' + folderName + '/' + base + '.' + ext;
    return urlMap[mapKey] || null;
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
        const posterKey = 'images/' + folderName + '/' + images.poster;
        const existing = urlMap[posterKey];
        if (existing) {
            urls.poster = existing;
            console.log('  Poster: cached');
        } else {
            const posterPath = path.join(folderPath, images.poster);
            const publicId = 'orpheum/images/' + folderName + '/poster/' + folderName;
            const posterTransformation = { width: 1080, height: 1350, crop: 'limit', quality: 'auto:good', format: 'auto' };
            urls.poster = await uploadToCloudinary(posterPath, publicId, posterTransformation);
            urlMap[posterKey] = urls.poster;
            console.log('  Poster:', urls.poster);
        }
    }

    if (images.banner) {
        const bannerKey = 'images/' + folderName + '/' + images.banner;
        const existing = urlMap[bannerKey];
        if (existing) {
            urls.banner = existing;
            console.log('  Banner: cached');
        } else {
            const bannerPath = path.join(folderPath, images.banner);
            const publicId = 'orpheum/images/banners/' + folderName;
            urls.banner = await uploadToCloudinary(bannerPath, publicId);
            urlMap[bannerKey] = urls.banner;
            console.log('  Banner:', urls.banner);
        }
    }

    const newPhotoUrls = [];
    for (const photo of images.photos) {
        const photoKey = 'images/' + folderName + '/' + photo;
        const existing = urlMap[photoKey];
        if (existing) {
            newPhotoUrls.push(existing);
            console.log('  Photo: cached', photo);
        } else {
            const photoPath = path.join(folderPath, photo);
            const base = path.basename(photo, path.extname(photo));
            const publicId = 'orpheum/images/' + folderName + '/' + base;
            const url = await uploadToCloudinary(photoPath, publicId);
            urlMap[photoKey] = url;
            newPhotoUrls.push(url);
            console.log('  Photo:', photo, '->', url);
        }
    }

    const parts = folderName.split('-');
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    const day = parseInt(parts[2]);
    const dateObj = new Date(year, month, day);
    const dayOfWeek = dateObj.getDay();
    const dateStr = day + '.' + (month + 1 < 10 ? '0' + (month + 1) : month + 1) + '.' + year;

    const allImageUrls = [];
    allImageUrls.push(...newPhotoUrls);

    return {
        folderName,
        info,
        dateStr,
        day: String(day),
        monthShort: MONTHS_UA[month],
        dayName: DAYS_UA[dayOfWeek],
        posterUrl: urls.poster || null,
        bannerUrl: urls.banner || null,
        imageUrls: allImageUrls,
        photoCount: newPhotoUrls.length
    };
}

function extractArraySection(content, varName) {
    const start = content.indexOf('var ' + varName + ' = [');
    if (start === -1) return null;
    const arrStart = content.indexOf('[', start);
    let depth = 0;
    let end = arrStart;
    for (let i = arrStart; i < content.length; i++) {
        if (content[i] === '[') depth++;
        if (content[i] === ']') depth--;
        if (depth === 0) { end = i + 1; break; }
    }
    return { start: arrStart, end, text: content.substring(arrStart, end) };
}

function updateScriptJs(events) {
    let content = fs.readFileSync(scriptPath, 'utf8');

    for (const ev of events) {
        // ===== galleryAlbums =====
        const albumSection = extractArraySection(content, 'galleryAlbums');
        if (!albumSection) continue;
        const albumInSection = albumSection.text.includes("'" + ev.folderName + "'");

        if (albumInSection) {
            const entryRegex = new RegExp(
                "(\\{[\\s\\S]*?folder: '" + ev.folderName.replace(/-/g, '\\-') + "'[\\s\\S]*?images: \\[)([\\s\\S]*?)(\\][\\s\\S]*?\\})"
            );
            const entryMatch = albumSection.text.match(entryRegex);
            if (entryMatch) {
                const existingUrls = entryMatch[2].split(',').map(u => u.trim().replace(/'/g, '')).filter(u => u.length > 0);
                const newUrls = ev.imageUrls.filter(u => !existingUrls.includes(u));
                if (newUrls.length > 0) {
                    const combined = [...existingUrls, ...newUrls];
                    const newImagesStr = combined.map(u => "'" + u + "'").join(', ');
                    const oldSection = albumSection.text;
                    const newSection = oldSection.replace(entryRegex, '$1' + newImagesStr + '$3');
                    content = content.substring(0, albumSection.start) + newSection + content.substring(albumSection.end);
                    console.log('Album updated:', ev.folderName, '(+' + newUrls.length + ' photos)');
                } else {
                    console.log('Album unchanged:', ev.folderName, '(no new photos)');
                }
            }
        } else {
            const albumEntry =
                '    {\n' +
                '        date: \'' + ev.dateStr + '\',\n' +
                '        dayName: \'' + ev.dayName.replace(/'/g, "\\'") + '\',\n' +
                '        name: \'' + ev.info.name.replace(/'/g, "\\'") + '\',\n' +
                '        folder: \'' + ev.folderName + '\',\n' +
                '        images: [' + ev.imageUrls.map(u => "'" + u + "'").join(', ') + '],\n' +
                '        poster: \'' + (ev.posterUrl || '') + '\'\n' +
                '    }';

            const afterOpen = content.substring(albumSection.start + 1);
            const firstNewline = afterOpen.indexOf('\n');
            const indent = afterOpen.substring(0, firstNewline).match(/^\s*/)[0];
            const nextChar = afterOpen.trimStart()[0];
            const needsComma = nextChar && nextChar !== ']';
            content = content.substring(0, albumSection.start + 1) + '\n' + albumEntry + (needsComma ? ',' : '') + '\n' + indent + content.substring(albumSection.start + 1);
            console.log('Album added:', ev.folderName);
        }

        // ===== eventsData =====
        const eventSection = extractArraySection(content, 'eventsData');
        if (!eventSection) continue;
        const eventInSection = eventSection.text.includes("'" + ev.folderName + "'");

        const timeStr = ev.info.time || '21:00 — 03:00';
        const priceStr = ev.info.price || '';
        const djStr = ev.info.dj || 'RESIDENT DJs';

        const eventEntry =
            '    { day: \'' + ev.day + '\', month: \'' + ev.monthShort + '\', name: \'' + ev.info.name.replace(/'/g, "\\'") + '\', time: \'' + timeStr + '\', dj: \'' + djStr.replace(/'/g, "\\'") + '\', price: \'' + priceStr + '\', banner: \'' + (ev.bannerUrl || '') + '\', date: \'' + ev.folderName + '\' }';

        if (eventInSection) {
            const entryRegex = new RegExp(
                "(\\{[\\s\\S]*?date: '" + ev.folderName.replace(/-/g, '\\-') + "'[\\s\\S]*?\\})"
            );
            const entryMatch = eventSection.text.match(entryRegex);
            if (entryMatch) {
                const oldSection = eventSection.text;
                const newSection = oldSection.replace(entryRegex, eventEntry);
                content = content.substring(0, eventSection.start) + newSection + content.substring(eventSection.end);
                console.log('Event updated:', ev.folderName);
            }
        } else {
            const afterOpen = content.substring(eventSection.start + 1);
            const firstNewline = afterOpen.indexOf('\n');
            const indent = afterOpen.substring(0, firstNewline).match(/^\s*/)[0];
            const nextChar = afterOpen.trimStart()[0];
            const needsComma = nextChar && nextChar !== ']';
            content = content.substring(0, eventSection.start + 1) + '\n' + eventEntry + (needsComma ? ',' : '') + '\n' + indent + content.substring(eventSection.start + 1);
            console.log('Event added:', ev.folderName);
        }
    }

    fs.writeFileSync(scriptPath, content, 'utf8');
    console.log('script.js saved');
}

function saveUrlMap() {
    fs.writeFileSync(urlMapPath, JSON.stringify(urlMap, null, 2), 'utf8');
    console.log('cloudinary-urls.json saved');
}

async function main() {
    const args = process.argv.slice(2);
    let folders;

    if (args.length > 0) {
        folders = args;
    } else {
        folders = fs.readdirSync(imagesDir).filter(f => {
            const fp = path.join(imagesDir, f);
            return fs.statSync(fp).isDirectory() && fs.existsSync(path.join(fp, 'info.txt'));
        });
    }

    if (folders.length === 0) {
        console.log('No events found.');
        console.log('');
        console.log('Usage:');
        console.log('  node add-event.js 2026-06-27');
        console.log('  node add-event.js            (all folders with info.txt)');
        return;
    }

    console.log('Events:', folders.join(', '));

    const results = [];
    for (const folder of folders) {
        const result = await processEvent(folder);
        if (result) results.push(result);
    }

    if (results.length > 0) {
        updateScriptJs(results);
        saveUrlMap();
    }

    console.log('\nDone! Processed:', results.length);
    console.log('Next: git add . && git commit && git push');
}

main();
