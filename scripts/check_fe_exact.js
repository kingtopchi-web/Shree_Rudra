const fs = require('fs');

const feHtml = fs.readFileSync('frontend/public/home_exact.html', 'utf8');

// Look for image sources in home_exact.html
const imgTags = feHtml.match(/<img[^>]+>/gi) || [];
console.log('Total img tags in home_exact.html:', imgTags.length);
imgTags.slice(0, 15).forEach((t, i) => console.log(i + 1, t));

// Let's check how many have broken / erroneous replacements:
const brokenNames = ['Shree Rudra Power Systems', 'undefined', 'NaN'];
for (const b of brokenNames) {
  const matches = feHtml.match(new RegExp(b, 'gi')) || [];
  console.log(`Occurrences of "${b}":`, matches.length);
}

// Find any URLs that have "Shree Rudra Power Systems" in them!
const brokenUrls = feHtml.match(/(?:src|href)=[^ >]*Shree[^ >]*/gi) || [];
console.log('\nBroken URLs containing Shree:', brokenUrls.length);
brokenUrls.slice(0, 10).forEach(u => console.log('  ', u));

