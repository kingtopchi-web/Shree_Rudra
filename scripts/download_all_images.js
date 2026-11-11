const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const solHtml = fs.readFileSync('SolarWebsite/www.solarsquare.in/index.html', 'utf8');

// Find all unique image URLs
const regex = /https?:\/\/[^\s"'<>)]+\.(?:webp|png|jpg|jpeg|svg|gif)(?:\?[^\s"'<>)]*)?/gi;
let m;
const urls = new Set();
while ((m = regex.exec(solHtml)) !== null) {
  urls.add(m[0]);
}

const urlList = Array.from(urls);
console.log(`Starting download of ${urlList.length} images...`);

function downloadFile(url, targetPath) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    
    // If file already exists and is > 0 bytes, skip
    if (fs.existsSync(targetPath) && fs.statSync(targetPath).size > 0) {
      return resolve({ url, targetPath, skipped: true });
    }

    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Handle redirect
        return downloadFile(res.headers.location, targetPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return resolve({ url, status: res.statusCode, error: 'HTTP status ' + res.statusCode });
      }

      const fileStream = fs.createWriteStream(targetPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve({ url, targetPath, success: true, size: fs.statSync(targetPath).size });
      });
      fileStream.on('error', err => {
        fs.unlink(targetPath, () => {});
        resolve({ url, error: err.message });
      });
    });

    req.on('error', err => resolve({ url, error: err.message }));
    req.setTimeout(15000, () => {
      req.abort();
      resolve({ url, error: 'timeout' });
    });
  });
}

async function run() {
  let done = 0;
  for (const u of urlList) {
    try {
      const parsed = new URL(u);
      const host = parsed.hostname; // e.g. cdn.solarsquare.in
      const pathname = parsed.pathname; // e.g. /blog/wp-content/...

      // Target 1: SolarWebsite/<host>/<pathname>
      const target1 = path.join('SolarWebsite', host, pathname);
      // Target 2: frontend/public/<host>/<pathname>
      const target2 = path.join('frontend', 'public', host, pathname);

      const r1 = await downloadFile(u, target1);
      // Copy to frontend/public as well
      if (fs.existsSync(target1) && fs.statSync(target1).size > 0) {
        fs.mkdirSync(path.dirname(target2), { recursive: true });
        fs.copyFileSync(target1, target2);
      }

      done++;
      console.log(`[${done}/${urlList.length}] Downloaded: ${host}${pathname}`);
    } catch (e) {
      console.error(`Error with ${u}:`, e.message);
    }
  }

  // Also ensure logo files are everywhere
  const logoSrcPng = 'public/images/logo.png';
  const logoSrcSvg = 'public/images/logo.svg';

  const logoDestinations = [
    'frontend/public/logo.png',
    'frontend/public/images/logo.png',
    'frontend/public/logo.svg',
    'frontend/public/images/logo.svg',
    'SolarWebsite/www.solarsquare.in/images/logo.png',
    'SolarWebsite/www.solarsquare.in/images/logo.svg',
    'SolarWebsite/www.solarsquare.in/logo.png',
    'SolarWebsite/images/logo.png',
    'SolarWebsite/images/logo.svg',
    'images/logo.png',
    'images/logo.svg'
  ];

  for (const d of logoDestinations) {
    fs.mkdirSync(path.dirname(d), { recursive: true });
    if (d.endsWith('.png') && fs.existsSync(logoSrcPng)) {
      fs.copyFileSync(logoSrcPng, d);
    } else if (d.endsWith('.svg') && fs.existsSync(logoSrcSvg)) {
      fs.copyFileSync(logoSrcSvg, d);
    }
  }

  console.log('All image assets downloaded and logos placed!');
}

run();

