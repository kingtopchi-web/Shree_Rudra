const fs = require('fs');

const solHtml = fs.readFileSync('SolarWebsite/www.solarsquare.in/index.html', 'utf8');

// Look for language switcher in header
const headerMatch = solHtml.match(/<header[^>]*>[\s\S]*?<\/header>/i);
if (headerMatch) {
  console.log('Header snippet:');
  console.log(headerMatch[0].substring(0, 1500));
}

// Search for "hi/" or "en/" or "English" or "Hindi" or "हिन्दी" in the whole page
const anyHi = solHtml.match(/[^\s"'>]*(?:hindi|english|हिन्दी|\/hi\/)[^\s"'<]*/gi) || [];
console.log('Matches for language terms:', anyHi);

