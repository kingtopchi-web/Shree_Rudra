const fs = require('fs');

const feHtml = fs.readFileSync('frontend/public/home_exact.html', 'utf8');

const gtmMatches = feHtml.match(/<iframe[^>]*googletagmanager[^>]*>.*?<\/iframe>/gi) || [];
console.log('GTM iframes count:', gtmMatches.length);
gtmMatches.forEach(g => console.log('GTM:', g));

const dynMatches = feHtml.match(/<script[^>]*dynamic-frontend[^>]*>.*?<\/script>/gi) || [];
console.log('dynamic-frontend scripts:', dynMatches.length);
dynMatches.forEach(d => console.log('DYN:', d));

// Check any other public/ or gtm
const anyPublic = feHtml.match(/(?:src|href)=["']\/public\/[^"']+["']/gi) || [];
console.log('Any /public/ references:', anyPublic);

