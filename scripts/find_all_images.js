const fs = require('fs');

function findSampleFiles(dir, depth = 0) {
  if (depth > 5) return [];
  let files = [];
  try {
    for (const f of fs.readdirSync(dir)) {
      const full = dir + '/' + f;
      const s = fs.statSync(full);
      if (s.isDirectory()) {
        files = files.concat(findSampleFiles(full, depth + 1));
      } else if (f.endsWith('.webp') || f.endsWith('.png') || f.endsWith('.jpg')) {
        files.push(full);
      }
      if (files.length > 20) break;
    }
  } catch(e) {}
  return files;
}

console.log('Sample images found in SolarWebsite:');
const imgs = findSampleFiles('SolarWebsite');
imgs.forEach(i => console.log(' ', i));

