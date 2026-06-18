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
    console.log('Cloudinary configured for:', parts[1]);
}

const folders = [
    'images/banners',
    'images/2026-06-19/poster',
    'images/2026-06-19'
];

const results = {};

async function uploadFile(filePath) {
    const relativePath = path.relative(__dirname, filePath).replace(/\\/g, '/');
    const ext = path.extname(filePath);
    const publicId = 'orpheum/' + relativePath.replace(/\.[^.]+$/, '');

    try {
        const result = await cloudinary.uploader.upload(filePath, {
            public_id: publicId,
            resource_type: 'image',
            overwrite: true,
            transformation: [
                { width: 1200, height: 750, crop: 'limit', quality: 'auto:good', format: 'auto' }
            ]
        });
        console.log('OK:', result.secure_url);
        return result.secure_url;
    } catch (err) {
        console.error('FAIL:', filePath, err.message);
        return null;
    }
}

async function main() {
    const urlMap = {};

    for (const folder of folders) {
        const absFolder = path.join(__dirname, folder);
        if (!fs.existsSync(absFolder)) {
            console.log('Skip:', folder);
            continue;
        }
        const files = fs.readdirSync(absFolder).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
        for (const file of files) {
            const filePath = path.join(absFolder, file);
            const url = await uploadFile(filePath);
            if (url) {
                const relPath = path.relative(__dirname, filePath).replace(/\\/g, '/');
                urlMap[relPath] = url;
            }
        }
    }

    fs.writeFileSync('cloudinary-urls.json', JSON.stringify(urlMap, null, 2));
    console.log('\nDone! URLs saved to cloudinary-urls.json');
    console.log('Total uploaded:', Object.keys(urlMap).length);
}

main();
