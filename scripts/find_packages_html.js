const fs = require('fs');

const feHtml = fs.readFileSync('frontend/public/home_exact.html', 'utf8');

// Look for package mentions or price
const matches = feHtml.match(/₹\s*[0-9,]+/g) || [];
console.log('Price mentions count:', matches.length);
console.log('Sample prices found:', matches.slice(0, 10));

const kwMatches = feHtml.match(/[0-9]+\s*kW/gi) || [];
console.log('kW mentions count:', kwMatches.length);
console.log('Sample kW mentions:', kwMatches.slice(0, 10));

