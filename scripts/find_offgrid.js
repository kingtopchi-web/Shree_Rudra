const fs = require('fs');
const path = require('path');

function searchFile(dir, query) {
  let matches = [];
  try {
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        matches = matches.concat(searchFile(full, query));
      } else if (f.toLowerCase().includes(query.toLowerCase()) || full.toLowerCase().includes(query.toLowerCase())) {
        matches.push(full);
      }
    }
  } catch(e) {}
  return matches;
}

console.log('Searching for off-grid:');
const found = searchFile('SolarWebsite', 'off-grid');
console.log(found.slice(0, 10));

