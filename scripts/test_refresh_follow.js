const fs = require('fs');
const path = require('path');

let targetFile = 'SolarWebsite/www.solarsquare.in/rooftop-solar-in-jaipur/index.html';
let raw = fs.readFileSync(targetFile, 'utf8');

const refreshMatch = raw.match(/<META HTTP-EQUIV="Refresh" CONTENT="0;\s*URL=([^"]+)"/i);
console.log('Refresh match:', refreshMatch ? refreshMatch[1] : null);

if (refreshMatch && raw.length < 1500) {
  const targetRel = refreshMatch[1];
  const targetAbs = path.resolve(path.dirname(targetFile), targetRel);
  console.log('Resolved target destination:', targetAbs);
  console.log('Target exists:', fs.existsSync(targetAbs));
  if (fs.existsSync(targetAbs)) {
    console.log('Target length:', fs.readFileSync(targetAbs, 'utf8').length);
  }
}

