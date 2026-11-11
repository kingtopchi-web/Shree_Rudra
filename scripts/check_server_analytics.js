const fs = require('fs');

const serverJs = fs.readFileSync('backend/server.js', 'utf8');

// Check line 330 of backend/server.js
const lines = serverJs.split('\n');
console.log('Lines 325-345 in backend/server.js:');
lines.slice(324, 345).forEach((l, idx) => console.log(325 + idx, l));

