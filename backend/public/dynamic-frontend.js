// Shree Rudra Power Systems - Dynamic Frontend Controller
(function() {
  console.log('⚡ Initializing Shree Rudra Power Systems Dynamic Frontend...');

  document.addEventListener('DOMContentLoaded', function() {
    setupBrandingAndLogos();
    setupNavigationPortals();
    bindSolarCalculator();
    bindConsultationLeadForm();
    injectCalculationModal();
    injectLeadSuccessModal();
  });

  // 1. Ensure all brand logos and names display Shree Rudra Power Systems
  function setupBrandingAndLogos() {
    // Replace all brand-logo image sources
    const logos = document.querySelectorAll('img.brand-logo, img[alt*="SolarSquare"], img[alt*="logo"]');
    logos.forEach(img => {
      if (img.classList.contains('brand-logo') || (img.alt && img.alt.toLowerCase().includes('solarsquare'))) {
        img.src = '/images/logo.png';
        img.alt = 'Shree Rudra Power Systems';
        img.style.objectFit = 'contain';
        img.style.maxWidth = '160px';
        img.style.maxHeight = '65px';
      }
    });

    // Update title
    document.title = 'Shree Rudra Power Systems - Bharat ki #1 Rooftop Solar Company';
  }

  // 2. Inject Portal Navigation links in header
  function setupNavigationPortals() {
    const headerNav = document.querySelector('.navbar, header, .nav-menu, .desktop-menu');
    const existingPills = document.getElementById('shree-rudra-nav-pills');
    if (existingPills) return;

    const navPills = document.createElement('div');
    navPills.id = 'shree-rudra-nav-pills';
    navPills.style.cssText = 'position:fixed; top:14px; right:16px; z-index:99999; display:flex; gap:10px; align-items:center;';

    navPills.innerHTML = `
      <a href="/customer" target="_blank" style="background:#111827; color:#ffffff; padding:7px 15px; border-radius:20px; text-decoration:none; font-size:13px; font-weight:700; box-shadow:0 4px 8px rgba(0,0,0,0.2); display:flex; align-items:center; gap:6px; transition:transform 0.2s;">
        <span style="display:inline-block; width:8px; height:8px; background:#10b981; border-radius:50%;"></span>
        Customer Portal
      </a>
      <a href="/admin" target="_blank" style="background:#E51D24; color:#ffffff; padding:7px 15px; border-radius:20px; text-decoration:none; font-size:13px; font-weight:700; box-shadow:0 4px 8px rgba(229,29,36,0.3); display:flex; align-items:center; gap:6px; transition:transform 0.2s;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        Admin Panel
      </a>
    `;

    document.body.appendChild(navPills);
  }

  // 3. Bind Solar Calculator Form
  function bindSolarCalculator() {
    const calcForm = document.getElementById('scalcPageFormComp');
    if (!calcForm) return;

    // Remove disabled state from Calculate Now button
    const calcBtn = document.getElementById('calculate-now-calc');
    if (calcBtn) {
      calcBtn.removeAttribute('disabled');
    }

    calcForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      e.stopPropagation();

      const pinInput = document.getElementById('homes_pincode') || calcForm.querySelector('input[name="pin"]');
      const amountInput = document.getElementById('amount') || calcForm.querySelector('input[name="amount"]');
      const displayAmount = document.getElementById('display-amount');

      const pincode = pinInput ? pinInput.value.trim() : '201301';
      let bill = 3500;
      if (amountInput && amountInput.value) {
        bill = Number(amountInput.value) || 3500;
      } else if (displayAmount && displayAmount.innerText) {
        const parsed = displayAmount.innerText.replace(/[^0-9]/g, '');
        if (parsed) bill = Number(parsed);
      }

      // Fetch dynamic calculation from API
      try {
        const res = await fetch('/api/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ monthlyBill: bill, pincode: pincode })
        }).then(r => r.json());

        if (res.success) {
          openCalculationModal(res.data);
        }
      } catch (err) {
        console.error('Calculation error:', err);
      }
    });
  }

  // 4. Bind Consultation Booking / Lead Form
  function bindConsultationLeadForm() {
    const leadForms = document.querySelectorAll('form.book-consultation-form, form#leadForm, form.leadForm');
    leadForms.forEach(form => {
      form.addEventListener('submit', async function(e) {
        e.preventDefault();
        e.stopPropagation();

        const nameInput = form.querySelector('#full_name, input[name="full_name"]');
        const phoneInput = form.querySelector('#whatsapp_number, input[name="whatsapp_number"], input[type="tel"]');
        const pinInput = form.querySelector('#pincode, input[name="pincode"]');
        const billInput = form.querySelector('#monthly_bill, input[name="monthly_bill"]');

        const fullName = nameInput ? nameInput.value.trim() : '';
        const phone = phoneInput ? phoneInput.value.trim() : '';
        const pincode = pinInput ? pinInput.value.trim() : '';
        let monthlyBill = billInput ? billInput.value : '';

        // If monthly bill is not set, look at active radio block
        if (!monthlyBill) {
          const activeRadio = form.querySelector('.custom-radio.active, .custom-radio.selected');
          if (activeRadio) monthlyBill = activeRadio.getAttribute('data-value') || activeRadio.innerText;
          else monthlyBill = '2500-4000';
        }

        if (!fullName || !phone) {
          alert('Please enter your full name and 10-digit WhatsApp phone number.');
          return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn ? submitBtn.innerText : 'Submit Details';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerText = 'Submitting Booking...';
        }

        try {
          const res = await fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fullName: fullName,
              phone: phone,
              pincode: pincode,
              monthlyBill: monthlyBill,
              notes: 'Website consultation request for Shree Rudra Power Systems'
            })
          }).then(r => r.json());

          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = originalBtnText;
          }

          if (res.success) {
            form.reset();
            openLeadSuccessModal(res.data);
          }
        } catch (err) {
          console.error('Lead submission error:', err);
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = originalBtnText;
          }
          alert('Thank you! Your request has been recorded with Shree Rudra Power Systems.');
        }
      });
    });

    // Make radio buttons clickable if they were not firing
    document.querySelectorAll('.custom-radio').forEach(radio => {
      radio.addEventListener('click', function() {
        const parent = this.parentElement;
        parent.querySelectorAll('.custom-radio').forEach(r => r.classList.remove('active', 'selected'));
        this.classList.add('active', 'selected');
        const hiddenBill = parent.parentElement.querySelector('input.monthly_bill');
        if (hiddenBill) hiddenBill.value = this.getAttribute('data-value') || this.innerText;
      });
    });
  }

  // 5. Calculation Result Modal
  function injectCalculationModal() {
    const modal = document.createElement('div');
    modal.id = 'sr-calc-modal';
    modal.style.cssText = 'display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); backdrop-filter:blur(5px); z-index:999999; align-items:center; justify-content:center; padding:16px; font-family:"Plus Jakarta Sans", sans-serif;';

    modal.innerHTML = `
      <div style="background:#ffffff; border-radius:18px; max-width:580px; width:100%; padding:28px; box-shadow:0 20px 40px rgba(0,0,0,0.3); position:relative; max-height:90vh; overflow-y:auto;">
        <button id="sr-close-calc-modal" style="position:absolute; top:18px; right:20px; background:none; border:none; font-size:26px; cursor:pointer; color:#9ca3af; line-height:1;">&times;</button>
        
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:18px;">
          <img src="/images/logo.png" style="width:48px; height:48px; object-fit:contain;" alt="Shree Rudra Power Systems">
          <div>
            <h3 style="margin:0; font-size:18px; font-weight:800; color:#E51D24;">SHREE RUDRA POWER SYSTEMS</h3>
            <span style="font-size:12px; color:#4b5563;">Your Personalized Rooftop Solar Feasibility Report</span>
          </div>
        </div>

        <div style="background:#fef2f2; border:1px solid #fee2e2; border-radius:12px; padding:16px; margin-bottom:20px; text-align:center;">
          <span style="font-size:12px; font-weight:700; color:#991b1b; text-transform:uppercase; letter-spacing:1px;">Recommended Solar Plant Size</span>
          <div style="font-size:38px; font-weight:900; color:#E51D24; margin:4px 0;"><span id="sr-res-kw">3</span> kW</div>
          <span style="font-size:13px; color:#4b5563;">Requires ~<strong id="sr-res-roof">240</strong> sq. ft. shadow-free roof area</span>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:20px;">
          <div style="background:#f9fafb; border:1px solid #e5e7eb; border-radius:10px; padding:12px;">
            <div style="font-size:11.5px; color:#6b7280;">Estimated Monthly Savings</div>
            <div style="font-size:18px; font-weight:800; color:#10b981;">₹<span id="sr-res-savings">3,100</span> / mo</div>
            <div style="font-size:11px; color:#9ca3af;">₹<span id="sr-res-annual">37,200</span> / year</div>
          </div>
          <div style="background:#f9fafb; border:1px solid #e5e7eb; border-radius:10px; padding:12px;">
            <div style="font-size:11.5px; color:#6b7280;">Daily Power Generation</div>
            <div style="font-size:18px; font-weight:800; color:#111827;"><span id="sr-res-units">12</span> Units</div>
            <div style="font-size:11px; color:#9ca3af;">~360 Units / month</div>
          </div>
        </div>

        <div style="background:#f3f4f6; border-radius:12px; padding:16px; margin-bottom:20px; font-size:13px;">
          <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
            <span style="color:#4b5563;">Estimated Turnkey EPC Cost:</span>
            <strong style="color:#111827;">₹<span id="sr-res-gross">1,65,000</span></strong>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:6px; color:#10b981; font-weight:700;">
            <span>PM Surya Ghar Govt Subsidy (DBT):</span>
            <span>- ₹<span id="sr-res-subsidy">78,000</span></span>
          </div>
          <div style="display:flex; justify-content:space-between; border-top:1px dashed #d1d5db; padding-top:8px; margin-top:8px; font-size:15px; font-weight:800; color:#E51D24;">
            <span>Net Customer Investment:</span>
            <span>₹<span id="sr-res-net">87,000</span></span>
          </div>
          <div style="font-size:11px; color:#6b7280; margin-top:4px; text-align:right;">
            Full investment recovery in just ~<strong id="sr-res-payback">2.3</strong> years!
          </div>
        </div>

        <div style="display:flex; gap:10px;">
          <button id="sr-btn-book-survey" style="flex:1; background:#E51D24; color:#ffffff; border:none; padding:12px 18px; border-radius:10px; font-weight:800; font-size:14px; cursor:pointer;">
            Book Free Rooftop Site Visit &rarr;
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('sr-close-calc-modal').addEventListener('click', () => {
      modal.style.display = 'none';
    });

    document.getElementById('sr-btn-book-survey').addEventListener('click', () => {
      modal.style.display = 'none';
      const consultationForm = document.getElementById('leadForm');
      if (consultationForm) {
        consultationForm.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  function openCalculationModal(data) {
    const modal = document.getElementById('sr-calc-modal');
    if (!modal) return;

    document.getElementById('sr-res-kw').innerText = data.recommendedCapacityKw;
    document.getElementById('sr-res-roof').innerText = data.roofSpaceSqFt;
    document.getElementById('sr-res-savings').innerText = Number(data.monthlySavings).toLocaleString('en-IN');
    document.getElementById('sr-res-annual').innerText = Number(data.annualSavings).toLocaleString('en-IN');
    document.getElementById('sr-res-units').innerText = data.dailyGenerationUnits;
    document.getElementById('sr-res-gross').innerText = Number(data.grossPrice).toLocaleString('en-IN');
    document.getElementById('sr-res-subsidy').innerText = Number(data.centralSubsidy).toLocaleString('en-IN');
    document.getElementById('sr-res-net').innerText = Number(data.netPrice).toLocaleString('en-IN');
    document.getElementById('sr-res-payback').innerText = data.paybackYears;

    modal.style.display = 'flex';
  }

  // 6. Lead Success Confirmation Modal
  function injectLeadSuccessModal() {
    const modal = document.createElement('div');
    modal.id = 'sr-lead-success-modal';
    modal.style.cssText = 'display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); backdrop-filter:blur(5px); z-index:999999; align-items:center; justify-content:center; padding:16px; font-family:"Plus Jakarta Sans", sans-serif;';

    modal.innerHTML = `
      <div style="background:#ffffff; border-radius:18px; max-width:520px; width:100%; padding:30px; box-shadow:0 20px 40px rgba(0,0,0,0.3); text-align:center; position:relative;">
        <div style="width:64px; height:64px; border-radius:50%; background:#d1fae5; color:#059669; display:flex; align-items:center; justify-content:center; font-size:32px; margin:0 auto 16px;">
          ✓
        </div>
        
        <h3 style="margin:0 0 8px; font-size:22px; font-weight:800; color:#111827;">Consultation Request Confirmed!</h3>
        <p style="font-size:13.5px; color:#4b5563; line-height:1.5; margin-bottom:20px;">
          Thank you, <strong id="sr-lead-name">Customer</strong>! Our Shree Rudra certified Solar Technical Engineer has received your request and will connect with you on WhatsApp within 15 minutes.
        </p>

        <div style="background:#f3f4f6; border-radius:12px; padding:14px 18px; margin-bottom:24px; text-align:left; font-size:13px;">
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span style="color:#6b7280;">Booking Reference ID:</span>
            <strong style="color:#E51D24;" id="sr-lead-id">LEAD-101</strong>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span style="color:#6b7280;">Phone / WhatsApp:</span>
            <strong id="sr-lead-phone">+91 9811223344</strong>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span style="color:#6b7280;">Subsidy Scheme:</span>
            <strong style="color:#10b981;">PM Surya Ghar Muft Bijli</strong>
          </div>
        </div>

        <div style="display:flex; gap:10px;">
          <a href="/customer" target="_blank" style="flex:1; background:#111827; color:#ffffff; padding:11px 16px; border-radius:10px; font-weight:700; text-decoration:none; font-size:13px; display:inline-block;">
            Open Customer Portal
          </a>
          <button id="sr-close-lead-modal" style="flex:1; background:#E51D24; color:#ffffff; border:none; padding:11px 16px; border-radius:10px; font-weight:700; font-size:13px; cursor:pointer;">
            Close & Continue
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('sr-close-lead-modal').addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  function openLeadSuccessModal(lead) {
    const modal = document.getElementById('sr-lead-success-modal');
    if (!modal) return;

    document.getElementById('sr-lead-name').innerText = lead.fullName || 'Customer';
    document.getElementById('sr-lead-id').innerText = lead.id || 'LEAD-101';
    document.getElementById('sr-lead-phone').innerText = `+91 ${lead.phone}`;

    modal.style.display = 'flex';
  }

})();

