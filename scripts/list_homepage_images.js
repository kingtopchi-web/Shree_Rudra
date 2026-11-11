const fs = require('fs');

const solHtml = fs.readFileSync('SolarWebsite/www.solarsquare.in/index.html', 'utf8');

// Find all external image URLs (cdn.solarsquare.in, dn5z2jafg7hv0.cloudfront.net, etc.)
const regex = /https?:\/\/[^\s"'<>)]+\.(?:webp|png|jpg|jpeg|svg|gif)(?:\?[^\s"'<>)]*)?/gi;
let m;
const urls = new Set();
while ((m = regex.exec(solHtml)) !== null) {
  urls.add(m[0]);
}

console.log('Total unique image URLs on homepage:', urls.size);
Array.from(urls).forEach(u => console.log(' ', u));

