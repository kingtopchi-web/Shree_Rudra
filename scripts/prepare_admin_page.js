const fs = require('fs');

let code = fs.readFileSync('frontend/src/app/admin/page.js', 'utf8');

// Replace redirects from '/admin/login' to '/login'
code = code.replace(/router\.push\('\/admin\/login'\)/g, "router.push('/login')");
code = code.replace(/\/admin\/login/g, '/login');

fs.mkdirSync('admin/src/app', { recursive: true });
fs.writeFileSync('admin/src/app/page.js', code, 'utf8');
console.log('Adapted admin/src/app/page.js successfully! Length:', code.length);

