const fs = require('fs');
const path = require('path');

// Read the pristine original from SolarWebsite/www.solarsquare.in/index.html
const originalHtml = fs.readFileSync('SolarWebsite/www.solarsquare.in/index.html', 'utf8');

// Function to safely replace visible text brand names without touching URLs or filenames
function replaceBrandText(html) {
  let res = html;

  // Title tag
  res = res.replace(/<title>.*?<\/title>/i, '<title>Shree Rudra Power Systems - Rooftop Solar Solutions India</title>');

  // Specific header/footer text replacements
  res = res.replace(/SolarSquare Energy/g, 'Shree Rudra Power Systems');
  res = res.replace(/SolarSquare/g, 'Shree Rudra Power Systems');
  res = res.replace(/solarsquare\.in/g, 'shreerudrapower.com');

  // Fix any accidentally replaced asset paths back to solarsquare folder names
  res = res.replace(/website-assets\.Shree Rudra Power Systems\.in/g, 'website-assets.solarsquare.in');
  res = res.replace(/cdn\.Shree Rudra Power Systems\.in/g, 'cdn.solarsquare.in');
  res = res.replace(/website-assets\.shreerudrapower\.com/g, 'website-assets.solarsquare.in');
  res = res.replace(/cdn\.shreerudrapower\.com/g, 'cdn.solarsquare.in');

  return res;
}

// -------------------------------------------------------------
// 1. Build frontend/public/home_exact.html (for Next.js localhost:3000)
// -------------------------------------------------------------
let feHtml = originalHtml;

// Make all asset paths root-relative
feHtml = feHtml.replace(/\.\.\/website-assets\.solarsquare\.in/g, '/website-assets.solarsquare.in');
feHtml = feHtml.replace(/\.\.\/cdn\.jsdelivr\.net/g, '/cdn.jsdelivr.net');
feHtml = feHtml.replace(/\.\.\/code\.jquery\.com/g, '/code.jquery.com');
feHtml = feHtml.replace(/\.\.\/stackpath\.bootstrapcdn\.com/g, '/stackpath.bootstrapcdn.com');

// Replace external CDN images with local root-relative paths
feHtml = feHtml.replace(/https:\/\/cdn\.solarsquare\.in/g, '/cdn.solarsquare.in');
feHtml = feHtml.replace(/http:\/\/cdn\.solarsquare\.in/g, '/cdn.solarsquare.in');
feHtml = feHtml.replace(/https:\/\/dn5z2jafg7hv0\.cloudfront\.net/g, '/dn5z2jafg7hv0.cloudfront.net');

// Apply branding safely
feHtml = replaceBrandText(feHtml);

