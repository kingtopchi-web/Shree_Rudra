const http = require('http');

function get(url) {
  return new Promise(resolve => {
    http.get(url, res => {
      let len = 0;
      res.on('data', chunk => len += chunk.length);
      res.on('end', () => resolve({ url, status: res.statusCode, bytes: len, type: res.headers['content-type'] }));
    }).on('error', err => resolve({ url, error: err.message }));
  });
}

async function testJaipur() {
  console.log('Testing solar-company-in-jaipur HTML...');
  const page = await get('http://localhost:3000/solar-company-in-jaipur/index.html');
  console.log('HTML status:', page.status, page.bytes, 'bytes');

  console.log('\nTesting city page hero image streaming...');
  const imgRes = await get('http://localhost:3000/cdn.solarsquare.in/blog/wp-content/uploads/2026/08/20203355/Desktop-1.webp');
  console.log(`[${imgRes.status}] ${imgRes.type || ''} (${imgRes.bytes} bytes) -> Desktop-1.webp`);
}

testJaipur();

