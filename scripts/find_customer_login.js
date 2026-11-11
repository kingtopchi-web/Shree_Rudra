const fs = require('fs');

const glob = (dir) => {
  try {
    for (const f of fs.readdirSync(dir)) {
      if (f === 'node_modules' || f === '.next' || f === '.git') continue;
      const full = dir + '/' + f;
      if (fs.statSync(full).isDirectory()) glob(full);
      else {
        try {
          const content = fs.readFileSync(full, 'utf8');
          if (content.includes('Customer Login')) {
            console.log('Found "Customer Login" in:', full);
          }
        } catch(e) {}
      }
    }
  } catch (e) {}
};

glob('.');

