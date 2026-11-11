const fs = require('fs');

const feHtml = fs.readFileSync('frontend/public/home_exact.html', 'utf8');

const gtmLines = [];
feHtml.split('\n').forEach((line, idx) => {
  if (line.includes('googletagmanager.com') || line.includes('gtm5445')) {
    gtmLines.push({ line: idx + 1, content: line.trim() });
  }
});

console.log('GTM Lines found:', gtmLines.length);
gtmLines.forEach(l => console.log(`Line ${l.line}: ${l.content.substring(0, 150)}`));

