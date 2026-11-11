const fs = require('fs');
const html = fs.readFileSync('SolarWebsite/www.solarsquare.in/index.html', 'utf8');

const regex = /(?:src|href)=["']([^"']+)["']/g;
let m;
const relativeAssets = new Set();
while ((m = regex.exec(html)) !== null) {
  if (m[1].startsWith('../')) {
    relativeAssets.add(m[1]);
  }
}

console.log('Unique ../ assets:', relativeAssets.size);
console.log(Array.from(relativeAssets).slice(0, 20));

