const fs = require('fs');

const files = [
  'public/dynamic-frontend.js',
  'frontend/public/dynamic-frontend.js',
  'frontend/public/public/dynamic-frontend.js'
];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  console.log(f, 'contains Customer Login:', content.includes('Customer Login'));
  console.log(f, 'contains Admin Login:', content.includes('Admin Login'));
});

