const fs = require('fs');
const path = require('path');

const solHtml = fs.readFileSync('SolarWebsite/www.solarsquare.in/index.html', 'utf8');

// Find all cdn.solarsquare.in links
const regex = /https?:\/\/cdn\.solarsquare\.in\/([^\s"'<>]+)/g;
let m;
let found = 0;
let missing = 0;

while ((m = regex.exec(solHtml)) !== null) {
  const relPath = m[1];
  const localFile = path.join('SolarWebsite', 'cdn.solarsquare.in', relPath);
  if (fs.existsSync(localFile)) {
    found++;
  } else {
    missing++;
    if (missing <= 5) {
      console.log('Missing locally:', relPath, '-> looked in', localFile);
    }
  }
}

console.log(`Images found locally: ${found}, missing locally: ${missing}`);

