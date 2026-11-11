const fs = require('fs');

const feHtml = fs.readFileSync('frontend/public/home_exact.html', 'utf8');

// Find the calculator section
const calcIdx = feHtml.indexOf('scalcPageFormComp');
console.log('scalcPageFormComp found at index:', calcIdx);

if (calcIdx !== -1) {
  console.log('Snippet around scalcPageFormComp:');
  console.log(feHtml.substring(calcIdx - 200, calcIdx + 1200));
} else {
  // search for pin code input
  const pinIdx = feHtml.indexOf('Enter pin code');
  console.log('Enter pin code found at index:', pinIdx);
  if (pinIdx !== -1) {
    console.log(feHtml.substring(pinIdx - 300, pinIdx + 1000));
  }
}

