const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const readline = require('readline');

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

const urlMapPath = path.join(__dirname, 'cloudinary-urls.json');
const scriptPath = path.join(__dirname, 'script.js');

let urlMap = {};
if (fs.existsSync(urlMapPath)) {
    urlMap = JSON.parse(fs.readFileSync(urlMapPath, 'utf8'));
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
function ask(q) { return new Promise(r => rl.question(q, r)); }

function getAlbums() {
    const content = fs.readFileSync(scriptPath, 'utf8');
    const regex = /var galleryAlbums = \[(.*?)\];/s;
    const match = content.match(regex);
    if (!match) return [];
    const entries = [];
    const entryRegex = /\{[^}]*folder:\s*'([^']+)'/g;
    let m;
    while ((m = entryRegex.exec(match[1])) !== null) {
        entries.push(m[1]);
    }
    return entries;
}

function getEventImages(folderName) {
    const result = { poster: null, banner: null, photos: [] };
    for (const [key, url] of Object.entries(urlMap)) {
        if (!key.startsWith('images/' + folderName + '/')) continue;
        const file = key.split('/').pop();
        if (file.includes('_poster')) result.poster = { key, url, file };
        else if (file.includes('_banner')) result.banner = { key, url, file };
        else result.photos.push({ key, url, file });
    }
    result.photos.sort((a, b) => a.file.localeCompare(b.file));
    return result;
}

function deleteFromCloudinary(url) {
    const parts = url.split('/');
    const uploadIdx = parts.indexOf('upload');
    if (uploadIdx === -1) return false;
    const versionIdx = uploadIdx + 1;
    let publicId = parts.slice(versionIdx + 1).join('/');
    publicId = publicId.replace(/\.[^.]+$/, '');
    return cloudinary.uploader.destroy(publicId).then(r => r.result === 'ok').catch(() => false);
}

function removeFromScriptJs(folderName) {
    let content = fs.readFileSync(scriptPath, 'utf8');

    const albumRegex = new RegExp(
        "    \\{[\\s\\S]*?folder: '" + folderName.replace(/-/g, '\\-') + "'[\\s\\S]*?\\},?\\n",
        'g'
    );
    content = content.replace(albumRegex, '');

    const eventRegex = new RegExp(
        "    \\{[\\s\\S]*?date: '" + folderName.replace(/-/g, '\\-') + "'[\\s\\S]*?\\},?\\n",
        'g'
    );
    content = content.replace(eventRegex, '');

    fs.writeFileSync(scriptPath, content, 'utf8');
}

function removeFromUrlMap(keys) {
    for (const key of keys) {
        delete urlMap[key];
    }
    fs.writeFileSync(urlMapPath, JSON.stringify(urlMap, null, 2), 'utf8');
}

function removeAlbumFromScriptJs(folderName) {
    let content = fs.readFileSync(scriptPath, 'utf8');
    const albumRegex = new RegExp(
        "    \\{[\\s\\S]*?folder: '" + folderName.replace(/-/g, '\\-') + "'[\\s\\S]*?\\},?\\n",
        'g'
    );
    content = content.replace(albumRegex, '');
    fs.writeFileSync(scriptPath, content, 'utf8');
}

function updateAlbumImages(folderName, newUrls) {
    let content = fs.readFileSync(scriptPath, 'utf8');
    const entryRegex = new RegExp(
        "(\\{[\\s\\S]*?folder: '" + folderName.replace(/-/g, '\\-') + "'[\\s\\S]*?images: \\[)([\\s\\S]*?)(\\][\\s\\S]*?\\})"
    );
    const entryMatch = content.match(entryRegex);
    if (entryMatch) {
        const newImagesStr = newUrls.map(u => "'" + u + "'").join(', ');
        content = content.replace(entryRegex, '$1' + newImagesStr + '$3');
        fs.writeFileSync(scriptPath, content, 'utf8');
    }
}

async function main() {
    const args = process.argv.slice(2);

    if (args.includes('--event')) {
        const folderName = args[args.indexOf('--event') + 1];
        if (!folderName) { console.log('Usage: node remove-event.js --event 2026-06-27'); rl.close(); return; }
        await removeEvent(folderName, true);
    } else if (args.length > 0) {
        await removeEvent(args[0], false);
    } else {
        await interactiveMode();
    }
}

