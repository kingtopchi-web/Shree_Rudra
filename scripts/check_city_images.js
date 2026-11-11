const fs = require('fs');

const jaipurPath = 'SolarWebsite/www.solarsquare.in/rooftop-solar-in-jaipur/index.html';
if (fs.existsSync(jaipurPath)) {
  const content = fs.readFileSync(jaipurPath, 'utf8');
  console.log('Jaipur page length:', content.length);
  const imgs = content.match(/<img[^>]+>/gi) || [];
  console.log('Jaipur images count:', imgs.length);
  imgs.slice(0, 5).forEach((t, i) => console.log(i + 1, t));
} else {
  console.log('Jaipur page not found, searching other cities...');
}

