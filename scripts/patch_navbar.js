const fs = require('fs');
const path = require('path');

const filePath = path.join('frontend', 'public', 'home_exact.html');
let html = fs.readFileSync(filePath, 'utf8');

const desktopButton = '<button onclick=trackNavbarSignUpClickEvent(); class="btn btn-lg signup-electricity-header-right-corner-button btn-open-lead-form" role=button aria-pressed=true data-bs-toggle=modal data-bs-target=#leadFormModal data-cta=get_free_quote data-button-text="Submit Details"  data-title="Get Free Quote"> Get Free Quote </button>';

const loginButtons = `
  <a href="/customer/login" style="background:#111827; color:#ffffff; padding:8px 16px; border-radius:20px; font-size:12.5px; font-weight:700; text-decoration:none; display:inline-flex; align-items:center; gap:6px; margin-right:8px; box-shadow:0 2px 6px rgba(0,0,0,0.15);">
    <span style="display:inline-block; width:7px; height:7px; background:#10b981; border-radius:50%;"></span> Customer Login
  </a>
  <a href="/admin/login" style="background:#E51D24; color:#ffffff; padding:8px 16px; border-radius:20px; font-size:12.5px; font-weight:700; text-decoration:none; display:inline-flex; align-items:center; gap:6px; margin-right:8px; box-shadow:0 2px 6px rgba(229,29,36,0.25);">
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Admin Login
  </a>
`;

if (html.includes(desktopButton)) {
  html = html.replace(desktopButton, loginButtons + desktopButton);
  fs.writeFileSync(filePath, html, 'utf8');
  console.log('Successfully added Customer Login & Admin Login buttons to navbar!');
} else {
  console.log('Desktop button not found');
}
