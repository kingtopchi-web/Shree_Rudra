const fs = require('fs');

const offGridPath = 'SolarWebsite/www.solarsquare.in/pages/off-grid-solar-system/index.html';
console.log('Exists offGridPath:', fs.existsSync(offGridPath));
if (fs.existsSync(offGridPath)) {
  const content = fs.readFileSync(offGridPath, 'utf8');
  console.log('Length:', content.length);
  console.log('Title match:', content.match(/<title>.*?<\/title>/i));
}

