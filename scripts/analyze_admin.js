const fs = require('fs');

const adminCode = fs.readFileSync('admin/src/app/page.js', 'utf8');

// Check state variables
const stateMatches = adminCode.match(/const\s+\[([a-zA-Z0-9_]+),\s*set[a-zA-Z0-9_]+\]\s*=\s*useState\(([\s\S]*?)\);/g) || [];
console.log('=== STATE VARIABLES IN ADMIN PAGE.JS ===');
stateMatches.slice(0, 25).forEach(m => {
  const name = m.split(',')[0].replace('const [', '').trim();
  console.log('State:', name);
});

// Check fetch calls in admin/src/app/page.js
const fetchMatches = adminCode.match(/fetch\(['"`]([^'"`]+)['"`]/g) || [];
console.log('\n=== FETCH CALLS IN ADMIN PAGE.JS ===');
fetchMatches.forEach(f => console.log('Fetch:', f));

// Check any hardcoded seed arrays
const constArrays = adminCode.match(/const\s+([A-Z_0-9]+|initial[A-Za-z0-9_]+|default[A-Za-z0-9_]+)\s*=\s*\[/g) || [];
console.log('\n=== POTENTIAL HARDCODED ARRAYS IN ADMIN ===');
console.log(constArrays);

