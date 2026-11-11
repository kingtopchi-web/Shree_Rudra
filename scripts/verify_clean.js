const fs = require('fs');

const fe = fs.readFileSync('frontend/public/home_exact.html', 'utf8');
console.log('Customer Login in home_exact.html:', fe.includes('Customer Login'));
console.log('Admin Login in home_exact.html:', fe.includes('Admin Login'));

const sol = fs.readFileSync('SolarWebsite/www.solarsquare.in/index.html', 'utf8');
console.log('Customer Login in SolarWebsite index.html:', sol.includes('Customer Login'));
console.log('Admin Login in SolarWebsite index.html:', sol.includes('Admin Login'));

