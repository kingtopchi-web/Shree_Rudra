const fs = require('fs');
const code = fs.readFileSync('backend/server.js', 'utf8');
const lines = code.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('app.get(') || l.includes('app.post(') || l.includes('app.put(') || l.includes('app.delete(')) {
    console.log(`Line ${idx + 1}: ${l.trim()}`);
  }
});

