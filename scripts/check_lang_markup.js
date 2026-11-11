const fs = require('fs');

const feHtml = fs.readFileSync('frontend/public/home_exact.html', 'utf8');

const matches = feHtml.match(/<[^>]+(?:lang|language|hindi|हिन्दी|english)[^>]*>/gi) || [];
console.log('Language tags count:', matches.length);
matches.slice(0, 15).forEach((t, i) => console.log(i + 1, t));

// Search for language dropdown or switcher
const langDropdown = feHtml.match(/class=["'][^"']*(?:lang|language)[^"']*["']/gi) || [];
console.log('Language classes:', langDropdown);

// Search for /hi/ links in header
const hiLinks = feHtml.match(/href=["'][^"']*(?:\/hi\/|\/en\/|lang=)[^"']*["']/gi) || [];
console.log('Language links:', hiLinks);

