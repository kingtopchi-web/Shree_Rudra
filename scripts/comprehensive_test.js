const http = require('http');

function check(url) {
  return new Promise(resolve => {
    http.get(url, res => {
      let len = 0;
      res.on('data', chunk => len += chunk.length);
      res.on('end', () => resolve({
        url,
        status: res.statusCode,
        contentType: res.headers['content-type'],
        bytes: len
      }));
    }).on('error', err => resolve({ url, error: err.message }));
  });
}

async function main() {
  const urls = [
    'http://localhost:3000/',
    'http://localhost:3000/website-assets.solarsquare.in/wp-content/cache/minify/fa522.css',
    'http://localhost:3000/cdn.solarsquare.in/blog/wp-content/uploads/2026/09/29170850/hero-home-mob-scale-1.webp',
    'http://localhost:3000/cdn.solarsquare.in/blog/wp-content/uploads/2026/07/20201751/hero-home-desk.webp',
    'http://localhost:3000/images/logo.png',
    'http://localhost:3000/logo.png',
    'http://localhost:3000/dynamic-frontend.js',
    'http://localhost:3000/admin/login',
    'http://localhost:3000/customer/login',
    'http://localhost:5000/api/settings'
  ];

  console.log('--- COMPREHENSIVE ASSET & ROUTE VERIFICATION ---');
  let allPass = true;
  for (const u of urls) {
    const r = await check(u);
    const pass = r.status === 200 && r.bytes > 0;
    if (!pass) allPass = false;
    console.log(`${pass ? '✅ [PASS]' : '❌ [FAIL]'} [${r.status}] ${r.contentType || ''} (${r.bytes} bytes) -> ${r.url}`);
  }
  console.log('\nOVERALL STATUS:', allPass ? 'ALL TESTS PASSED PERFECTLY!' : 'SOME ASSETS FAILED');
}

main();

