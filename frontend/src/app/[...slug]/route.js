import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

export const dynamic = 'force-dynamic';

const MIME_MAP = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

const KNOWN_DOMAINS = [
  'cdn.solarsquare.in',
  'website-assets.solarsquare.in',
  'staging.solarsquare.in',
  'dn5z2jafg7hv0.cloudfront.net',
  'sse-website.s3.ap-south-1.amazonaws.com',
  'sse-blog-staging.s3.ap-south-1.amazonaws.com',
  'a.slack-edge.com',
  'cdn.jsdelivr.net',
  'code.jquery.com',
  'stackpath.bootstrapcdn.com'
];

function getBaseDir() {
  const rootDir = process.cwd();
  return fs.existsSync(path.join(rootDir, 'SolarWebsite'))
    ? rootDir
    : path.resolve(rootDir, '..');
}

function resolveFile(slugArray) {
  const relPath = slugArray.join('/');
  const baseDir = getBaseDir();

  const candidates = [
    path.join(baseDir, 'SolarWebsite', 'www.solarsquare.in', relPath),
    path.join(baseDir, 'SolarWebsite', 'www.solarsquare.in', relPath, 'index.html'),
    path.join(baseDir, 'SolarWebsite', 'www.solarsquare.in', relPath + '.html'),
    path.join(baseDir, 'SolarWebsite', relPath),
    path.join(baseDir, 'frontend', 'public', relPath),
    path.join(baseDir, 'public', relPath)
  ];

  for (const c of candidates) {
    if (fs.existsSync(c)) {
      try {
        const stat = fs.statSync(c);
        if (stat.isFile()) return c;
      } catch (e) {}
    }
  }
  return null;
}

// Fetch on-demand and cache locally if missing
function fetchAndCacheAsset(assetDomain, assetPath, localPath) {
  return new Promise((resolve) => {
    const upstreamUrl = `https://${assetDomain}/${assetPath}`;
    const client = upstreamUrl.startsWith('https') ? https : http;

    fs.mkdirSync(path.dirname(localPath), { recursive: true });

    const req = client.get(upstreamUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        try {
          const loc = new URL(res.headers.location);
          return fetchAndCacheAsset(loc.hostname, loc.pathname.replace(/^\//, ''), localPath).then(resolve);
        } catch (e) {
          return resolve(null);
        }
      }
      if (res.statusCode !== 200) {
        return resolve(null);
      }

      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        try {
          fs.writeFileSync(localPath, buffer);
        } catch (e) {}
        resolve(buffer);
      });
      res.on('error', () => resolve(null));
    });

    req.on('error', () => resolve(null));
    req.setTimeout(8000, () => {
      req.abort();
      resolve(null);
    });
  });
}

