const fs = require('fs');

const feHtml = fs.readFileSync('frontend/public/home_exact.html', 'utf8');

// Find all href attributes containing solarsquare
const hrefs = feHtml.match(/href=["']?[^"'\s>]*solarsquare[^"'\s>]*["']?/gi) || [];
console.log('Total solarsquare hrefs in home_exact.html:', hrefs.length);
hrefs.slice(0, 20).forEach((h, i) => console.log(i + 1, h));

