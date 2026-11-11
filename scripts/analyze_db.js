const fs = require('fs');

const db = JSON.parse(fs.readFileSync('backend/data/db.json', 'utf8'));
console.log('=== COLLECTIONS IN backend/data/db.json ===');
for (const key of Object.keys(db)) {
  const val = db[key];
  if (Array.isArray(val)) {
    console.log(`- ${key}: ${val.length} records`);
  } else if (typeof val === 'object') {
    console.log(`- ${key}: object with keys [${Object.keys(val).join(', ')}]`);
  } else {
    console.log(`- ${key}: ${typeof val}`);
  }
}

