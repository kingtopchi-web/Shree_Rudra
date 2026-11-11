const fs = require('fs');

const js = fs.readFileSync('public/dynamic-frontend.js', 'utf8');
const lines = js.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('Customer Login') || l.includes('Admin Login')) {
    console.log(`Line ${idx + 1}: ${l.substring(0, 140)}`);
  }
});

