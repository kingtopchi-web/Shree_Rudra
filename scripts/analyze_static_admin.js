const fs = require('fs');

const appJs = fs.readFileSync('admin/app.js', 'utf8');

// Check fetch calls in admin/app.js
const fetchCalls = appJs.match(/fetch\(['"`]([^'"`]+)['"`]/g) || [];
console.log('=== FETCH CALLS IN admin/app.js ===');
console.log(fetchCalls);

// Check hardcoded arrays or mock data in admin/app.js
const mockArrays = appJs.match(/(?:const|let|var)\s+([A-Za-z0-9_]+)\s*=\s*\[[\s\S]*?\];/g) || [];
console.log('\n=== ARRAYS IN admin/app.js ===');
mockArrays.slice(0, 10).forEach(m => {
  const name = m.split('=')[0].replace(/(?:const|let|var)\s+/, '').trim();
  console.log('Array:', name, 'Length approx:', m.length);
});

