const http = require('http');

function check(url) {
  return new Promise(resolve => {
    http.get(url, res => {
      let len = 0;
      let sample = '';
      res.on('data', chunk => {
        len += chunk.length;
        if (sample.length < 500) sample += chunk.toString();
      });
      res.on('end', () => resolve({
        url,
        status: res.statusCode,
        contentType: res.headers['content-type'],
        bytes: len,
        title: (sample.match(/<title>.*?<\/title>/i) || [])[0]
      }));
    }).on('error', err => resolve({ url, error: err.message }));
  });
}

async function main() {
  const testUrls = [
    'http://localhost:3000/',
    'http://localhost:3000/pages/off-grid-solar-system/index.html',
    'http://localhost:3000/pages/off-grid-solar-system/',
    'http://localhost:3000/pages/on-grid-solar-system/index.html',
    'http://localhost:3000/about-us/index.html',
    'http://localhost:3000/about-us/',
    'http://localhost:3000/commercial/index.html',
    'http://localhost:3000/pm-surya-ghar-muft-bijli-yojana/index.html',
    'http://localhost:3000/rooftop-solar-in-delhi/index.html',
    'http://localhost:3000/solar-calculator/index.html',
    'http://localhost:3000/contact-us/index.html'
  ];

  console.log('=== TESTING SUBPAGE RESOLUTION ON NEXT.JS :3000 ===\n');
  for (const u of testUrls) {
    const r = await check(u);
    console.log(`[${r.status}] ${r.bytes} bytes | Title: ${r.title || 'N/A'} -> ${r.url}`);
  }
}

main();

