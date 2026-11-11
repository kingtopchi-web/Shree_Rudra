const fs = require('fs');
const path = require('path');

function checkRefreshes(dir) {
  let count = 0;
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      count += checkRefreshes(full);
    } else if (f.endsWith('.html')) {
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes('HTTP-EQUIV="Refresh"')) {
        count++;
      }
    }
  }
  return count;
}

console.log('Total meta refresh pages in SolarWebsite/www.solarsquare.in:', checkRefreshes('SolarWebsite/www.solarsquare.in'));

