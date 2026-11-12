// Shree Rudra Power Systems - Dynamic Frontend Logic
(function() {
  'use strict';

  const TARGET_WHATSAPP = '918354822499';
  const TARGET_PHONE = '8354822499';
  const TARGET_EMAIL = 'shreerudrapowersystems@gmail.com';
  const TARGET_ADDRESS = 'Indira Nagar, Lucknow, Uttar Pradesh - 226016';

  // Fast offline Indian Pincode fallback lookup (prefix -> Region)
  const PIN_PREFIX_MAP = {
    '227406': { district: 'Amethi (Sultanpur)', state: 'Uttar Pradesh' },
    '227': { district: 'Amethi / Sultanpur', state: 'Uttar Pradesh' },
    '228': { district: 'Sultanpur', state: 'Uttar Pradesh' },
    '229': { district: 'Raebareli', state: 'Uttar Pradesh' },
    '226': { district: 'Lucknow', state: 'Uttar Pradesh' },
    '225': { district: 'Barabanki', state: 'Uttar Pradesh' },
    '201': { district: 'Noida / Ghaziabad', state: 'Uttar Pradesh' },
    '11': { district: 'New Delhi', state: 'Delhi' },
    '12': { district: 'Gurugram / Faridabad', state: 'Haryana' },
    '13': { district: 'Ambala / Panipat', state: 'Haryana' },
    '14': { district: 'Ludhiana / Jalandhar', state: 'Punjab' },
    '15': { district: 'Bathinda / Patiala', state: 'Punjab' },
    '16': { district: 'Chandigarh', state: 'Chandigarh' },
    '17': { district: 'Shimla', state: 'Himachal Pradesh' },
    '18': { district: 'Jammu', state: 'Jammu & Kashmir' },
    '19': { district: 'Srinagar', state: 'Jammu & Kashmir' },
    '20': { district: 'Noida / Aligarh', state: 'Uttar Pradesh' },
    '21': { district: 'Prayagraj', state: 'Uttar Pradesh' },
    '22': { district: 'Amethi / Sultanpur / Lucknow', state: 'Uttar Pradesh' },
    '23': { district: 'Varanasi / Mirzapur', state: 'Uttar Pradesh' },
    '24': { district: 'Dehradun / Bareilly', state: 'Uttarakhand / UP' },
    '25': { district: 'Meerut', state: 'Uttar Pradesh' },
    '26': { district: 'Bareilly', state: 'Uttar Pradesh' },
    '27': { district: 'Gorakhpur', state: 'Uttar Pradesh' },
    '28': { district: 'Agra', state: 'Uttar Pradesh' },
    '30': { district: 'Jaipur', state: 'Rajasthan' },
    '31': { district: 'Udaipur', state: 'Rajasthan' },
    '32': { district: 'Kota', state: 'Rajasthan' },
    '33': { district: 'Bikaner', state: 'Rajasthan' },
    '34': { district: 'Jodhpur', state: 'Rajasthan' },
    '36': { district: 'Rajkot', state: 'Gujarat' },
    '37': { district: 'Kutch / Jamnagar', state: 'Gujarat' },
    '38': { district: 'Ahmedabad', state: 'Gujarat' },
    '39': { district: 'Surat / Vadodara', state: 'Gujarat' },
    '40': { district: 'Mumbai', state: 'Maharashtra' },
    '41': { district: 'Pune', state: 'Maharashtra' },
    '42': { district: 'Nashik', state: 'Maharashtra' },
    '43': { district: 'Aurangabad', state: 'Maharashtra' },
    '44': { district: 'Nagpur', state: 'Maharashtra' },
    '45': { district: 'Indore', state: 'Madhya Pradesh' },
    '46': { district: 'Bhopal', state: 'Madhya Pradesh' },
    '47': { district: 'Gwalior', state: 'Madhya Pradesh' },
    '48': { district: 'Jabalpur', state: 'Madhya Pradesh' },
    '49': { district: 'Raipur', state: 'Chhattisgarh' },
    '50': { district: 'Hyderabad', state: 'Telangana' },
    '51': { district: 'Tirupati / Kadapa', state: 'Andhra Pradesh' },
    '52': { district: 'Vijayawada', state: 'Andhra Pradesh' },
    '53': { district: 'Visakhapatnam', state: 'Andhra Pradesh' },
    '56': { district: 'Bengaluru', state: 'Karnataka' },
    '57': { district: 'Mangaluru', state: 'Karnataka' },
    '58': { district: 'Hubballi', state: 'Karnataka' },
    '59': { district: 'Belagavi', state: 'Karnataka' },
    '60': { district: 'Chennai', state: 'Tamil Nadu' },
    '61': { district: 'Thanjavur', state: 'Tamil Nadu' },
    '62': { district: 'Madurai', state: 'Tamil Nadu' },
    '63': { district: 'Salem / Vellore', state: 'Tamil Nadu' },
    '64': { district: 'Coimbatore', state: 'Tamil Nadu' },
    '67': { district: 'Kozhikode', state: 'Kerala' },
    '68': { district: 'Kochi', state: 'Kerala' },
    '69': { district: 'Thiruvananthapuram', state: 'Kerala' },
    '70': { district: 'Kolkata', state: 'West Bengal' },
    '71': { district: 'Howrah', state: 'West Bengal' },
    '72': { district: 'Midnapore', state: 'West Bengal' },
    '73': { district: 'Siliguri', state: 'West Bengal' },
    '74': { district: 'North 24 Parganas', state: 'West Bengal' },
    '75': { district: 'Bhubaneswar', state: 'Odisha' },
    '76': { district: 'Cuttack', state: 'Odisha' },
    '77': { district: 'Rourkela', state: 'Odisha' },
    '78': { district: 'Guwahati', state: 'Assam' },
    '79': { district: 'Shillong / Agartala', state: 'North East' },
    '80': { district: 'Patna', state: 'Bihar' },
    '81': { district: 'Bhagalpur', state: 'Bihar' },
    '82': { district: 'Gaya', state: 'Bihar' },
    '83': { district: 'Ranchi', state: 'Jharkhand' },
    '84': { district: 'Muzaffarpur', state: 'Bihar' },
    '85': { district: 'Purnea', state: 'Bihar' }
  };

  function init() {
    injectCompactSpacingStyles();
    setupBranding();
    document.querySelectorAll('.footer-logo .brand-logo, .footer-brand-image img, footer img.brand-logo').forEach(img => {
      img.style.setProperty('filter', 'brightness(0) invert(1)', 'important');
    });
    const footerMain = document.querySelector('div.footer');
    const footerLoc = document.getElementById('footer-locations-href') || document.querySelector('div.footer-locations');
    if (footerMain && footerLoc && footerLoc.parentNode && (footerMain.compareDocumentPosition(footerLoc) & Node.DOCUMENT_POSITION_FOLLOWING)) {
      footerLoc.parentNode.insertBefore(footerMain, footerLoc.nextSibling);
    }
    balanceFooterLocations();
    balanceMainFooter();
    cleanAllSolarSquareLinks();
    updateContactInfoDOM();
    setupPincodeLookup();
    setupBillSlider();
    bindSolarCalculator();
    bindAllFormsToWhatsApp();
    injectCalculationModal();
    injectFloatingWhatsAppWidget();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 0. Compact Excessive White Space Across All Pages
  function injectCompactSpacingStyles() {
    if (!document.getElementById('sr-compact-spacing')) {
      const style = document.createElement('style');
      style.id = 'sr-compact-spacing';
      style.textContent = `
        .get-solar-section,
        .good-zero-rates-section,
        .goodzero-pride,
        #solar-calc-blog-component,
        .testimonials-section,
        .in-the-news-section,
        .experience-centre-section,
        .ec-section,
        .partner-section,
        .awards-section,
        .process-section,
        .benefits-section,
        .solar-solutions-section {
          padding-top: 28px !important;
          padding-bottom: 28px !important;
        }
        .goodzero-promise,
        .faq-section,
        .common-faq {
          margin-top: 24px !important;
          margin-bottom: 24px !important;
          padding-top: 20px !important;
          padding-bottom: 20px !important;
        }
        .in-news-slider {
          margin-top: 12px !important;
          margin-bottom: 24px !important;
        }
        .divider {
          margin-top: 14px !important;
          margin-bottom: 14px !important;
        }
        .wp-block-spacer {
          height: 16px !important;
          min-height: 16px !important;
        }
        .space-section {
          height: 12px !important;
          padding-top: 0 !important;
          padding-bottom: 0 !important;
        }
        .read-more-section,
        footer.footer,
        .footer-wrapper {
          padding-top: 28px !important;
          padding-bottom: 24px !important;
          margin-top: 12px !important;
        }
        @media (max-width: 768px) {
          .get-solar-section,
          .good-zero-rates-section,
          .goodzero-pride,
          #solar-calc-blog-component,
          .testimonials-section,
          .in-the-news-section {
            padding-top: 20px !important;
            padding-bottom: 20px !important;
          }
          .goodzero-promise,
          .faq-section,
          .common-faq {
            margin-top: 16px !important;
            margin-bottom: 16px !important;
          }
        }
      `;
      document.head.appendChild(style);
    }

    // Clamp any remaining oversized (>=48px) vertical paddings/margins on page sections
    const blocks = document.querySelectorAll('main > section, main > div, .entry-content > section, .entry-content > div, .wp-block-group');
    blocks.forEach(el => {
      if (
        el.classList.contains('hero-section') ||
        el.closest('.hero-section') ||
        el.closest('header') ||
        el.closest('.modal') ||
        el.id === 'sr-calc-modal'
      ) {
        return;
      }
      const cs = window.getComputedStyle(el);
      if (parseFloat(cs.paddingTop) >= 48) el.style.setProperty('padding-top', '26px', 'important');
      if (parseFloat(cs.paddingBottom) >= 48) el.style.setProperty('padding-bottom', '26px', 'important');
      if (parseFloat(cs.marginTop) >= 48) el.style.setProperty('margin-top', '20px', 'important');
      if (parseFloat(cs.marginBottom) >= 48) el.style.setProperty('margin-bottom', '20px', 'important');
    });
  }

  // 1. Branding: enforce Shree Rudra Power Systems and large transparent logo
  function setupBranding() {
    const logos = document.querySelectorAll('img.brand-logo, img[alt*="SolarSquare"], img[alt*="logo"]');
    logos.forEach(img => {
      if (img.classList.contains('brand-logo') || (img.alt && img.alt.toLowerCase().includes('solarsquare'))) {
        img.src = '/images/logo.png';
        img.alt = 'Shree Rudra Power Systems';
        img.style.objectFit = 'contain';
        img.style.height = '92px';
        img.style.maxHeight = '95px';
        img.style.maxWidth = '280px';
        img.style.border = 'none';
        img.style.background = 'transparent';
        img.style.outline = 'none';
        img.style.boxShadow = 'none';
      }
    });
    document.title = 'Shree Rudra Power Systems - Rooftop Solar Solutions';
  }

  // 1b. Balance Footer Locations Grid (6 equal columns x 4 cities each)
  function balanceFooterLocations() {
    const row = document.querySelector('#footer-locations-href .footer-locations-block, .footer-locations .footer-locations-block');
    if (!row) return;

    const existingLinks = {};
    row.querySelectorAll('a').forEach(a => {
      const key = (a.textContent || '').trim().toLowerCase();
      if (key && a.getAttribute('href') && a.getAttribute('href') !== '#') {
        existingLinks[key] = a.getAttribute('href');
      }
    });

    const columns = [
      { state: 'DELHI NCR', cities: ['Delhi', 'Gurugram', 'NCR', 'Faridabad'] },
      { state: 'GUJARAT', cities: ['Ahmedabad', 'Anand', 'Gandhinagar', 'Surat'] },
      { state: 'MADHYA PRADESH', cities: ['Bhopal', 'Gwalior', 'Indore', 'Jabalpur'] },
      { state: 'MAHARASHTRA', cities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik'] },
      { state: 'RAJASTHAN', cities: ['Ajmer', 'Jaipur', 'Jodhpur', 'Kota'] },
      { state: 'UTTAR PRADESH', cities: ['Lucknow', 'Noida', 'Kanpur', 'Varanasi'] }
    ];

    row.innerHTML = columns.map(col => {
      const items = col.cities.map(city => {
        const href = existingLinks[city.toLowerCase()] || `/rooftop-solar-in-${city.toLowerCase()}/`;
        return `<li><a href="${href}">${city}</a></li>`;
      }).join('');
      return `
        <div class="col-md-2 col-6 footer-locations-content">
          <p class="location-bold"><a href="#" style="white-space:nowrap;">${col.state}</a></p>
          <ul>${items}</ul>
        </div>
      `;
    }).join('');
  }

  // 1c. Balance Main Dark-Blue Footer (4 equal-height columns, 6 clean links each, no word-break on email)
  function balanceMainFooter() {
    const footer = document.querySelector('div.footer');
    if (!footer) return;

    const row = footer.querySelector('.container > .row');
    if (!row) return;

    if (!document.getElementById('sr-balanced-footer-css')) {
      const st = document.createElement('style');
      st.id = 'sr-balanced-footer-css';
      st.textContent = `
        div.footer .sr-footer-grid {
          display: grid;
          grid-template-columns: 1.05fr 1fr 1fr 1.25fr;
          gap: 28px;
          align-items: stretch;
          padding: 36px 12px;
        }
        div.footer .sr-footer-col {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          padding-right: 20px;
          border-right: 1px solid rgba(255, 255, 255, 0.14);
        }
        div.footer .sr-footer-col:last-child {
          border-right: none;
          padding-right: 0;
        }
        div.footer .sr-footer-title {
          font-size: 16px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 14px 0;
        }
        div.footer .sr-footer-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        div.footer .sr-footer-list a {
          color: rgba(255, 255, 255, 0.85);
          text-decoration: none;
          font-size: 14px;
          line-height: 1.4;
          white-space: nowrap;
        }
        div.footer .sr-footer-list a:hover {
          color: #ffffff;
          text-decoration: underline;
        }
        div.footer .sr-contact-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 12px;
          color: rgba(255, 255, 255, 0.9);
          font-size: 13.5px;
          line-height: 1.45;
        }
        div.footer .sr-contact-item a {
          color: rgba(255, 255, 255, 0.9);
          text-decoration: none;
        }
        div.footer .sr-social-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: auto;
          padding-top: 8px;
        }
        div.footer .sr-social-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.12);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          text-decoration: none;
          font-weight: 700;
          font-size: 15px;
        }
        @media (max-width: 991px) {
          div.footer .sr-footer-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
          }
          div.footer .sr-footer-col {
            border-right: none;
            padding-right: 0;
          }
        }
        @media (max-width: 575px) {
          div.footer .sr-footer-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }
      `;
      document.head.appendChild(st);
    }

    const socialImgs = Array.from(footer.querySelectorAll('.social-media-icons a img, .footer-social a img'));
    const socialIconsHtml = socialImgs.length >= 4
      ? socialImgs.slice(0, 4).map(img => `<a href="#" class="sr-social-btn">${img.outerHTML}</a>`).join('')
      : `
        <a href="#" class="sr-social-btn" aria-label="Facebook">f</a>
        <a href="#" class="sr-social-btn" aria-label="Instagram">ig</a>
        <a href="#" class="sr-social-btn" aria-label="YouTube">▶</a>
        <a href="#" class="sr-social-btn" aria-label="LinkedIn">in</a>
      `;

    row.className = 'sr-footer-grid';
    row.innerHTML = `
      <div class="sr-footer-col">
        <div class="footer-brand-image" style="margin-bottom:14px;">
          <a href="/">
            <img class="brand-logo" src="/images/logo.png" alt="Shree Rudra Power Systems" style="height:82px; max-height:86px; width:auto; object-fit:contain; border:none !important; outline:none !important; background:transparent !important; box-shadow:none !important; filter:brightness(0) invert(1) !important;">
          </a>
        </div>
        <p style="margin:0 0 14px 0; font-size:13.5px; line-height:1.55; color:rgba(255,255,255,0.82);">
          India's Trusted Rooftop Solar Partner — Clean Energy &amp; Guaranteed Savings.
        </p>
        <div class="footer-mii" style="margin-top:auto; font-size:14px; color:#ffffff;">Proudly made in India ❤️</div>
      </div>

      <div class="sr-footer-col">
        <div class="sr-footer-title">Our Offerings</div>
        <ul class="sr-footer-list">
          <li><a href="/homes">Homes</a></li>
          <li><a href="/commercial">Commercial</a></li>
          <li><a href="/housing-society">Housing Society</a></li>
          <li><a href="/on-grid-solar-system">On-Grid Solar</a></li>
          <li><a href="/off-grid-solar-system">Off-Grid Solar</a></li>
          <li><a href="/solar-calculator">Solar Calculator</a></li>
        </ul>
      </div>

      <div class="sr-footer-col">
        <div class="sr-footer-title">Quick Links</div>
        <ul class="sr-footer-list">
          <li><a href="/about-us">About Us</a></li>
          <li><a href="/pm-surya-ghar-muft-bijli-yojana">PM Surya Ghar</a></li>
          <li><a href="/solar-experience-centre">Experience Centre</a></li>
          <li><a href="/solarpro">SolarPro Partner</a></li>
          <li><a href="/blog">Blog</a></li>
          <li><a href="/contact-us">Contact Us</a></li>
        </ul>
      </div>

      <div class="sr-footer-col">
        <div class="sr-footer-title">Contact Us</div>
        <div class="sr-contact-item">
          <span>📞</span>
          <a href="tel:+918354822499" style="white-space:nowrap;">+91 8354822499</a>
        </div>
        <div class="sr-contact-item">
          <span>✉️</span>
          <a href="mailto:shreerudrapowersystems@gmail.com" style="white-space:nowrap;">shreerudrapowersystems@gmail.com</a>
        </div>
        <div class="sr-contact-item">
          <span>📍</span>
          <a href="https://maps.google.com/?q=Indira+Nagar,+Lucknow,+Uttar+Pradesh+226016" target="_blank" rel="noopener">Indira Nagar, Lucknow, Uttar Pradesh - 226016</a>
        </div>
        <div class="sr-social-row">${socialIconsHtml}</div>
      </div>
    `;
  }

  // 2. Clean all external SolarSquare & third-party redirect links across the page
  function cleanAllSolarSquareLinks() {
    const anchors = document.querySelectorAll('a[href]');
    anchors.forEach(a => {
      const href = a.getAttribute('href');
      if (!href) return;

      if (href.includes('solarsquare.in') || href.includes('shreerudrapower.com')) {
        try {
          const url = new URL(href, window.location.origin);
          if (url.hostname.includes('solarsquare.in') || url.hostname.includes('shreerudrapower.com')) {
            const localPath = url.pathname + (url.search || '');
            a.setAttribute('href', localPath === '' ? '/' : localPath);
          }
        } catch (e) {
          a.setAttribute('href', '#');
          a.removeAttribute('target');
        }
      } else if (
        /^https?:\/\//i.test(href) &&
        !href.includes(window.location.host) &&
        !/wa\.me|api\.whatsapp\.com|maps\.google\.com/i.test(href)
      ) {
        a.setAttribute('href', '#');
        a.removeAttribute('target');
      } else if (href === '#' && a.hasAttribute('target')) {
        a.removeAttribute('target');
      }
    });
  }

  // 3. Update Contact info in DOM
  function updateContactInfoDOM() {
    const telLinks = document.querySelectorAll('#footerContactMenu a[href^="tel:"], .footer a[href^="tel:"]');
    telLinks.forEach(a => {
      a.setAttribute('href', 'tel:+91' + TARGET_PHONE);
      a.innerText = '+91 ' + TARGET_PHONE;
    });

    const mailLinks = document.querySelectorAll('#footerContactMenu a[href^="mailto:"], .footer a[href^="mailto:"], a[href*="email-protection"], a[href^="mailto:"]');
    mailLinks.forEach(a => {
      const href = a.getAttribute('href') || '';
      const txt = a.textContent || '';
      if (
        href.includes('email-protection') ||
        /solarsquare|welisten|shreerudrapower\.com|\[email/i.test(href + ' ' + txt) ||
        a.closest('.footer, #footerContactMenu')
      ) {
        a.setAttribute('href', 'mailto:' + TARGET_EMAIL);
        a.innerText = TARGET_EMAIL;
      }
    });

    document.querySelectorAll('span.__cf_email__').forEach(sp => {
      sp.textContent = TARGET_EMAIL;
    });

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const val = node.nodeValue;
      if (val && /7208979637|9830003000|7030003000|welisten@|@solarsquare\.in/i.test(val)) {
        node.nodeValue = val
          .replace(/7208979637|9830003000|7030003000/g, TARGET_PHONE)
          .replace(/[a-z0-9._%+-]+@(?:solarsquare\.in|shreerudrapower\.com)/gi, TARGET_EMAIL);
      }
    }

    const addressLinks = document.querySelectorAll('.footer-address a');
    addressLinks.forEach(a => {
      a.setAttribute('href', 'https://maps.google.com/?q=Indira+Nagar,+Lucknow,+Uttar+Pradesh+226016');
      a.innerText = TARGET_ADDRESS;
    });
  }

  // 4. Pincode Lookup & Dynamic District Badge
  function setupPincodeLookup() {
    const pinInputs = document.querySelectorAll('#homes_pincode, input[name="pin"], input[placeholder*="Pin"], input[placeholder*="pin"]');
    
    pinInputs.forEach(pinInput => {
      let badge = document.getElementById('sr-pincode-district-badge');
      if (!badge) {
        badge = document.createElement('div');
        badge.id = 'sr-pincode-district-badge';
        badge.style.cssText = 'margin-top:8px; font-size:13.5px; font-weight:700; color:#0f172a; display:none; align-items:center; gap:8px; background:#f0fdf4; border:1.5px solid #86efac; border-radius:8px; padding:7px 12px; transition:all 0.2s ease;';
        
        const parent = pinInput.closest('.pincode-form') || pinInput.parentNode;
        parent.appendChild(badge);
      }

      async function handlePinChange() {
        const val = pinInput.value.replace(/[^0-9]/g, '');
        pinInput.value = val;
        window.currentSolarPincode = val;

        const calcBtn = document.getElementById('calculate-now-calc');

        if (val.length === 6) {
          badge.style.display = 'flex';
          badge.innerHTML = `<span>⏳</span> <span>Locating service area...</span>`;

          let fallback = PIN_PREFIX_MAP[val] || PIN_PREFIX_MAP[val.substring(0, 3)] || PIN_PREFIX_MAP[val.substring(0, 2)] || { district: 'Solar Service Hub', state: 'India' };

          try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 2500);
            const res = await fetch(`/api/pincode/${val}`, { signal: controller.signal }).then(r => r.json()).catch(() => null);
            clearTimeout(timeout);

            let district = fallback.district;
            let state = fallback.state;

            if (res && res.success && res.data) {
              district = res.data.district || district;
              state = res.data.state || state;
            }

            window.currentSolarDistrict = `${district}, ${state}`;
            badge.style.display = 'flex';
            badge.innerHTML = `
              <span style="font-size:16px;">📍</span>
              <span style="color:#065f46; font-weight:800;">${district}, ${state}</span>
              <span style="margin-left:auto; background:#10b981; color:#ffffff; font-size:11px; padding:2px 8px; border-radius:12px; font-weight:700;">Active Area</span>
            `;

            const cityInput = document.getElementById('homes_city');
            if (cityInput) cityInput.value = district;

            const cityForm = document.querySelector('.city-form');
            if (cityForm) cityForm.style.display = 'block';

            if (calcBtn) {
              calcBtn.removeAttribute('disabled');
              calcBtn.style.opacity = '1';
              calcBtn.style.cursor = 'pointer';
            }
          } catch (e) {
            window.currentSolarDistrict = `${fallback.district}, ${fallback.state}`;
            badge.style.display = 'flex';
            badge.innerHTML = `
              <span style="font-size:16px;">📍</span>
              <span style="color:#065f46; font-weight:800;">${fallback.district}, ${fallback.state}</span>
              <span style="margin-left:auto; background:#10b981; color:#ffffff; font-size:11px; padding:2px 8px; border-radius:12px; font-weight:700;">Active Area</span>
            `;
            if (calcBtn) {
              calcBtn.removeAttribute('disabled');
              calcBtn.style.opacity = '1';
              calcBtn.style.cursor = 'pointer';
            }
          }
        } else {
          badge.style.display = 'none';
        }
      }

      pinInput.addEventListener('input', handlePinChange);
      pinInput.addEventListener('change', handlePinChange);

      if (pinInput.value && pinInput.value.length === 6) {
        handlePinChange();
      }
    });
  }

  // 5. 100% Responsive, Interactive Bill Slider (₹500 to ₹10,000)
  function computeSolarMetrics(bill) {
    const num = Math.min(10000, Math.max(500, Number(bill) || 3500));
    let systemKw = 2;
    if (num >= 7000) systemKw = 5;
    else if (num >= 5000) systemKw = 4;
    else if (num >= 3000) systemKw = 3;
    else if (num >= 2000) systemKw = 2;
    else systemKw = 1;

    const subsidy = systemKw >= 3 ? 78000 : (systemKw === 2 ? 60000 : 30000);
    const monthlySavings = Math.round(num * 0.90);
    const yearlySavings = monthlySavings * 12;
    const fiveYearSavings = yearlySavings * 5;
    const savings25Years = yearlySavings * 25;
    const roofArea = systemKw * 100;
    const co2Kg = Math.round(systemKw * 1200);
    const trees = Math.round(systemKw * 55);
    const evKms = Math.round(systemKw * 8500);

    return {
      bill: num,
      systemKw,
      subsidy,
      monthlySavings,
      yearlySavings,
      fiveYearSavings,
      savings25Years,
      roofArea,
      co2Kg,
      trees,
      evKms
    };
  }

  function updateSolarCalculatorResults(bill) {
    const scData = document.getElementById('mobile-sc-data');
    if (!scData) return;

    const m = computeSolarMetrics(bill);

    const firstLoader = document.querySelector('.first-sc-loader');
    const skelLoader = document.getElementById('mobile-skeleton-loader');
    if (firstLoader) firstLoader.style.display = 'none';
    if (skelLoader) skelLoader.style.display = 'none';
    scData.style.display = 'block';

    const brandTitle = scData.querySelector('.savings-title');
    if (brandTitle && /solarsquare/i.test(brandTitle.textContent)) {
      brandTitle.textContent = 'Your savings with Shree Rudra Power Systems';
    }

    const sizeEl = scData.querySelector('.calc-left-bottom .value');
    if (sizeEl) sizeEl.textContent = String(m.systemKw);

    const roofEl = scData.querySelector('.calc-right-bottom .value');
    if (roofEl) roofEl.textContent = String(m.roofArea);

    const savingsValues = scData.querySelectorAll('.savings-monthly-yearly .value');
    if (savingsValues[0]) savingsValues[0].textContent = `₹${m.monthlySavings.toLocaleString('en-IN')}`;
    if (savingsValues[1]) savingsValues[1].textContent = `₹${m.yearlySavings.toLocaleString('en-IN')}`;
    if (savingsValues[2]) savingsValues[2].textContent = `₹${m.savings25Years.toLocaleString('en-IN')}`;

    const fiveYrEl = scData.querySelector('.savings-gz .savings-amt');
    if (fiveYrEl) fiveYrEl.textContent = `₹${m.fiveYearSavings.toLocaleString('en-IN')}`;

    const usageDescs = scData.querySelectorAll('.solar-usage .solar-usage-desc');
    if (usageDescs[0]) usageDescs[0].textContent = `${m.co2Kg.toLocaleString('en-IN')} Kg`;
    if (usageDescs[1]) usageDescs[1].textContent = `${m.trees.toLocaleString('en-IN')}`;
    if (usageDescs[2]) usageDescs[2].textContent = `${m.evKms.toLocaleString('en-IN')} Kms`;
  }

  function upgradeLegacyMeowSlider() {
    const meow = document.getElementById('slider-meow');
    if (!meow || document.getElementById('sr-slider-track')) return;

    if (window.jQuery && window.jQuery.fn && window.jQuery.fn.slider) {
      try {
        if (window.jQuery(meow).hasClass('ui-slider')) {
          window.jQuery(meow).slider('destroy');
        }
      } catch (e) {}
    }

    meow.classList.remove(
      'ui-slider',
      'ui-slider-horizontal',
      'ui-slider-disabled',
      'ui-state-disabled',
      'ui-corner-all',
      'ui-widget',
      'ui-widget-content'
    );
    meow.style.cssText = 'position:relative; width:100%; height:16px; background:transparent; border:none; padding:0; margin:14px 0 10px 0; opacity:1; pointer-events:auto;';

    meow.innerHTML = `
      <div id="sr-slider-track" style="position:relative; width:100%; height:16px; background:#d1fae5; border-radius:8px; cursor:pointer; user-select:none; touch-action:none; pointer-events:auto;">
        <div id="sr-slider-fill" style="position:absolute; top:0; left:0; height:100%; width:31.57%; background:#10b981; border-radius:8px; pointer-events:none;"></div>
        <div id="sr-slider-handle" role="slider" aria-label="Monthly Electricity Bill" aria-valuemin="500" aria-valuemax="10000" aria-valuenow="3500" tabindex="0" style="position:absolute; top:50%; left:31.57%; transform:translate(-50%, -50%); width:36px; height:36px; background:#ffffff; border:1.5px solid #cbd5e1; border-radius:10px; box-shadow:0 3px 8px rgba(0,0,0,0.18); cursor:grab; display:flex; align-items:center; justify-content:center; gap:3px; z-index:20; touch-action:none; user-select:none; pointer-events:auto;">
          <span style="width:2.5px; height:15px; background:#94a3b8; border-radius:2px; display:inline-block; pointer-events:none;"></span>
          <span style="width:2.5px; height:15px; background:#94a3b8; border-radius:2px; display:inline-block; pointer-events:none;"></span>
        </div>
      </div>
    `;

    if (!document.getElementById('display-amount')) {
      const tooltipRow = document.querySelector('.silder-form .slider-tooltip');
      if (tooltipRow) {
        tooltipRow.style.display = 'flex';
        tooltipRow.style.alignItems = 'center';
        tooltipRow.style.gap = '8px';
        const pill = document.createElement('span');
        pill.id = 'display-amount';
        pill.className = 'selected-bill-amount slider-value-box';
        pill.style.cssText = 'margin-left:auto; font-size:18px; font-weight:800; color:#0284c7; background:#e0f2fe; padding:3px 12px; border-radius:8px; display:inline-block; opacity:1;';
        pill.textContent = '₹3,500';
        tooltipRow.appendChild(pill);
      }
    }
  }

  function setupBillSlider() {
    upgradeLegacyMeowSlider();

    const track = document.getElementById('sr-slider-track');
    const handle = document.getElementById('sr-slider-handle');
    const fill = document.getElementById('sr-slider-fill');
    const displayAmount = document.getElementById('display-amount');
    const amountInput = document.getElementById('amount');
    const calcBtn = document.getElementById('calculate-now-calc');
    const rangeInput = document.getElementById('sr-bill-range');

    if (!window.currentElectricityBill || window.currentElectricityBill < 500) {
      window.currentElectricityBill = 3500;
    }

    function applySliderValue(val, updateUI = true) {
      const num = Math.min(10000, Math.max(500, Math.round(Number(val) / 100) * 100));
      window.currentElectricityBill = num;

      if (amountInput) amountInput.value = num;
      if (rangeInput) rangeInput.value = num;

      const formatted = `₹${num.toLocaleString('en-IN')}`;
      if (displayAmount) {
        displayAmount.innerText = formatted;
        displayAmount.style.opacity = '1';
      }

      const valBoxes = document.querySelectorAll('.slider-value-box');
      valBoxes.forEach(box => {
        box.innerText = formatted;
        box.style.opacity = '1';
      });

      if (updateUI && track) {
        const pct = Math.max(0, Math.min(1, (num - 500) / (10000 - 500)));
        const pctStr = (pct * 100).toFixed(2) + '%';
        if (fill) fill.style.width = pctStr;
        if (handle) {
          handle.style.left = pctStr;
          handle.setAttribute('aria-valuenow', String(num));
        }
      }

      if (calcBtn) {
        calcBtn.removeAttribute('disabled');
        calcBtn.style.opacity = '1';
        calcBtn.style.cursor = 'pointer';
        calcBtn.style.pointerEvents = 'auto';
      }

      updateSolarCalculatorResults(num);
    }

    if (track && handle) {
      if (track.dataset.srBound !== '1') {
        track.dataset.srBound = '1';
        let isDragging = false;

        function handleDrag(clientX) {
          const rect = track.getBoundingClientRect();
          if (rect.width <= 0) return;
          const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
          const val = 500 + ratio * (10000 - 500);
          applySliderValue(val, true);
        }

        function startDrag(clientX, targetEl, pointerId) {
          isDragging = true;
          handle.style.cursor = 'grabbing';
          document.body.style.userSelect = 'none';
          if (typeof clientX === 'number') handleDrag(clientX);
          if (targetEl && pointerId !== undefined && targetEl.setPointerCapture) {
            try { targetEl.setPointerCapture(pointerId); } catch (e) {}
          }
        }

        function endDrag() {
          if (!isDragging) return;
          isDragging = false;
          handle.style.cursor = 'grab';
          document.body.style.userSelect = '';
        }

        if (window.PointerEvent) {
          handle.addEventListener('pointerdown', function(e) {
            e.preventDefault();
            startDrag(e.clientX, handle, e.pointerId);
          });
          track.addEventListener('pointerdown', function(e) {
            e.preventDefault();
            startDrag(e.clientX, track, e.pointerId);
          });
          window.addEventListener('pointermove', function(e) {
            if (!isDragging) return;
            handleDrag(e.clientX);
          });
          window.addEventListener('pointerup', endDrag);
          window.addEventListener('pointercancel', endDrag);
        } else {
          handle.addEventListener('mousedown', function(e) {
            e.preventDefault();
            startDrag(e.clientX);
          });
          track.addEventListener('mousedown', function(e) {
            e.preventDefault();
            startDrag(e.clientX);
          });
          window.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            handleDrag(e.clientX);
          });
          window.addEventListener('mouseup', endDrag);

          handle.addEventListener('touchstart', function(e) {
            if (e.touches && e.touches[0]) startDrag(e.touches[0].clientX);
          }, { passive: true });
          track.addEventListener('touchstart', function(e) {
            if (e.touches && e.touches[0]) startDrag(e.touches[0].clientX);
          }, { passive: true });
          window.addEventListener('touchmove', function(e) {
            if (!isDragging) return;
            if (e.touches && e.touches[0]) handleDrag(e.touches[0].clientX);
          }, { passive: true });
          window.addEventListener('touchend', endDrag);
        }

        handle.addEventListener('keydown', function(e) {
          const cur = window.currentElectricityBill || 3500;
          if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
            e.preventDefault();
            applySliderValue(cur + 100, true);
          } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
            e.preventDefault();
            applySliderValue(cur - 100, true);
          } else if (e.key === 'Home') {
            e.preventDefault();
            applySliderValue(500, true);
          } else if (e.key === 'End') {
            e.preventDefault();
            applySliderValue(10000, true);
          }
        });
      }

      applySliderValue(window.currentElectricityBill || 3500, true);
    } else if (rangeInput) {
      if (rangeInput.dataset.srBound !== '1') {
        rangeInput.dataset.srBound = '1';
        rangeInput.addEventListener('input', function() {
          applySliderValue(this.value, false);
        });
        rangeInput.addEventListener('change', function() {
          applySliderValue(this.value, false);
        });
      }
      applySliderValue(rangeInput.value || window.currentElectricityBill || 3500, false);
    }
  }

  // Re-reconcile slider after deferred legacy scripts (cfb1f.js / script5152.js) finish
  window.addEventListener('load', function() {
    setTimeout(setupBillSlider, 150);
    setTimeout(setupBillSlider, 600);
  });

  // 6. Bind Solar Calculator Submission
  function bindSolarCalculator() {
    const calcBtn = document.getElementById('calculate-now-calc');
    const calcForm = document.getElementById('scalcPageFormComp');

    if (calcBtn) {
      calcBtn.removeAttribute('disabled');
      calcBtn.style.opacity = '1';
      calcBtn.style.cursor = 'pointer';
      calcBtn.style.pointerEvents = 'auto';

      calcBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        executeCalculation();
      });
    }

    if (calcForm) {
      calcForm.addEventListener('submit', function(e) {
        e.preventDefault();
        e.stopPropagation();
        executeCalculation();
      });
    }
  }

  function executeCalculation() {
    const pinInput = document.getElementById('homes_pincode') || document.querySelector('input[name="pin"]');
    const pinVal = pinInput ? pinInput.value.replace(/[^0-9]/g, '').trim() : '';

    if (!pinVal || pinVal.length !== 6) {
      alert('कृपया 6 अंकों का सही पिन कोड दर्ज करें (उदा. 227406 या 302001)\nPlease enter a valid 6-digit Pincode');
      if (pinInput) {
        pinInput.focus();
        pinInput.style.border = '2px solid #ef4444';
      }
      return;
    }

    if (pinInput) {
      pinInput.style.border = '';
    }

    const bill = window.currentElectricityBill || 3500;
    const location = window.currentSolarDistrict || 'Amethi (Sultanpur), Uttar Pradesh';

    const approxMonthlyUnits = Math.round(bill / 8);
    let systemKw = 2;
    if (bill >= 7000) systemKw = 5;
    else if (bill >= 5000) systemKw = 4;
    else if (bill >= 3000) systemKw = 3;
    else if (bill >= 2000) systemKw = 2;
    else systemKw = 1;

    let subsidy = 30000;
    if (systemKw >= 3) subsidy = 78000;
    else if (systemKw === 2) subsidy = 60000;
    else subsidy = 30000;

    const yearlySavings = Math.round(bill * 12 * 0.90);
    const savings25Years = yearlySavings * 25;
    const roofArea = systemKw * 100;

    window.currentSolarReportData = {
      bill,
      pinVal,
      location,
      systemKw,
      approxMonthlyUnits,
      subsidy,
      yearlySavings,
      savings25Years,
      roofArea
    };

    showCalculationResults(window.currentSolarReportData);
  }

  // 7. Rich Solar Results Modal with WhatsApp Integration
  function injectCalculationModal() {
    if (document.getElementById('sr-calc-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'sr-calc-modal';
    modal.style.cssText = 'display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,23,42,0.75); z-index:999999; justify-content:center; align-items:center; padding:16px; backdrop-filter:blur(4px);';

    modal.innerHTML = `
      <div style="background:#ffffff; width:100%; max-width:540px; border-radius:20px; overflow:hidden; box-shadow:0 25px 50px -12px rgba(0,0,0,0.3); font-family:inherit; animation:srModalPop 0.25s ease;">
        <div style="background:linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color:#ffffff; padding:20px 24px; position:relative;">
          <h4 style="margin:0; font-size:20px; font-weight:800; display:flex; align-items:center; gap:8px;">
            ☀️ <span>Shree Rudra Solar Report</span>
          </h4>
          <p style="margin:4px 0 0 0; font-size:13px; opacity:0.9;" id="sr-modal-location-text">📍 Rooftop Solar Estimate</p>
          <button id="sr-modal-close" style="position:absolute; top:18px; right:20px; background:rgba(255,255,255,0.2); border:none; color:#ffffff; width:32px; height:32px; border-radius:50%; font-size:18px; cursor:pointer; font-weight:bold; display:flex; align-items:center; justify-content:center;">&times;</button>
        </div>

        <div style="padding:24px;">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:18px;">
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:14px; text-align:center;">
              <div style="font-size:12px; color:#64748b; font-weight:600; text-transform:uppercase;">Recommended Solar</div>
              <div style="font-size:24px; font-weight:900; color:#0284c7; margin-top:4px;" id="sr-modal-kw">3 kW</div>
              <div style="font-size:11px; color:#94a3b8;" id="sr-modal-roof">Req. Roof: ~300 sq.ft</div>
            </div>

            <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:12px; padding:14px; text-align:center;">
              <div style="font-size:12px; color:#166534; font-weight:600; text-transform:uppercase;">Govt Subsidy</div>
              <div style="font-size:24px; font-weight:900; color:#16a34a; margin-top:4px;" id="sr-modal-subsidy">₹78,000</div>
              <div style="font-size:11px; color:#15803d; font-weight:700;">PM Surya Ghar Scheme</div>
            </div>
          </div>

          <div style="background:linear-gradient(135deg, #fef3c7 0%, #fef08a 100%); border:1px solid #fde047; border-radius:14px; padding:16px; margin-bottom:20px; text-align:center;">
            <div style="font-size:13px; color:#854d0e; font-weight:700;">Estimated 25-Year Electricity Savings</div>
            <div style="font-size:28px; font-weight:900; color:#a16207; margin-top:2px;" id="sr-modal-savings">₹10,50,000</div>
            <div style="font-size:11.5px; color:#713f12; margin-top:2px;">Cuts your monthly bill by up to 90%</div>
          </div>

          <button id="sr-modal-book-cta" style="width:100%; background:#25D366; color:#ffffff; font-weight:800; font-size:15px; padding:14px; border:none; border-radius:12px; cursor:pointer; box-shadow:0 4px 14px rgba(37,211,102,0.4); display:flex; align-items:center; justify-content:center; gap:10px; transition:all 0.2s ease;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#ffffff"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.112.551 4.095 1.517 5.823l-1.611 5.886 6.046-1.585c1.662.909 3.565 1.428 5.589 1.428 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12zm0 21.818c-1.879 0-3.636-.532-5.127-1.455l-.367-.228-3.585.94.956-3.497-.249-.396c-1.041-1.657-1.628-3.619-1.628-5.726 0-5.414 4.404-9.818 9.818-9.818 5.414 0 9.818 4.404 9.818 9.818 0 5.414-4.404 9.818-9.818 9.818z"/></svg>
            <span>Send Details to WhatsApp (8354822499)</span>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('sr-modal-close').addEventListener('click', () => {
      modal.style.display = 'none';
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });

    document.getElementById('sr-modal-book-cta').addEventListener('click', () => {
      modal.style.display = 'none';
      const d = window.currentSolarReportData || {};
      const pinVal = d.pinVal || window.currentSolarPincode || '227406';
      const location = d.location || window.currentSolarDistrict || 'Amethi (Sultanpur), UP';
      const bill = d.bill || window.currentElectricityBill || 3500;
      const kw = d.systemKw || 3;
      const sub = (d.subsidy || 78000).toLocaleString('en-IN');
      const sav = (d.savings25Years || 1050000).toLocaleString('en-IN');

      try {
        fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pincode: pinVal,
            city: location,
            monthlyBill: '₹' + bill,
            recommendedKw: kw,
            subsidy: '₹' + sub,
            source: 'Solar Calculator'
          })
        });
      } catch (err) {}

      const text = 
`☀️ *Solar Rooftop Calculator Inquiry*
🏢 *Company:* Shree Rudra Power Systems
━━━━━━━━━━━━━━━━━━
📍 *Location:* ${location} (PIN: ${pinVal})
⚡ *Monthly Bill:* ₹${bill}
🔌 *Recommended Solar:* ${kw} kW System
💰 *PM Surya Ghar Subsidy:* ₹${sub}
📈 *25-Year Estimated Savings:* ₹${sav}
━━━━━━━━━━━━━━━━━━
Hello Shree Rudra Power Systems, I checked my solar savings and want to book a Free Site Survey and Solar Consultation.`;

      const waUrl = `https://wa.me/${TARGET_WHATSAPP}?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank');
    });
  }

  function showCalculationResults(data) {
    const modal = document.getElementById('sr-calc-modal');
    if (!modal) return;

    document.getElementById('sr-modal-location-text').innerText = `📍 Pincode: ${data.pinVal} (${data.location})`;
    document.getElementById('sr-modal-kw').innerText = `${data.systemKw} kW System`;
    document.getElementById('sr-modal-roof').innerText = `Req. Roof: ~${data.roofArea} sq.ft`;
    document.getElementById('sr-modal-subsidy').innerText = `₹${data.subsidy.toLocaleString('en-IN')}`;
    document.getElementById('sr-modal-savings').innerText = `₹${data.savings25Years.toLocaleString('en-IN')}`;

    modal.style.display = 'flex';
  }

  // 8. Bind ALL Consultation and Lead forms to WhatsApp
  function bindAllFormsToWhatsApp() {
    const forms = document.querySelectorAll('form#leadForm, form.leadForm, form.book-consultation-form, form[action*="lead"], form.consultation-form, form.contact-form');
    
    forms.forEach(form => {
      form.addEventListener('submit', async function(e) {
        e.preventDefault();
        e.stopPropagation();

        const nameInput = form.querySelector('input[name="full_name"], input[name="name"], input#full_name');
        const phoneInput = form.querySelector('input[name="whatsapp_number"], input[name="phone"], input[name="mobile"], input#whatsapp_number');
        const pinInput = form.querySelector('input[name="pincode"], input[name="pin"], input#pincode');
        const billInput = form.querySelector('input[name="monthly_bill"], input#monthly_bill, select[name="bill"]');
        const msgInput = form.querySelector('textarea, input[name="message"]');

        const name = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'Solar Customer';
        const phone = phoneInput ? phoneInput.value.trim() : '';
        const pincode = pinInput && pinInput.value.trim() ? pinInput.value.trim() : (window.currentSolarPincode || '227406');
        const bill = billInput && billInput.value.trim() ? billInput.value.trim() : (window.currentElectricityBill ? `₹${window.currentElectricityBill}` : '₹3500+');
        const location = window.currentSolarDistrict || 'Indira Nagar, Lucknow / UP';
        const msg = msgInput ? msgInput.value.trim() : '';

        if (!phone || phone.length < 10) {
          alert('कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें (Please enter a valid 10-digit mobile number)');
          if (phoneInput) phoneInput.focus();
          return;
        }

        try {
          fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name,
              phone,
              pincode,
              city: location,
              monthlyBill: bill,
              message: msg,
              source: 'Website Form'
            })
          });
        } catch (err) {}

        let waText = 
`☀️ *New Solar Rooftop Inquiry*
🏢 *To:* Shree Rudra Power Systems
━━━━━━━━━━━━━━━━━━
👤 *Customer Name:* ${name}
📱 *WhatsApp Number:* ${phone}
📍 *Pincode / Area:* ${pincode} (${location})
⚡ *Monthly Electricity Bill:* ${bill}`;

        if (msg) {
          waText += `\n📝 *Inquiry Details:* ${msg}`;
        }
        waText += `\n━━━━━━━━━━━━━━━━━━\nHello Shree Rudra Power Systems, I would like to get a free solar quotation and site survey. Please contact me.`;

        const waUrl = `https://wa.me/${TARGET_WHATSAPP}?text=${encodeURIComponent(waText)}`;
        window.open(waUrl, '_blank');

        alert('धन्यवाद! आपकी इन्क्वायरी सफलतापूर्वक दर्ज हो गई है और व्हाट्सऐप पर भेज दी गई है।\n(Thank you! Your details have been forwarded to Shree Rudra Power Systems on WhatsApp.)');
        form.reset();

        const closeBtn = form.closest('.modal')?.querySelector('[data-bs-dismiss="modal"]') || 
                         form.closest('.modal')?.querySelector('.btn-close');
        if (closeBtn) closeBtn.click();
      });
    });
  }

  // 9. Floating WhatsApp Widget (Bottom-right)
  function injectFloatingWhatsAppWidget() {
    if (document.getElementById('sr-floating-whatsapp')) return;

    const wa = document.createElement('a');
    wa.id = 'sr-floating-whatsapp';
    wa.href = `https://wa.me/${TARGET_WHATSAPP}?text=${encodeURIComponent('Hello Shree Rudra Power Systems, I am interested in Rooftop Solar. Please share quotation details.')}`;
    wa.target = '_blank';
    wa.rel = 'noopener noreferrer';
    wa.title = 'Chat with Shree Rudra Power Systems on WhatsApp (8354822499)';
    wa.style.cssText = 'position:fixed; bottom:24px; right:24px; width:58px; height:58px; background:#25D366; border-radius:50%; box-shadow:0 4px 16px rgba(37,211,102,0.45); display:flex; align-items:center; justify-content:center; z-index:999999; text-decoration:none; transition:transform 0.2s ease, box-shadow 0.2s ease; cursor:pointer;';

    wa.innerHTML = `
      <svg width="34" height="34" viewBox="0 0 24 24" fill="#ffffff">
        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.112.551 4.095 1.517 5.823l-1.611 5.886 6.046-1.585c1.662.909 3.565 1.428 5.589 1.428 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12zm0 21.818c-1.879 0-3.636-.532-5.127-1.455l-.367-.228-3.585.94.956-3.497-.249-.396c-1.041-1.657-1.628-3.619-1.628-5.726 0-5.414 4.404-9.818 9.818-9.818 5.414 0 9.818 4.404 9.818 9.818 0 5.414-4.404 9.818-9.818 9.818z"/>
      </svg>
    `;

    wa.addEventListener('mouseenter', () => {
      wa.style.transform = 'scale(1.1)';
      wa.style.boxShadow = '0 6px 22px rgba(37,211,102,0.6)';
    });

    wa.addEventListener('mouseleave', () => {
      wa.style.transform = 'scale(1)';
      wa.style.boxShadow = '0 4px 16px rgba(37,211,102,0.45)';
    });

    document.body.appendChild(wa);
  }

})();
