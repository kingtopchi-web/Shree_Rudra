const fs = require('fs');

const offGridHtml = fs.readFileSync('SolarWebsite/www.solarsquare.in/pages/off-grid-solar-system/index.html', 'utf8');

// Find all img tags in off-grid-solar-system
const imgTags = offGridHtml.match(/<img[^>]+>/gi) || [];
console.log('Total img tags in off-grid:', imgTags.length);
imgTags.slice(0, 15).forEach((t, idx) => console.log(idx + 1, t));

// Find all image URLs (src, data-src, srcset)
const regex = /(?:src|data-src|srcset)=["']?([^"'\s>]+)["']?/gi;
let m;
const imgUrls = new Set();
while ((m = regex.exec(offGridHtml)) !== null) {
  if (m[1].match(/\.(webp|png|jpg|jpeg|svg|gif)/i)) {
    imgUrls.add(m[1]);
  }
}

console.log('\nTotal unique image paths in off-grid:', imgUrls.size);
Array.from(imgUrls).slice(0, 20).forEach(u => console.log(' ', u));