function transformHtml(html) {
  let res = html;

  // Title tag
  res = res.replace(/<title>.*?<\/title>/i, (match) => {
    return match.replace(/SolarSquare/gi, 'Shree Rudra Power Systems');
  });

  // Safe brand name replacements
  res = res.replace(/SolarSquare Energy/gi, 'Shree Rudra Power Systems');
  res = res.replace(/SolarSquare/gi, 'Shree Rudra Power Systems');
  res = res.replace(/solarsquare\.in/gi, 'shreerudrapower.com');

  // Restore directory / asset domain names that were accidentally replaced
  for (const d of KNOWN_DOMAINS) {
    const mangled1 = d.replace('solarsquare.in', 'Shree Rudra Power Systems.in');
    const mangled2 = d.replace('solarsquare.in', 'shreerudrapower.com');
    res = res.split(mangled1).join(d);
    res = res.split(mangled2).join(d);
  }

  // Rewrite relative & absolute paths for ALL asset domains properly preserving attr name (src or href)
  for (const d of KNOWN_DOMAINS) {
    const escapedDomain = d.replace(/\./g, '\\.');
    const regex = new RegExp(`(src|href)=["']?(?:\\.\\.\\/)+${escapedDomain}\\/([^"'\\s>]+)["']?`, 'gi');
    res = res.replace(regex, (match, attr, subPath) => {
      return `${attr}="/${d}/${subPath}"`;
    });

    const absRegex = new RegExp(`(src|href)=["']?https?:\\/\\/${escapedDomain}\\/([^"'\\s>]+)["']?`, 'gi');
    res = res.replace(absRegex, (match, attr, subPath) => {
      return `${attr}="/${d}/${subPath}"`;
    });
  }

  // Brand logo
  res = res.replace(/<img[^>]+class=["']?brand-logo["']?[^>]*>/gi, '<img class="brand-logo" src="/images/logo.png" alt="Shree Rudra Power Systems" style="height:92px; max-height:95px; width:auto; object-fit:contain; border:none !important; outline:none !important; background:transparent !important; box-shadow:none !important; filter:none !important;">');

  // GTM fix
  res = res.replace(/j\.src=['"][^'"]*gtm5445\.html\?id=['"]\+i/g, "j.src='https://www.googletagmanager.com/gtm.js?id='+i");
  res = res.replace(/\.\.\/www\.googletagmanager\.com\/gtm5445\.html/g, 'https://www.googletagmanager.com/gtm.js');
  res = res.replace(/www\.googletagmanager\.com\/gtm5445\.html/g, 'https://www.googletagmanager.com/gtm.js');

  // Purge all anchor / link tags pointing to solarsquare or external portals
  res = res.replace(/href=["']?([^"'\s>]+)["']?/gi, (match, url) => {
    if (url.startsWith('/cdn.') || url.startsWith('/website-assets.') || url.startsWith('/staging.') || url.startsWith('/images/')) {
      return match;
    }

    if (/https?:\/\/(?:www\.)?(?:solarsquare\.in|shreerudrapower\.com)(\/[^"'\s]*)?/i.test(url)) {
      const pathMatch = url.match(/https?:\/\/(?:www\.)?(?:solarsquare\.in|shreerudrapower\.com)(\/[^"'\s]*)?/i);
      const localPath = pathMatch[1] ? pathMatch[1] : '/';
      return `href="${localPath}"`;
    }

    if (/solarsquare|keka\.com|com\.sse\.consumer/i.test(url)) {
      return 'href="#"';
    }

    return match;
  });

  // Inject dynamic-frontend.js before </body>
  if (!res.includes('/dynamic-frontend.js')) {
    res = res.replace('</body>', `<script src="/dynamic-frontend.js"></script>\n</body>`);
  }

  res = res.replace(/<script[^>]+src=["']?[^"']*11bb4\.js["']?[^>]*><\/script>/gi, '');
  
  // Contact details updates
  res = res.replace(/\+91-?98-?3000-?3000/g, '+91 8354822499');
  res = res.replace(/\+919830003000/g, '+918354822499');
  res = res.replace(/98\s*3000\s*3000/g, '+91 8354822499');
  res = res.replace(/70\s*3000\s*3000/g, '+91 8354822499');
  res = res.replace(/7030003000/g, '8354822499');
  res = res.replace(/7841853832/g, '8354822499');
  res = res.replace(/href=["']tel:[^"']*["']/gi, 'href="tel:+918354822499"');

  res = res.replace(/welisten@shreerudrapower\.com/g, 'shreerudrapowersystems@gmail.com');
  res = res.replace(/welisten@solarsquare\.in/g, 'shreerudrapowersystems@gmail.com');
  res = res.replace(/ni\.erauqsralos@netsilew/g, 'shreerudrapowersystems@gmail.com');
  res = res.replace(/<span class=reverse-text[^>]*>.*?<\/span>/gi, 'shreerudrapowersystems@gmail.com');

  res = res.replace(/https:\/\/maps\.google\.com\/\?q=1101-B[^"'\s>]+/gi, 'https://maps.google.com/?q=Indira+Nagar,+Lucknow,+Uttar+Pradesh+226016');
  res = res.replace(/>\s*1101-B,[\s\S]*?Maharashtra\s*400058\s*<\/a>/gi, '>Indira Nagar, Lucknow, Uttar Pradesh - 226016</a>');

  return res;
}

export async function GET(request, { params }) {
  const slug = params.slug || [];
  const baseDir = getBaseDir();

  const firstSegment = slug[0];

  // Check if this request is for an asset domain (cdn.solarsquare.in, etc.)
  if (KNOWN_DOMAINS.includes(firstSegment)) {
    const domain = firstSegment;
    const assetSubPath = slug.slice(1).join('/');

    // Check frontend/public first
    const frontendPublicTarget = path.join(baseDir, 'frontend', 'public', domain, assetSubPath);
    if (fs.existsSync(frontendPublicTarget) && fs.statSync(frontendPublicTarget).isFile()) {
      const buffer = fs.readFileSync(frontendPublicTarget);
      const ext = path.extname(frontendPublicTarget).toLowerCase();
      const mime = MIME_MAP[ext] || 'application/octet-stream';
      return new Response(buffer, {
        status: 200,
        headers: {
          'Content-Type': mime,
          'Cache-Control': 'public, max-age=31536000, immutable'
        }
      });
    }

    // Check SolarWebsite target
    const localTarget = path.join(baseDir, 'SolarWebsite', domain, assetSubPath);
    if (fs.existsSync(localTarget) && fs.statSync(localTarget).isFile()) {
      const buffer = fs.readFileSync(localTarget);
      const ext = path.extname(localTarget).toLowerCase();
      const mime = MIME_MAP[ext] || 'application/octet-stream';
      return new Response(buffer, {
        status: 200,
        headers: {
          'Content-Type': mime,
          'Cache-Control': 'public, max-age=31536000, immutable'
        }
      });
    }

    // If missing from disk, fetch on-demand from upstream CDN and cache in frontend/public!
    const buffer = await fetchAndCacheAsset(domain, assetSubPath, frontendPublicTarget);
    if (buffer) {
      const ext = path.extname(frontendPublicTarget).toLowerCase();
      const mime = MIME_MAP[ext] || 'application/octet-stream';
      return new Response(buffer, {
        status: 200,
        headers: {
          'Content-Type': mime,
          'Cache-Control': 'public, max-age=31536000, immutable'
        }
      });
    }
  }

  // Regular page resolution
  let targetFile = resolveFile(slug);

  if (!targetFile) {
    return new Response('Page Not Found', { status: 404, headers: { 'Content-Type': 'text/plain' } });
  }

  let ext = path.extname(targetFile).toLowerCase();

  // If HTML file
  if (ext === '.html' || ext === '.htm') {
    let raw = fs.readFileSync(targetFile, 'utf8');

    // Auto-follow meta refresh redirects
    const refreshMatch = raw.match(/<META HTTP-EQUIV="Refresh" CONTENT="0;\s*URL=([^"]+)"/i);
    if (refreshMatch && raw.length < 1500) {
      const targetRel = refreshMatch[1];
      const targetAbs = path.resolve(path.dirname(targetFile), targetRel);
      if (fs.existsSync(targetAbs) && fs.statSync(targetAbs).isFile()) {
        targetFile = targetAbs;
        raw = fs.readFileSync(targetFile, 'utf8');
      }
    }

    const transformed = transformHtml(raw);
    return new Response(transformed, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }

  // If static asset
  const buffer = fs.readFileSync(targetFile);
  const mime = MIME_MAP[ext] || 'application/octet-stream';
  return new Response(buffer, {
    status: 200,
    headers: {
      'Content-Type': mime,
      'Cache-Control': 'public, max-age=86400'
    }
  });
}
