const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'SolarWebsite', 'www.solarsquare.in', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

console.log('Original index.html length:', html.length);

// 1. Replace Title & Meta Branding
html = html.replace(/<title>SolarSquare - Bharat ki #1 Home Rooftop Solar Company<\/title>/gi,
  '<title>Shree Rudra Power Systems - Bharat ki #1 Home Rooftop Solar Company</title>');

html = html.replace(/content="SolarSquare - Bharat ki #1 Home Rooftop Solar Company"/gi,
  'content="Shree Rudra Power Systems - Bharat ki #1 Home Rooftop Solar Company"');

html = html.replace(/Rooftop Solar for your home and more \| SolarSquare/gi,
  'Rooftop Solar for your home and more | Shree Rudra Power Systems');

// 2. Replace Logo URLs
html = html.replace(/https:\/\/cdn\.solarsquare\.in\/blog\/wp-content\/uploads\/2025\/11\/05101757\/logo\.webp/gi,
  '/images/logo.png');

html = html.replace(/https:\/\/cdn\.solarsquare\.in\/blog\/wp-content\/uploads\/2026\/09\/29121518\/logo\.webp/gi,
  '/images/logo.png');

html = html.replace(/alt=SolarSquare/gi, 'alt="Shree Rudra Power Systems"');

// 3. Replace User-Facing Prose Brand Mentions
html = html.replace(/I agree to SolarSquare/gi, 'I agree to Shree Rudra Power Systems');
html = html.replace(/SolarSquare Energy Private Limited/gi, 'Shree Rudra Power Systems');
html = html.replace(/SolarSquare Energy/gi, 'Shree Rudra Power Systems');
html = html.replace(/Why SolarSquare\?/gi, 'Why Shree Rudra Power Systems?');
html = html.replace(/About SolarSquare/gi, 'About Shree Rudra Power Systems');
html = html.replace(/SolarSquare Care/gi, 'Shree Rudra Care');
html = html.replace(/with SolarSquare/gi, 'with Shree Rudra Power Systems');
html = html.replace(/by SolarSquare/gi, 'by Shree Rudra Power Systems');
html = html.replace(/from SolarSquare/gi, 'from Shree Rudra Power Systems');

// 4. Inject Dynamic Script before </body> if not already injected
if (!html.includes('/public/dynamic-frontend.js')) {
  html = html.replace('</body>', '<script src="/public/dynamic-frontend.js"></script>\n</body>');
  console.log('Injected /public/dynamic-frontend.js');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Successfully rebranded index.html! New length:', html.length);

