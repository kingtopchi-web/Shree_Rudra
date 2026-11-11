const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const folders = [
  'website-assets.solarsquare.in',
  'cdn.jsdelivr.net',
  'cdn.solarsquare.in',
  'stackpath.bootstrapcdn.com',
  'code.jquery.com'
];

folders.forEach(f => {
  const src = path.join('SolarWebsite', f);
  const dest = path.join('frontend', 'public', f);
  console.log(`Copying ${src} to ${dest}...`);
  copyDir(src, dest);
});

// Also copy images from www.solarsquare.in
copyDir('SolarWebsite/www.solarsquare.in/images', 'frontend/public/images');

console.log('All asset folders successfully copied to frontend/public!');

