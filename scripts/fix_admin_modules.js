const { execSync } = require('child_process');

try {
  execSync('cmd /c rmdir "c:\\Users\\DELL\\Desktop\\HTTrack\\admin\\node_modules"');
  console.log('Junction removed successfully!');
} catch(e) {
  console.log('Note on junction removal:', e.message);
}

