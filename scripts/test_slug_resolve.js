const fs = require('fs');
const path = require('path');

function resolvePath(slug) {
  const relPath = Array.isArray(slug) ? slug.join('/') : slug;
  const candidates = [
    path.join(process.cwd(), 'SolarWebsite', 'www.solarsquare.in', relPath),
    path.join(process.cwd(), 'SolarWebsite', 'www.solarsquare.in', relPath, 'index.html'),
    path.join(process.cwd(), 'SolarWebsite', 'www.solarsquare.in', relPath + '.html'),
    path.join(process.cwd(), 'SolarWebsite', relPath),
    path.join(process.cwd(), 'frontend', 'public', relPath)
  ];

  for (const c of candidates) {
    if (fs.existsSync(c)) {
      const stat = fs.statSync(c);
      if (stat.isFile()) return c;
    }
  }
  return null;
}

const testSlugs = [
  ['pages', 'off-grid-solar-system', 'index.html'],
  ['pages', 'off-grid-solar-system'],
  ['about-us'],
  ['commercial'],
  ['pm-surya-ghar-muft-bijli-yojana'],
  ['rooftop-solar-in-delhi'],
  ['website-assets.solarsquare.in', 'wp-content', 'cache', 'minify', 'fa522.css']
];

console.log('Testing path resolution:');
for (const s of testSlugs) {
  const r = resolvePath(s);
  console.log(`- ${s.join('/')} => ${r ? 'FOUND: ' + r : 'NOT FOUND'}`);
}

