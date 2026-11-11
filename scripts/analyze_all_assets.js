const fs = require('fs');

const solHtml = fs.readFileSync('SolarWebsite/www.solarsquare.in/index.html', 'utf8');

const regex = /(?:src|href|srcset|poster)=["']?([^"'\s>]+)["']?/gi;
let m;
const assets = new Set();
while ((m = regex.exec(solHtml)) !== null) {
  assets.add(m[1]);
}

console.log('Total asset references:', assets.size);
const assetArr = Array.from(assets);

const byPrefix = {};
assetArr.forEach(a => {
  let prefix = a.split('/')[0] || a;
  if (a.startsWith('http://') || a.startsWith('https://')) {
    prefix = a.split('/')[2];
  }
  byPrefix[prefix] = (byPrefix[prefix] || 0) + 1;
});

console.log('Asset counts by host/prefix:');
console.log(byPrefix);