// Ensure brand logos point to /images/logo.png
feHtml = feHtml.replace(/<img[^>]+class=[\"']?brand-logo[\"']?[^>]*>/gi, '<img class="brand-logo" src="/images/logo.png" alt="Shree Rudra Power Systems" style="max-height:55px; width:auto; object-fit:contain;">');

// Inject the custom navbar actions (Customer Login & Admin Login buttons)
const feNavButtons = `
<div style="display:inline-flex; align-items:center; gap:10px; margin-left:auto;">
  <a href="/customer/login" style="display:inline-flex; align-items:center; gap:6px; background:#0ea5e9; color:#fff; font-size:13px; font-weight:600; padding:8px 14px; border-radius:6px; text-decoration:none; box-shadow:0 2px 4px rgba(14,165,233,0.3); transition:all 0.2s;">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
    Customer Portal
  </a>
  <a href="/admin/login" style="display:inline-flex; align-items:center; gap:6px; background:#1e293b; color:#fbbf24; font-size:13px; font-weight:600; padding:8px 14px; border-radius:6px; text-decoration:none; border:1px solid #334155; transition:all 0.2s;">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
    Admin Login
  </a>
</div>
`;

// Insert into header / navbar
if (feHtml.includes('</header>')) {
  feHtml = feHtml.replace('</header>', `${feNavButtons}</header>`);
}

// Inject dynamic frontend client script before </body>
if (!feHtml.includes('/dynamic-frontend.js')) {
  feHtml = feHtml.replace('</body>', `<script src="/dynamic-frontend.js"></script>\n</body>`);
}

fs.writeFileSync('frontend/public/home_exact.html', feHtml, 'utf8');
console.log('Generated frontend/public/home_exact.html');

// -------------------------------------------------------------
// 2. Build SolarWebsite/www.solarsquare.in/index.html (for offline / local disk browsing)
// -------------------------------------------------------------
let localHtml = originalHtml;

// Use relative local paths for images
localHtml = localHtml.replace(/https:\/\/cdn\.solarsquare\.in/g, '../cdn.solarsquare.in');
localHtml = localHtml.replace(/http:\/\/cdn\.solarsquare\.in/g, '../cdn.solarsquare.in');
localHtml = localHtml.replace(/https:\/\/dn5z2jafg7hv0\.cloudfront\.net/g, '../dn5z2jafg7hv0.cloudfront.net');

// Apply branding safely
localHtml = replaceBrandText(localHtml);

// Fix logo
localHtml = localHtml.replace(/<img[^>]+class=[\"']?brand-logo[\"']?[^>]*>/gi, '<img class="brand-logo" src="images/logo.png" alt="Shree Rudra Power Systems" style="max-height:55px; width:auto; object-fit:contain;">');

const localNavButtons = `
<div style="display:inline-flex; align-items:center; gap:10px; margin-left:auto;">
  <a href="http://localhost:3000/customer/login" style="display:inline-flex; align-items:center; gap:6px; background:#0ea5e9; color:#fff; font-size:13px; font-weight:600; padding:8px 14px; border-radius:6px; text-decoration:none;">Customer Portal</a>
  <a href="http://localhost:3000/admin/login" style="display:inline-flex; align-items:center; gap:6px; background:#1e293b; color:#fbbf24; font-size:13px; font-weight:600; padding:8px 14px; border-radius:6px; text-decoration:none;">Admin Login</a>
</div>
`;
if (localHtml.includes('</header>')) {
  localHtml = localHtml.replace('</header>', `${localNavButtons}</header>`);
}

fs.writeFileSync('SolarWebsite/www.solarsquare.in/index.html', localHtml, 'utf8');
console.log('Generated SolarWebsite/www.solarsquare.in/index.html');

// -------------------------------------------------------------
// 3. Build root index.html (c:\Users\DELL\Desktop\HTTrack\index.html)
// -------------------------------------------------------------
const rootHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shree Rudra Power Systems - Rooftop Solar Solutions</title>
  <link rel="icon" href="/images/logo.png">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; min-height: 100vh; display: flex; flex-direction: column; }
    header { background: #1e293b; border-bottom: 1px solid #334155; padding: 16px 32px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
    .brand { display: flex; align-items: center; gap: 14px; text-decoration: none; color: #fff; }
    .brand img { height: 48px; border-radius: 6px; }
    .brand h1 { font-size: 20px; font-weight: 700; letter-spacing: -0.5px; }
    .brand span { color: #f59e0b; }
    .nav-links { display: flex; gap: 12px; align-items: center; }
    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 8px; font-size: 14px; font-weight: 600; text-decoration: none; transition: all 0.2s; cursor: pointer; }
    .btn-primary { background: #e11d48; color: #fff; box-shadow: 0 4px 12px rgba(225,29,72,0.3); }
    .btn-primary:hover { background: #be123c; transform: translateY(-1px); }
    .btn-blue { background: #0284c7; color: #fff; box-shadow: 0 4px 12px rgba(2,132,199,0.3); }
    .btn-blue:hover { background: #0369a1; transform: translateY(-1px); }
    .btn-dark { background: #334155; color: #fbbf24; border: 1px solid #475569; }
    .btn-dark:hover { background: #475569; }
    .preview-container { flex: 1; display: flex; flex-direction: column; }
    .preview-bar { background: #0b1120; padding: 10px 32px; font-size: 13px; color: #94a3b8; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #1e293b; }
    iframe { width: 100%; flex: 1; min-height: 85vh; border: none; background: #fff; }
  </style>
</head>
<body>
  <header>
    <a href="http://localhost:3000" class="brand">
      <img src="images/logo.png" alt="Shree Rudra Logo">
      <div>
        <h1>SHREE RUDRA <span>POWER SYSTEMS</span></h1>
        <small style="color:#94a3b8; font-size:12px;">India's Premier Rooftop Solar Energy Partner</small>
      </div>
    </a>
    <div class="nav-links">
      <a href="http://localhost:3000" class="btn btn-primary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        Open Live Website (Next.js :3000)
      </a>
      <a href="http://localhost:3000/customer/login" class="btn btn-blue">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        Customer Portal
      </a>
      <a href="http://localhost:3000/admin/login" class="btn btn-dark">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        Admin Dashboard
      </a>
    </div>
  </header>
  <div class="preview-container">
    <div class="preview-bar">
      <span>⚡ Live Preview: <strong>http://localhost:3000</strong> (Interactive Solar Calculator, Forms, Bookings)</span>
      <a href="http://localhost:3000" target="_blank" style="color:#38bdf8; text-decoration:none;">Open in Full Window &rarr;</a>
    </div>
    <iframe id="mainPreview" src="http://localhost:3000" title="Shree Rudra Power Systems Preview"></iframe>
  </div>
  <script>
    // Fallback to local mirrored site if localhost:3000 is still starting up
    const frame = document.getElementById('mainPreview');
    let loaded = false;
    frame.onload = () => { loaded = true; };
    setTimeout(() => {
      try {
        if (!loaded) {
          frame.src = 'SolarWebsite/www.solarsquare.in/index.html';
        }
      } catch(e) {}
    }, 4000);
  </script>
</body>
</html>`;

fs.writeFileSync('index.html', rootHtml, 'utf8');
console.log('Generated root index.html');

