const fs = require('fs');
const html = fs.readFileSync('SolarWebsite/www.solarsquare.in/index.html', 'utf8');

console.log('HTML size:', html.length);
console.log('Title:', html.match(/<title>.*?<\/title>/i)?.[0]);
const links = html.match(/<link[^>]+>/gi) || [];
console.log('Total link tags:', links.length);
const scripts = html.match(/<script[^>]*>[\s\S]*?<\/script>/gi) || [];
console.log('Total script tags:', scripts.length);
const imgCount = (html.match(/<img[^>]+>/gi) || []).length;
console.log('Total img tags:', imgCount);

// Look at relative paths that start with ../
const relMatches = html.match(/(?:src|href)=["']\.\.\/[^"']+["']/gi) || [];
console.log('Relative ../ references:', relMatches.length);
console.log('Sample relative:', relMatches.slice(0, 10));

