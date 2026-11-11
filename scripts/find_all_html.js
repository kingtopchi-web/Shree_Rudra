const fs = require('fs');
const path = require('path');

function findHtmlFiles(dir) {
  let res = [];
  try {
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        res = res.concat(findHtmlFiles(full));
      } else if (f.endsWith('.html') || f.endsWith('.htm')) {
        res.push(full);
      }
    }
  } catch(e) {}
  return res;
}

console.log('Searching for HTML files in SolarWebsite...');
const files = findHtmlFiles('SolarWebsite');
console.log(`Found ${files.length} HTML files:`);
files.forEach(f => console.log(' ', f.replace(/\\/g, '/')));

