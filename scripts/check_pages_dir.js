const fs = require('fs');
const path = require('path');

const pagesDir = 'SolarWebsite/www.solarsquare.in/pages';
if (fs.existsSync(pagesDir)) {
  console.log('Folders in pagesDir:', fs.readdirSync(pagesDir));
} else {
  console.log('pagesDir does NOT exist in SolarWebsite/www.solarsquare.in');
}

// Let's also check if pages is in SolarWebsite/
if (fs.existsSync('SolarWebsite/pages')) {
  console.log('SolarWebsite/pages exists:', fs.readdirSync('SolarWebsite/pages'));
}

