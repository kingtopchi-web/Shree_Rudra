const fs = require('fs');

const files = [
  'public/dynamic-frontend.js',
  'frontend/public/dynamic-frontend.js',
  'frontend/public/public/dynamic-frontend.js'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let js = fs.readFileSync(f, 'utf8');

    // Remove the entire setupNavigationPortals function
    js = js.replace(/function setupNavigationPortals\(\)\s*\{[\s\S]*?document\.body\.appendChild\(navPills\);\s*\}/g, 'function setupNavigationPortals() { /* removed */ }');
    
    // Also remove any direct calls to setupNavigationPortals
    js = js.replace(/setupNavigationPortals\(\);/g, '// setupNavigationPortals();');

    fs.writeFileSync(f, js, 'utf8');
    console.log('Removed setupNavigationPortals from:', f);
  }
});

