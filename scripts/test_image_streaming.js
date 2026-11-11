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

async function testSubpageImages() {
  console.log('Testing subpage HTML...');
  const page = await get('http://localhost:3000/pages/off-grid-solar-system/index.html');
  console.log('Off-grid HTML status:', page.status, page.bytes, 'bytes');

  console.log('\nTesting subpage images on-demand streaming...');
  const testImages = [
    'http://localhost:3000/cdn.solarsquare.in/blog/wp-content/uploads/2025/07/06110614/Hero-Image-Mob.webp',
    'http://localhost:3000/cdn.solarsquare.in/blog/wp-content/uploads/2025/07/06111505/Hero-image.webp',
    'http://localhost:3000/cdn.solarsquare.in/blog/wp-content/uploads/2022/11/14160635/1kva-inverter-price-768x427.jpg',
    'http://localhost:3000/cdn.solarsquare.in/blog/wp-content/uploads/2022/09/14160234/100-Watt-solar-panel-price-768x447.png',
    'http://localhost:3000/cdn.solarsquare.in/blog/wp-content/uploads/2022/11/14160611/100ah-solar-battery-price-768x427.jpg',
    'http://localhost:3000/cdn.solarsquare.in/blog/wp-content/uploads/2022/10/14160632/3kva-solar-inverter-768x427.jpg'
  ];

  for (const img of testImages) {
    const res = await get(img);
    console.log(`[${res.status}] ${res.type || ''} (${res.bytes} bytes) -> ${res.url.split('/').pop()}`);
  }
}

testSubpageImages();

