const fs = require('fs');

const feHtml = fs.readFileSync('frontend/public/home_exact.html', 'utf8');

// Look for modal or results container
const resIdx = feHtml.indexOf('modal');
console.log('Search for modal / calc-result in home_exact.html:');
const matches = feHtml.match(/class=["'][^"']*(?:calc-result|result-box|savings-result|solar-estimate)[^"']*["']/gi) || [];
console.log('Result classes found:', matches);

// Let's also check dynamic-frontend.js to see what it was doing!
const dynJs = fs.readFileSync('public/dynamic-frontend.js', 'utf8');
const calcFunc = dynJs.indexOf('bindSolarCalculator');
console.log('bindSolarCalculator in dynamic-frontend.js:');
console.log(dynJs.substring(calcFunc, calcFunc + 2500));

