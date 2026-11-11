const fs = require('fs');

const dirs = fs.readdirSync('SolarWebsite/www.solarsquare.in').filter(f => {
  try {
    return fs.statSync('SolarWebsite/www.solarsquare.in/' + f).isDirectory();
  } catch(e) { return false; }
});

console.log('Top level folders in SolarWebsite/www.solarsquare.in:', dirs.length);
console.log(dirs);

