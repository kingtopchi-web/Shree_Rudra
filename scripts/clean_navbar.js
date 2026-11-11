const fs = require('fs');

function cleanHtml(filePath) {
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');

  // Remove any injected nav buttons / div
  html = html.replace(/<div style="display:inline-flex; align-items:center; gap:10px; margin-left:auto;">[\s\S]*?<\/div>\s*<\/header>/gi, '</header>');
  
  // Also check if any standalone customer/login or admin/login link tags exist in the header
  html = html.replace(/<a[^>]*href=["'](?:\/admin\/login|http:\/\/localhost:3000\/admin\/login|\/customer\/login|http:\/\/localhost:3000\/customer\/login)["'][^>]*>[\s\S]*?<\/a>/gi, '');

  fs.writeFileSync(filePath, html, 'utf8');
  console.log('Cleaned navbar in:', filePath);
}

cleanHtml('frontend/public/home_exact.html');
cleanHtml('SolarWebsite/www.solarsquare.in/index.html');

