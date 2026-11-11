const fs = require('fs');

const dynJs = fs.readFileSync('frontend/public/dynamic-frontend.js', 'utf8');

// Check fetch calls in dynamic-frontend.js
const fetchCalls = dynJs.match(/fetch\(['"`]([^'"`]+)['"`]/g) || [];
console.log('=== FETCH CALLS IN dynamic-frontend.js ===');
console.log(fetchCalls);

// Check form submissions and interactive logic
const forms = dynJs.match(/addEventListener\(['"`]submit['"`]/g) || [];
console.log('Submit event listeners in dynamic-frontend.js:', forms.length);

const clicks = dynJs.match(/addEventListener\(['"`]click['"`]/g) || [];
console.log('Click event listeners in dynamic-frontend.js:', clicks.length);

const inputs = dynJs.match(/addEventListener\(['"`]input['"`]/g) || [];
console.log('Input event listeners in dynamic-frontend.js:', inputs.length);

