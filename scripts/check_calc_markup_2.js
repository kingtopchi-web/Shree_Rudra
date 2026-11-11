const fs = require('fs');

const feHtml = fs.readFileSync('frontend/public/home_exact.html', 'utf8');
const calcIdx = feHtml.indexOf('scalcPageFormComp');

console.log(feHtml.substring(calcIdx + 1000, calcIdx + 3000));

