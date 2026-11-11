const fs = require('fs');

function scan(d, max = 20) {
  let res = [];
  try {
    for (const f of fs.readdirSync(d)) {
      const p = d + '/' + f;
      if (fs.statSync(p).isDirectory()) {
        res = res.concat(scan(p, max));
      } else {
        res.push(p);
      }
      if (res.length >= max) break;
    }
  } catch(e) {}
  return res;
}

console.log('Sample in SolarWebsite/cdn.solarsquare.in:');
scan('SolarWebsite/cdn.solarsquare.in').forEach(f => console.log(' ', f));

