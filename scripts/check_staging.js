const fs = require('fs');

if (fs.existsSync('SolarWebsite/staging.solarsquare.in')) {
  console.log('SolarWebsite/staging.solarsquare.in exists:');
  const findFiles = (d) => {
    let r = [];
    for (const f of fs.readdirSync(d)) {
      const p = d + '/' + f;
      if (fs.statSync(p).isDirectory()) r = r.concat(findFiles(p));
      else r.push(p);
    }
    return r;
  };
  console.log(findFiles('SolarWebsite/staging.solarsquare.in'));
} else {
  console.log('SolarWebsite/staging.solarsquare.in does NOT exist');
}

