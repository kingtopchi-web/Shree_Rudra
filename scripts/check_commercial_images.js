const fs = require('fs');

const commPath = 'SolarWebsite/www.solarsquare.in/commercial/index.html';
const content = fs.readFileSync(commPath, 'utf8');

console.log('Commercial page size:', content.length);
const imgTags = content.match(/<img[^>]+>/gi) || [];
console.log('Total img tags in commercial:', imgTags.length);
imgTags.slice(0, 15).forEach((t, i) => console.log(i + 1, t));

// Let's check for any images with unquoted or relative paths
const srcMatches = content.match(/(?:src|data-src|srcset)=["']?([^"'\s>]+)["']?/gi) || [];
console.log('\nSample src attributes:');
srcMatches.filter(s => s.match(/\.(webp|png|jpg|jpeg|svg)/i)).slice(0, 15).forEach(s => console.log(' ', s));

