const fs = require('fs');

const feHtml = fs.readFileSync('frontend/public/home_exact.html', 'utf8');

const aTags = feHtml.match(/<a[^>]+href=["']?[^"'>]*solarsquare[^"'>]*["']?[^>]*>/gi) || [];
console.log('Total <a> tags pointing to solarsquare:', aTags.length);
aTags.forEach((a, i) => console.log(i + 1, a));

// Check any external solarsquare links in general
const allSolLinks = feHtml.match(/https?:\/\/(?:www\.)?solarsquare\.in[^\s"'<>)]*/gi) || [];
console.log('\nAll full URL solarsquare links:', allSolLinks.length);
allSolLinks.forEach((l, i) => console.log(i + 1, l));

