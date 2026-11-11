const fs = require('fs');
const http = require('http');
const path = require('path');

// 1. Check SolarWebsite/www.solarsquare.in/index.html
const solHtml = fs.readFileSync('SolarWebsite/www.solarsquare.in/index.html', 'utf8');
const findAttrs = (html, tag, attr) => {
  const re = new RegExp('<' + tag + '[^>]+' + attr + '=["\']([^"\']+)["\']', 'gi');
  const res = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    res.push(m[1]);
  }
  return res;
};

console.log('--- SolarWebsite/www.solarsquare.in/index.html ---');
const solCss = findAttrs(solHtml, 'link', 'href').filter(l => l.includes('.css'));
console.log('CSS links count:', solCss.length);
solCss.forEach(c => console.log(' CSS:', c));

const solImgs = findAttrs(solHtml, 'img', 'src');
console.log('IMG count:', solImgs.length);
console.log('First 5 imgs:', solImgs.slice(0, 5));

// 2. Check frontend/public/home_exact.html
console.log('\n--- frontend/public/home_exact.html ---');
const feHtml = fs.readFileSync('frontend/public/home_exact.html', 'utf8');
const feCss = findAttrs(feHtml, 'link', 'href').filter(l => l.includes('.css'));
console.log('FE CSS links count:', feCss.length);
feCss.forEach(c => console.log(' FE CSS:', c));

const feImgs = findAttrs(feHtml, 'img', 'src');
console.log('FE IMG count:', feImgs.length);
console.log('First 5 FE imgs:', feImgs.slice(0, 5));

// 3. Let's test HTTP requests to localhost:3000 for these resources!
function checkUrl(url) {
  return new Promise(resolve => {
    http.get(url, res => {
      let len = 0;
      res.on('data', chunk => len += chunk.length);
      res.on('end', () => resolve({ url, status: res.statusCode, length: len, contentType: res.headers['content-type'] }));
    }).on('error', err => resolve({ url, error: err.message }));
  });
}

async function testHttp() {
  console.log('\n--- Testing Next.js (port 3000) served assets ---');
  const testList = [
    'http://localhost:3000/logo.png',
    'http://localhost:3000/images/logo.png',
    'http://localhost:3000/images/logo.svg',
    ...feCss.slice(0, 5).map(c => c.startsWith('http') ? c : 'http://localhost:3000' + (c.startsWith('/') ? c : '/' + c)),
    ...feImgs.slice(0, 5).map(i => i.startsWith('http') ? i : 'http://localhost:3000' + (i.startsWith('/') ? i : '/' + i))
  ];

  for (const u of testList) {
    const res = await checkUrl(u);
    console.log(res.status, res.contentType || '', res.length || 0, res.url);
  }
}

testHttp();

