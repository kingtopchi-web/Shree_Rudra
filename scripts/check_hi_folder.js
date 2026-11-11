const fs = require('fs');

if (fs.existsSync('SolarWebsite/www.solarsquare.in/hi')) {
  console.log('hi/ files:', fs.readdirSync('SolarWebsite/www.solarsquare.in/hi'));
  if (fs.existsSync('SolarWebsite/www.solarsquare.in/hi/index.html')) {
    const hiHtml = fs.readFileSync('SolarWebsite/www.solarsquare.in/hi/index.html', 'utf8');
    console.log('hi/index.html length:', hiHtml.length);
    console.log('hi/index.html title:', (hiHtml.match(/<title>.*?<\/title>/i) || [])[0]);
  }
} else {
  console.log('hi/ does not exist');
}

