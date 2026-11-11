const http = require('http');

function get(url) {
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
        bytes: len,
        title: (sample.match(/<title>.*?<\/title>/i) || [])[0]
      }));
    }).on('error', err => resolve({ url, error: err.message }));
  });
}

async function testAll() {
  const urls = [
    'http://localhost:3000/',
    'http://localhost:3000/pages/off-grid-solar-system/index.html',
    'http://localhost:3000/pages/on-grid-solar-system/index.html',
    'http://localhost:3000/rooftop-solar-in-jaipur/index.html',
    'http://localhost:3000/rooftop-solar-in-delhi/index.html',
    'http://localhost:3000/commercial/index.html',
    'http://localhost:3000/pm-surya-ghar-muft-bijli-yojana/index.html',
    'http://localhost:3000/cdn.solarsquare.in/blog/wp-content/uploads/2026/08/20203355/Desktop-1.webp'
  ];

  console.log('=== VERIFYING PAGES & IMAGES ===\n');
  for (const u of urls) {
    const res = await get(u);
    console.log(`[${res.status}] ${res.bytes} bytes | ${res.title || 'N/A'} -> ${res.url}`);
  }
}

testAll();