async function removeEvent(folderName, deleteAll) {
    const images = getEventImages(folderName);
    const hasAnything = images.poster || images.banner || images.photos.length > 0;
    if (!hasAnything) {
        console.log('Event not found or no images:', folderName);
        return;
    }

    console.log('\nEvent:', folderName);
    if (images.poster) console.log('  [P] Poster:', images.poster.file);
    if (images.banner) console.log('  [B] Banner:', images.banner.file);
    images.photos.forEach((p, i) => console.log('  [' + (i + 1) + '] Photo:', p.file));

    if (deleteAll) {
        console.log('\nDeleting all...');
        const keysToDelete = [];
        if (images.poster) keysToDelete.push(images.poster.key);
        if (images.banner) keysToDelete.push(images.banner.key);
        images.photos.forEach(p => keysToDelete.push(p.key));

        for (const img of [...(images.poster ? [images.poster] : []), ...(images.banner ? [images.banner] : []), ...images.photos]) {
            process.stdout.write('  Delete ' + img.file + ' from Cloudinary... ');
            await deleteFromCloudinary(img.url);
            console.log('ok');
        }
        removeFromUrlMap(keysToDelete);
        removeFromScriptJs(folderName);
        console.log('\nDone! All removed:', folderName);
        return;
    }

    const answer = await ask('\nWhat to delete? (P=poster, B=banner, 1,2,3=photos, A=all, Q=quit): ');
    const choice = answer.toUpperCase().trim();
    if (choice === 'Q') { console.log('Cancelled.'); return; }

    const keysToDelete = [];
    const imgsToDelete = [];

    if (choice === 'A') {
        if (images.poster) { imgsToDelete.push(images.poster); keysToDelete.push(images.poster.key); }
        if (images.banner) { imgsToDelete.push(images.banner); keysToDelete.push(images.banner.key); }
        images.photos.forEach(p => { imgsToDelete.push(p); keysToDelete.push(p.key); });
    } else {
        if (choice.includes('P') && images.poster) { imgsToDelete.push(images.poster); keysToDelete.push(images.poster.key); }
        if (choice.includes('B') && images.banner) { imgsToDelete.push(images.banner); keysToDelete.push(images.banner.key); }
        for (const p of images.photos) {
            const idx = images.photos.indexOf(p) + 1;
            if (choice.includes(String(idx))) { imgsToDelete.push(p); keysToDelete.push(p.key); }
        }
    }

    if (imgsToDelete.length === 0) { console.log('Nothing selected.'); return; }

    console.log('\nDeleting:');
    for (const img of imgsToDelete) {
        process.stdout.write('  ' + img.file + '... ');
        await deleteFromCloudinary(img.url);
        console.log('ok');
    }

    removeFromUrlMap(keysToDelete);

    const posterDeleted = imgsToDelete.some(i => i.key === (images.poster && images.poster.key));
    const bannerDeleted = imgsToDelete.some(i => i.key === (images.banner && images.banner.key));
    const allPhotosDeleted = images.photos.every(p => keysToDelete.includes(p.key));

    if (posterDeleted && bannerDeleted) {
        removeFromScriptJs(folderName);
        console.log('\nEvent removed from site:', folderName);
    } else if (allPhotosDeleted && !posterDeleted && !bannerDeleted) {
        removeAlbumFromScriptJs(folderName);
        console.log('\nAlbum removed from gallery:', folderName);
    } else {
        const remainingUrls = [];
        if (!posterDeleted && images.poster) remainingUrls.push(images.poster.url);
        images.photos.forEach(p => {
            if (!keysToDelete.includes(p.key)) remainingUrls.push(p.url);
        });
        if (remainingUrls.length > 0) {
            updateAlbumImages(folderName, remainingUrls);
            console.log('\nAlbum updated:', folderName, '(' + remainingUrls.length + ' photos)');
        } else {
            removeAlbumFromScriptJs(folderName);
            console.log('\nAlbum removed from gallery:', folderName);
        }
    }

    console.log('Done!');
}

async function interactiveMode() {
    const albums = getAlbums();
    if (albums.length === 0) {
        console.log('No events found in script.js');
        rl.close();
        return;
    }

    console.log('\nEvents:');
    albums.forEach((a, i) => console.log('  ' + (i + 1) + '. ' + a));

    const num = await ask('\nSelect event (number): ');
    const idx = parseInt(num) - 1;
    if (idx < 0 || idx >= albums.length) { console.log('Invalid.'); rl.close(); return; }

    await removeEvent(albums[idx], false);
    rl.close();
}

main().catch(e => { console.error(e); rl.close(); });
