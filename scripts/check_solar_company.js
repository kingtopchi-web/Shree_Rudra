const fs = require('fs');

const path = 'SolarWebsite/www.solarsquare.in/solar-company-in-jaipur/index.html';
console.log('Exists solar-company-in-jaipur:', fs.existsSync(path));
if (fs.existsSync(path)) {
  const content = fs.readFileSync(path, 'utf8');
  console.log('Length:', content.length);
  const imgs = content.match(/<img[^>]+>/gi) || [];
  console.log('Images count:', imgs.length);
  imgs.slice(0, 5).forEach((t, i) => console.log(i + 1, t));
}

