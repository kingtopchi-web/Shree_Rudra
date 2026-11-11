const fs = require('fs');
const path = require('path');

// Let's test if the CSS files in SolarWebsite/www.solarsquare.in/index.html exist relative to it!
const solHtml = fs.readFileSync('SolarWebsite/www.solarsquare.in/index.html', 'utf8');
const baseDir = 'SolarWebsite/www.solarsquare.in';

const hrefs = (solHtml.match(/href=["']([^"']+)["']/gi) || []).map(m => m.replace(/href=["']/, '').replace(/["']$/, ''));
const cssHrefs = hrefs.filter(h => h.includes('.css'));

console.log('CSS links in SolarWebsite/www.solarsquare.in/index.html:');
for (const h of cssHrefs) {
  if (h.startsWith('http')) {
    console.log(' External CSS:', h);
  } else {
    const resolved = path.resolve(baseDir, h);
    const exists = fs.existsSync(resolved);
    console.log(` Exists: ${exists} -> ${h} (resolved: ${resolved})`);
  }
}

