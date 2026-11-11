const fs = require('fs');

const feHtml = fs.readFileSync('frontend/public/home_exact.html', 'utf8');
const lines = feHtml.split('\n');

for (let i = 35; i <= 45; i++) {
  if (lines[i - 1]) {
    console.log(`Line ${i}:`, lines[i - 1]);
  }
}

