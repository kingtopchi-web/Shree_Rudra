const fs = require('fs');

console.log('frontend/public contains:');
console.log(fs.readdirSync('frontend/public'));

// Also check root public
if (fs.existsSync('public')) {
  console.log('root public contains:');
  console.log(fs.readdirSync('public'));
}

