const fs = require('fs');

const dbJs = fs.readFileSync('backend/server/db.js', 'utf8');
const lines = dbJs.split('\n');

lines.forEach((l, idx) => {
  if (l.includes('getAnalyticsSummary')) {
    console.log(`Found getAnalyticsSummary at line ${idx + 1}`);
    for (let i = idx; i < Math.min(idx + 35, lines.length); i++) {
      console.log(`${i + 1}: ${lines[i]}`);
    }
  }
});

