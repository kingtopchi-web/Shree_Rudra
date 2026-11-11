const fs = require('fs');

const solHtml = fs.readFileSync('SolarWebsite/www.solarsquare.in/index.html', 'utf8');

const brokenUrls = solHtml.match(/(?:src|href)=[^ >]*Shree[^ >]*/gi) || [];
console.log('Broken URLs containing Shree in SolarWebsite/www.solarsquare.in/index.html:', brokenUrls.length);
if (brokenUrls.length > 0) {
  brokenUrls.slice(0, 10).forEach(u => console.log('  ', u));
}

// Let's check what image domains exist locally in SolarWebsite or if images are stored locally!
console.log('\nChecking subdirectories in SolarWebsite:');
const dirs = fs.readdirSync('SolarWebsite');
dirs.forEach(d => {
  try {
    const stat = fs.statSync('SolarWebsite/' + d);
    if (stat.isDirectory()) {
      console.log(' Dir:', d);
    }
  } catch (e) {}
});

