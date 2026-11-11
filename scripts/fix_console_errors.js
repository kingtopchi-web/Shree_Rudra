const fs = require('fs');
const path = require('path');

// 1. Ensure /public/dynamic-frontend.js is also physically present in frontend/public/public/
fs.mkdirSync('frontend/public/public', { recursive: true });
fs.copyFileSync('frontend/public/dynamic-frontend.js', 'frontend/public/public/dynamic-frontend.js');
console.log('Copied dynamic-frontend.js to frontend/public/public/dynamic-frontend.js');

// 2. Ensure /www.googletagmanager.com/gtm5445.html is also physically present as an empty safe response
fs.mkdirSync('frontend/public/www.googletagmanager.com', { recursive: true });
fs.writeFileSync('frontend/public/www.googletagmanager.com/gtm5445.html', '// safe mock\nwindow.dataLayer = window.dataLayer || [];', 'utf8');
console.log('Created frontend/public/www.googletagmanager.com/gtm5445.html');

// 3. Fix home_exact.html script references
let feHtml = fs.readFileSync('frontend/public/home_exact.html', 'utf8');

// Replace /public/dynamic-frontend.js with /dynamic-frontend.js
feHtml = feHtml.replace(/\/public\/dynamic-frontend\.js/g, '/dynamic-frontend.js');

// Replace the broken local GTM line
// j.src='../www.googletagmanager.com/gtm5445.html?id='+i
feHtml = feHtml.replace(/j\.src=['"][^'"]*gtm5445\.html\?id=['"]\+i/g, "j.src='https://www.googletagmanager.com/gtm.js?id='+i");
feHtml = feHtml.replace(/\.\.\/www\.googletagmanager\.com\/gtm5445\.html/g, 'https://www.googletagmanager.com/gtm.js');

// Also remove any remaining references to gtm5445
feHtml = feHtml.replace(/www\.googletagmanager\.com\/gtm5445\.html/g, 'www.googletagmanager.com/gtm.js');

fs.writeFileSync('frontend/public/home_exact.html', feHtml, 'utf8');
console.log('Updated frontend/public/home_exact.html');

// Also update SolarWebsite/www.solarsquare.in/index.html similarly
let solHtml = fs.readFileSync('SolarWebsite/www.solarsquare.in/index.html', 'utf8');
solHtml = solHtml.replace(/\/public\/dynamic-frontend\.js/g, '/dynamic-frontend.js');
solHtml = solHtml.replace(/\.\.\/www\.googletagmanager\.com\/gtm5445\.html/g, 'https://www.googletagmanager.com/gtm.js');
fs.writeFileSync('SolarWebsite/www.solarsquare.in/index.html', solHtml, 'utf8');
console.log('Updated SolarWebsite/www.solarsquare.in/index.html');

