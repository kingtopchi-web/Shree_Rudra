const fs = require('fs');

const solHtml = fs.readFileSync('SolarWebsite/www.solarsquare.in/index.html', 'utf8');

// Check for <img> tags
const imgTags = solHtml.match(/<img[^>]+>/gi) || [];
console.log('Total <img> tags:', imgTags.length);
if (imgTags.length > 0) {
  console.log('Sample img tags:');
  imgTags.slice(0, 10).forEach(t => console.log('  ', t));
}

// Check for any solarSquare or solarsquare in urls
const urls = solHtml.match(/(?:src|href|data-src|data-lazy-src)=["']([^"']+)["']/gi) || [];
console.log('Total resource attributes:', urls.length);
console.log('Sample resource attributes:', urls.slice(0, 15));

