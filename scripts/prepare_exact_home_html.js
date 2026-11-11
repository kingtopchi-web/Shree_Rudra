const fs = require('fs');
const path = require('path');

const srcPath = path.join('SolarWebsite', 'www.solarsquare.in', 'index.html');
let html = fs.readFileSync(srcPath, 'utf8');

// Replace relative path prefixes
html = html.replace(/\.\.\/website-assets\.solarsquare\.in\//g, '/website-assets.solarsquare.in/');
html = html.replace(/\.\.\/cdn\.jsdelivr\.net\//g, '/cdn.jsdelivr.net/');
html = html.replace(/\.\.\/cdn\.solarsquare\.in\//g, '/cdn.solarsquare.in/');
html = html.replace(/\.\.\/code\.jquery\.com\//g, '/code.jquery.com/');
html = html.replace(/\.\.\/stackpath\.bootstrapcdn\.com\//g, '/stackpath.bootstrapcdn.com/');
html = html.replace(/src=images\//g, 'src=/images/');
html = html.replace(/href=images\//g, 'href=/images/');
html = html.replace(/src="images\//g, 'src="/images/');
html = html.replace(/href="images\//g, 'href="/images/');

// Ensure brand name is Shree Rudra Power Systems
html = html.replace(/<title>.*?<\/title>/i, '<title>Shree Rudra Power Systems - Bharat ki #1 Home Rooftop Solar Company</title>');
html = html.replace(/alt=SolarSquare/gi, 'alt="Shree Rudra Power Systems"');

// Ensure logos point to /logo.png
html = html.replace(/https:\/\/cdn\.solarsquare\.in\/blog\/wp-content\/uploads\/2025\/11\/05101757\/logo\.webp/gi, '/logo.png');
html = html.replace(/https:\/\/cdn\.solarsquare\.in\/blog\/wp-content\/uploads\/2026\/09\/29121518\/logo\.webp/gi, '/logo.png');

// Update brand text in header and menus
html = html.replace(/SolarSquare/gi, 'Shree Rudra Power Systems');
html = html.replace(/Shree Rudra Power Systems Energy/gi, 'Shree Rudra Power Systems');

// Save to frontend/public/home_exact.html
const outPath = path.join('frontend', 'public', 'home_exact.html');
fs.writeFileSync(outPath, html, 'utf8');
console.log('Saved exact home HTML to', outPath, 'Length:', html.length);

