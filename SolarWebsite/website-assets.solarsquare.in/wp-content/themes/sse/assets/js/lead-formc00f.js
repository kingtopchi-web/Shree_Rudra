// Lead form scripts shared by every page that carries the lead form,
// including the "Talk to a Solar Expert" modal (#leadFormModal, rendered by
// templates/form.php from footer.php). Loaded before script.js and home.js,
// which still call the pincode/referrer helpers defined here.

function sseUrlIndicatesAmp(url) {
    if (!url) {
        return false;
    }
    if (url.indexOf('cdn.ampproject.org') !== -1) {
        return true;
    }
    return /(?:\?|&)(?:amp=1|amp)(?:&|$)/i.test(url);
}

function sseReadAmpLandingCookie() {
    if (typeof getCookie === 'function') {
        return getCookie('sse_amp_landing_url') || '';
    }
    try {
        var match = document.cookie.match(/(?:^|; )sse_amp_landing_url=([^;]*)/);
        return match ? decodeURIComponent(match[1]) : '';
    } catch (e) {
        return '';
    }
}

/** Persist AMP landing across multi-page hops (sessionStorage alone is not enough). */
function ssePersistAmpLandingCookie(ampUrl) {
    if (!ampUrl || !sseUrlIndicatesAmp(ampUrl)) {
        return;
    }
    try {
        var secure = location.protocol === 'https:' ? '; Secure' : '';
        // 24 hours — survives AMP → page A → page B → submit in the same browser.
        document.cookie = 'sse_amp_landing_url=' + encodeURIComponent(ampUrl)
            + '; path=/; max-age=' + (24 * 60 * 60)
            + '; SameSite=Lax' + secure;
    } catch (e) {}
}

function sseGetAmpLandingUrl() {
    try {
        var fromSession = sessionStorage.getItem('sse_amp_landing_url') || '';
        if (sseUrlIndicatesAmp(fromSession)) {
            return fromSession;
        }
    } catch (e) {}
    try {
        var fromLocal = localStorage.getItem('sse_amp_landing_url') || '';
        if (sseUrlIndicatesAmp(fromLocal)) {
            return fromLocal;
        }
    } catch (e) {}
    var fromCookie = sseReadAmpLandingCookie();
    return sseUrlIndicatesAmp(fromCookie) ? fromCookie : '';
}

function sseMarkAmpSessionIfNeeded() {
    try {
        var ampUrl = '';
        if (sseUrlIndicatesAmp(window.location.href)) {
            ampUrl = window.location.href;
        } else if (sseUrlIndicatesAmp(document.referrer)) {
            ampUrl = document.referrer;
        } else {
            ampUrl = sseGetAmpLandingUrl();
        }

        if (!ampUrl) {
            return;
        }

        sessionStorage.setItem('sse_amp_session', '1');
        try {
            localStorage.setItem('sse_amp_session', '1');
        } catch (e) {}

        if (!sessionStorage.getItem('sse_amp_landing_url')) {
            sessionStorage.setItem('sse_amp_landing_url', ampUrl);
        }
        try {
            if (!localStorage.getItem('sse_amp_landing_url')) {
                localStorage.setItem('sse_amp_landing_url', ampUrl);
            }
        } catch (e) {}

        // Re-write cookie on every non-AMP hop so later pages / server can still see it.
        if (!sseUrlIndicatesAmp(sseReadAmpLandingCookie())) {
            ssePersistAmpLandingCookie(ampUrl);
        }
    } catch (e) {}
}

function sseIsAmpSessionActive() {
    try {
        if (sessionStorage.getItem('sse_amp_session') === '1') {
            return true;
        }
    } catch (e) {}
    try {
        if (localStorage.getItem('sse_amp_session') === '1') {
            return true;
        }
    } catch (e) {}
    return !!sseGetAmpLandingUrl();
}

/** Prefer AMP landing URL for page_referrer; else external-only referrer. */
function sseResolveLeadReferrer() {
    var ampLanding = sseGetAmpLandingUrl();
    if (ampLanding) {
        return ampLanding;
    }
    return getStoredExternalReferrer();
}

function getStoredExternalReferrer() {
    // Check if we already have a valid external referrer stored
    var stored = sessionStorage.getItem("original_referrer");
    if (stored !== null && stored !== "") {
        return stored;
    }

    var ref = document.referrer || "";
    var currentHost = location.hostname.replace(/^www\./, "");
    var refHost = "";

    if (ref) {
        try {
            refHost = new URL(ref).hostname.replace(/^www\./, "");
        } catch (e) {
            console.error("Error parsing referrer URL:", e);
        }
    }

    // Check if the referrer is from an external domain
    var isExternal = !!ref && !!refHost && refHost !== currentHost;

    if (isExternal) {
        sessionStorage.setItem("original_referrer", ref);
        return ref;
    }
    // Only set if not already set - preserve any previous external referrer
    if (stored === null) {
        sessionStorage.setItem("original_referrer", "");
    }
    return stored || "";
}

// dataLayer event name for a monthly bill range from the lead forms.
function sseBillValueEvent(billRange) {
    return {
        '<1500': 'bill_insufficient',
        '1500-2500': 'bill_low',
        '2500-4000': 'bill_mid',
        '4000-8000': 'bill_high',
        '>8000': 'bill_max'
    }[billRange] || '';
}

function getBillRange(amount) {
    const num = parseFloat(amount);
    if (isNaN(num)) return null;
    if (num < 1500) return { label: "Less than ₹1500", value: "<1500" };
    if (num > 1500 && num < 2500) return { label: "₹1500 - ₹2500", value: "1500-2500" };
    if (num >= 2500 && num < 4000) return { label: "₹2500 – ₹4000", value: "2500-4000" };
    if (num >= 4000 && num < 8000) return { label: "₹4000 – ₹8000", value: "4000-8000" };
    return { label: "More than ₹8000", value: ">8000" };
}

function getServicibiltyType(pincode_status){
    if (['Inactive City','Inactive State'].includes(pincode_status)) {
        return 'Inactive_PIN_Inactive_City';
    } else if (['Inactive Pincode'].includes(pincode_status)) {
        return 'Inactive_PIN_Active_City';
    } else if (
        pincode_status === null ||
        pincode_status === undefined ||
        pincode_status === 'undefined'
    ) {
        return 'Inactive_PIN_Unidentified';
    }
}
async function checkSOEligibility(pincode) {
    if (!pincode || typeof pincode !== 'string' || pincode.length !== 6) return false;
    try {
        const res = await fetch(ajaxObject.ajax_url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                action: 'sse_check_so_eligibility',
                pincode: pincode
            })
        });
        const data = await res.json();
        return !!(data?.success && data.data && data.data.is_so);
    } catch (e) {
        console.error('SO eligibility AJAX error:', e);
        return false;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(function (el) {
            bootstrap.Tooltip.getOrCreateInstance(el);
        });
    }

    // change heading of title using button click
    const triggerButtons = document.querySelectorAll('.btn-open-lead-form');
    const submitButton = document.querySelector('.leadFormSubmitBtn');
    const modalTitle = document.getElementById('leadFormLabel');
    triggerButtons.forEach(button => {
        button.addEventListener('click', function () {
            const newText = this.getAttribute('data-button-text');
            const newTitle = this.textContent.trim();
            if (newText && submitButton) {
                submitButton.textContent = newText;
            }

            if (newTitle && modalTitle) {
                modalTitle.textContent = newTitle;
            }
        });
    });
});

jQuery(document).ready(function ($) {
    sseMarkAmpSessionIfNeeded();
    getStoredExternalReferrer();
});

async function getPincodeStatus(pincode) {
    const response = await fetch(ajaxObject.ajax_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            action: 'sse_get_pincode_status',
            pincode: pincode
        })
    });
    const result = await response.json();
    return result?.success && result.data ? result.data : null;
}

async function fetchPincodeData(pincode) {
    console.log("[fetchPincodeData] called with pincode:", pincode);

    if (pincode.length !== 6) {
        console.log("[fetchPincodeData] invalid pincode length:", pincode.length);
        return { city: '', isInactivePincode: true, pinInDB: false };
    }

    try {
        const result = { data: await getPincodeStatus(pincode) };
        console.log("[fetchPincodeData] getPincodeStatus response:", result.data);

        if (!result.data) {
            console.log("[fetchPincodeData] no data returned for pincode:", pincode);
            return { city: '', pincode_status: '', isInactivePincode: true, pinInDB: false, state: '', cluster: '' };
        }

        let pinInDB = false;
        let isInactivePincode = false;
        let pincode_status = result.data.pincode_status;
        
        if (pincode_status === 'Active') {

            const cityName = result.data.city;
            const city = cityName === 'Aurangabad' ? 'Chhatrapati Sambhajinagar' : cityName || '';
            pinInDB = true;
            console.log("[fetchPincodeData] active pincode:", { pincode, city, state: result.data.state, cluster: result.data.cluster });

            return {
                city,
                pincode_status,
                isInactivePincode: false,
                pinInDB,
                state: result.data.state || '',
                cluster: result.data.cluster || ''
            };
        } 
        
        if (["Inactive State", "Inactive City", "Inactive Pincode"].includes(result.data.pincode_status)) {
            const cityName = result.data.city;
            const city = cityName === 'Aurangabad' ? 'Chhatrapati Sambhajinagar' : cityName;
            console.log("[fetchPincodeData] inactive pincode:", { pincode, pincode_status, city });

            return {
                city,
                pincode_status,
                isInactivePincode: true,
                pinInDB: true,
                state: result.data.state || '',
                cluster: result.data.cluster || ''
            };
        }

        console.log("[fetchPincodeData] unrecognized pincode_status:", pincode_status);
        return { city: '',pincode_status: '', isInactivePincode: true, pinInDB: false, state: '', cluster: '' };

    } catch (error) {
        console.error("Pincode API request failed", error);
        return { city: '', pincode_status: '', isInactivePincode: true, pinInDB: false, state: '', cluster: '' };
    }
}

async function isPinValid(pin) {
    if (!/^[1-9][0-9]{5}$/.test(pin)) return false;

    try {
        const data = await getPincodeStatus(pin);
        return !!data && Object.keys(data).length > 0;
    } catch (error) {
        console.error("Pincode API Error:", error);
        return false;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Prevent duplicate tracking
      let path = window.location.pathname;
     path = path.replace(/^\/(sse-blog|blog)/, '');
     
     const validPaths = [
        '/goodzero',
        '/windpro',
        '/homes',
        '/on-grid-page',
        '/off-grid-page',
        '../../../pages/on-grid-solar-system/index.html',
		'../../../pages/off-grid-solar-system/index.html',
        '../../../news/index.html',
        '/referee-page',
        '../../../referral-login/index.html',
        '../../../referral-thank-you/index.html',
        '../../../referral-page/index.html'
    ];
    const goSolarPaths = ['/go-solar'];
    const btlPaths = ['/btl'];
    const housingPaths = ['/housing-society'];
    const commercialPaths = ['/commercial'];
    const homePaths = ['/', '/home'];
    const blogPaths = ['/blog'];
    const isHome = homePaths.includes(path === '/' ? '/' : path.toLowerCase().replace(/\/$/, ''));
    const isGoSolar = goSolarPaths.includes(path.toLowerCase().replace(/\/$/, ''));
    const isBtl= btlPaths.includes(path.toLowerCase().replace(/\/$/, ''));
    const isHousing = housingPaths.includes(path.toLowerCase().replace(/\/$/, ''));
    const isCommercial = commercialPaths.includes(path.toLowerCase().replace(/\/$/, ''));
    const isReferralLogin = path.toLowerCase().replace(/\/$/, '') === '/referral-login' || path.toLowerCase().replace(/\/$/, '') === '/referral-thank-you';

    const originalPath = window.location.pathname;
    const isBlogPage = originalPath.toLowerCase().startsWith('/blog') || originalPath.toLowerCase().startsWith('/sse-blog');
    const isPmSurya = !!(typeof ajaxObject !== 'undefined' && ajaxObject.is_pm_surya);

    const shouldRunScript = validPaths.some(validPath => path.startsWith(validPath)) || isHome || isGoSolar || isHousing || isCommercial || isBtl || isBlogPage || isPmSurya;
    console.log(shouldRunScript)
    // if (!shouldRunScript) return; // Commented out to allow popup on all pages

    // The lead_session_id cookie is normally set by the PHP `init` hook, but on a
    // page served from W3TC full-page cache PHP never runs, so on the first visit
    // the cookie is missing and the async save would post session_id=null.
    // Fetch it from admin-ajax (never cached) which runs the same id-creation
    // logic as the init hook and sets the cookie, so later server-side reads
    // ($_COOKIE['lead_session_id']) stay consistent.
    let SESSION_ID = getCookie('lead_session_id');
    if (!SESSION_ID) {
        try {
            SESSION_ID = (typeof crypto !== 'undefined' && crypto.randomUUID)
                ? crypto.randomUUID()
                : ('sess_' + Math.random().toString(36).substring(2) + Date.now().toString(36));
            document.cookie = 'lead_session_id=' + SESSION_ID + '; path=/; max-age=86400; SameSite=Lax';
        } catch (e) {}
    }
    let sessionIdPromise = null;
    function ensureSessionId() {
        if (SESSION_ID) return Promise.resolve(SESSION_ID);
        if (!sessionIdPromise) {
            sessionIdPromise = fetch(ajaxObject.ajax_url, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                credentials: "same-origin",
                body: new URLSearchParams({ action: "get_lead_session_id" })
            })
                .then(res => res.json())
                .then(res => {
                    SESSION_ID = (res && res.data && res.data.session_id) || getCookie('lead_session_id') || '';
                    return SESSION_ID;
                })
                .catch(() => SESSION_ID);
        }
        return sessionIdPromise;
    }
    // Kick off early so the cookie is in place before the first save.
    if (!SESSION_ID) ensureSessionId();
    if (isReferralLogin) {
        window.saveProgress = saveProgress;
        return;
    }

        let previousPage = getRouteFromUrl(document.referrer) || '';   
        const page_source = getRouteFromUrl(window.location.href);
        const deviceType = getDeviceType(); 
        const deviceName = getDeviceName();
        const moengagePayload = {
            'page_source': page_source || '',
            'device_type': deviceType || '',
            'device_name': deviceName || '',
            'previous_page_source': previousPage || '',
            "utm_source": getCookie("utm_source") || "",
            "utm_medium": getCookie("utm_medium") || "",
            "utm_campaign": getCookie("utm_campaign") || "",
            "utm_content": getCookie("utm_content") || "",
            "utm_fbclid": getCookie("fbclid") || "",
            "gclid": getCookie("gclid") || "",
            "utm_campaigntype": getCookie("utm_campaigntype") || "",
            "utm_campaign_id": getCookie("utm_campaign_id") || "",
            "utm_keyword": getCookie("utm_keyword") || "",
            "utm_adgroup_id": getCookie("utm_adgroup_id") || "",
            "utm_ad_id": getCookie("utm_ad_id") || "",
            "utm_placement": getCookie("utm_placement") || "",
            "utm_site_source_name": getCookie("utm_site_source_name") || "",
        };
        console.log('page viwed goodzero page',moengagePayload)
        if (!window.__moengagePageViewed) {
            window.__moengagePageViewed = true;
            Moengage.track_event('page_viewed', moengagePayload);
        }
    
        const EVENT_FORM_FIELD = 'form_field_clicked';
        
        
        let storageHousingPrefix = 'lead_housing_';
        if (isGoSolar) {
            storageHousingPrefix = 'lead_housing_go_solar_';
        } else if (isBtl) {
            storageHousingPrefix = 'lead_housing_btlpage_';
        }
        let savedCommercialValue;
        let savedHousingValue;
        
       
        // Track blur on all text/tel inputs
         console.log(isGoSolar, isBlogPage)
        if (isGoSolar || isBlogPage) {
           
        }
        
        ['full_name', 'whatsapp_number', 'pincode','monthly_bill'].forEach(name  => {
            const inputs = document.querySelectorAll(`[name="${name}"]`);
            if (inputs) {
                inputs.forEach(input => {
                    let type = '';
                    const form = input.closest('form');
                    if (!form) return;
                    if (form.classList.contains('leadForm')) type = 'residential';
                    if (form.classList.contains('housing-form-class')) type = 'housing';
                    if (form.classList.contains('commercial-form-class')) type = 'commercial';
                    
                    // Load saved values for residential forms
                    if(type === 'residential'){
                         let storagePrefix = 'lead_';
                        if (isGoSolar) {
                            storagePrefix = 'lead_go_solar_';
                        }
                        let savedValue = localStorage.getItem(`${storagePrefix}${name}`);
                        if (savedValue) {
                            input.value = savedValue;
                            
                            // Handle monthly_bill radio buttons for residential forms
                            if (name === 'monthly_bill') {
                                const radios = form.querySelectorAll('.custom-radio-block .custom-radio');
                                radios.forEach(radio => {
                                    // Remove old active classes first
                                    radio.classList.remove('active');

                                    // Add active class to the matching radio
                                    if (radio.dataset.value === savedValue) {
                                        radio.classList.add('active');

                                        // Also ensure hidden input gets correct value
                                        input.value = savedValue;
                                    }
                                });
                            }
                        }
                    }
                    
                    // Load saved values for housing forms
                    if(type === 'housing'){
                        let storageHousingPrefix = 'lead_housing_';
                        if (isGoSolar) {
                            storageHousingPrefix = 'lead_housing_go_solar_';
                        } else if (isBtl) {
                            storageHousingPrefix = 'lead_housing_btlpage_';
                        }
                        savedHousingValue = localStorage.getItem(`${storageHousingPrefix}${name}`);
                        if (savedHousingValue) {
                            input.value = savedHousingValue;
                        }
                    }
                    
                    // Load saved values for commercial forms
                    if(type === 'commercial'){
                        let storageCommercialPrefix = 'lead_commercial_';
                        if (isGoSolar && type === 'commercial') {
                            storageCommercialPrefix = 'lead_commercial_go_solar_';
                        } else if (isBtl && type === 'commercial') {
                            storageCommercialPrefix = 'lead_commercial_btl_';
                        }
                        savedCommercialValue = localStorage.getItem(`${storageCommercialPrefix}${name}`);
                        if (savedCommercialValue){
                            input.value = savedCommercialValue;
                        }
                    }
                    
                    // Add blur event listeners for all types
                    input.addEventListener('blur', (e) => {
                        if (type === 'residential') {
                            saveProgress(name, e.target.value);
                        }
                         else if(type === 'housing'){
                            saveHousingProgress(name, e.target.value);
                        }
                        else if(type === 'commercial'){
                           saveCommercialProgress(name, e.target.value);
                        }
                        
                        const payload = { ...moengagePayload,  form_field_name: `form_${name}`, form_field_value: e.target.value };
                        // Remove null or empty values from moengagePayload
                        Object.keys(moengagePayload).forEach((key) => {
                            if (moengagePayload[key] == null || moengagePayload[key] === "") {
                                delete moengagePayload[key];
                            }
                        });
                        Moengage.track_event(EVENT_FORM_FIELD, payload);
                    });
                    
                });

            }
           
        });
       
        
        
                
       function attachMoengageClickTracking(selector, fieldName, openLink = false) {
            document.querySelectorAll(selector).forEach(function (el) {
                el.addEventListener('click', function (e) {
                    e.preventDefault();

                    // Create payload
                    const payload = { ...moengagePayload, form_field_name: fieldName };

                    // Remove null or empty values
                    Object.keys(moengagePayload).forEach((key) => {
                        if (moengagePayload[key] == null || moengagePayload[key] === "") {
                            delete moengagePayload[key];
                        }
                    });

                    Moengage.track_event(EVENT_FORM_FIELD, payload);

                    // Open link in new tab if required
                    if (openLink) {
                        window.open(this.getAttribute('href'), '_blank');
                    }
                });
            });
        }

        // Usage
        attachMoengageClickTracking('.tooltip-info', 'form_monthly_bill_i_button');
        attachMoengageClickTracking('.terms-of-use', 'form_terms_of_service', true);
        attachMoengageClickTracking('.privacy-policy', 'form_privacy_policy', true);
        
       
        // Track bill radio option clicks
        document.querySelectorAll('.custom-radio-block .custom-radio').forEach(radio => {
           
            radio.addEventListener('click', (e) => {
                const form = radio.closest('form');
                if (form?.classList.contains('leadForm')) {
                    saveProgress("monthly_bill", e.target.dataset.value);
                }
                const payload = { ...moengagePayload, form_field_name: "form_monthly_bill", form_field_value: e.target.dataset.value };
                // Remove null or empty values from moengagePayload
                Object.keys(moengagePayload).forEach((key) => {
                    if (moengagePayload[key] == null || moengagePayload[key] === "") {
                        delete moengagePayload[key];
                    }
                });
                console.log("[MoEngage Bill Option Click]", payload);
                Moengage.track_event(EVENT_FORM_FIELD, payload);
            });
        });

        if(isHome){
            ['homes_pincode'].forEach(id => {
                const input = document.getElementById(id);
                if (input) {
                    input.addEventListener('blur', () => {
                        const payload = { ...moengagePayload, form_field_name: "form_pincode" };
                        Object.keys(moengagePayload).forEach((key) => {
                                if (moengagePayload[key] == null || moengagePayload[key] === "") {
                                    delete moengagePayload[key];
                                }
                            });
                        console.log(`[MoEngage Field Blur] ${id}`, moengagePayload);
                        Moengage.track_event(EVENT_FORM_FIELD, payload);
                    });
                }
            });

        }
        
        const EVENT_CTA_CLICKED = 'cta_clicked';
 
        document.querySelectorAll('[data-cta]').forEach(button => {
            button.addEventListener('click', () => {
                const ctaName = button.getAttribute('data-cta');
                const faqName = button.getAttribute('data-faq') || '';
                Object.keys(moengagePayload).forEach((key) => {
                        if (moengagePayload[key] == null || moengagePayload[key] === "") {
                            delete moengagePayload[key];
                        }
                    });
              
                const payload = { ...moengagePayload, "CTA Name": ctaName };
                if (faqName) {
                    payload["faq_name"] = faqName; // ✅ add faq_name into the same payload
                }
                console.log(`[MoEngage CTA Clicked] ${ctaName}`, moengagePayload);
                Moengage.track_event(EVENT_CTA_CLICKED, payload);
            });
        });
         document.querySelectorAll('.track-news').forEach(link => {
            link.addEventListener('click', () => {
                const newsTitle = link.getAttribute('data-news-title') || '';
                moengagePayload['CTA Name'] = 'news_article';
                moengagePayload['news_article_name'] = newsTitle;
                console.log(`[MoEngage CTA Clicked] ${moengagePayload['CTA Name']}`, moengagePayload);
                Moengage.track_event('cta_clicked', moengagePayload);
            });
        });
            
    
    const btn = document.getElementById('toggle-read-more-btn');
    const content = document.getElementById('content');

    if (btn && content) {
      btn.addEventListener('click', function () {
        const isVisible = content.style.display === 'block';
        content.style.display = isVisible ? 'none' : 'block';
      });
    }
    
    let city = "";
    let isInactivePincode = false;
    const isNameValid=v=>/^[a-zA-Z\s]{2,}$/.test(v.trim());
    const isPhoneValid = val => (ajaxObject?.wp_env === 'production' ? /^[6-9][0-9]{9}$/ : /^[5-9][0-9]{9}$/).test(val.trim());
    const isPinFormatValid=v=>/^[1-9][0-9]{5}$/.test(v.trim());
    const isCompanyValid=v=>/^([a-zA-Z0-9]|[-/ @\.#&!]){3,}$/.test(v.trim());
    const isSocietyValid=v=>/^([a-zA-Z0-9]|[-/ @\.#&!]){3,}$/.test(v.trim());
    const isBillValid=v=>/^\d+(\.\d{1,2})?$/.test(v.trim());

    document.querySelectorAll('.leadForm').forEach(leadForm => {
        const billInput = leadForm.querySelector('[name="monthly_bill"]');
    
        const billError = leadForm.querySelector('.billError');

        if (!leadForm || !billInput || !billError) return;
       

        // Live field validation
        leadForm.full_name.addEventListener('input', () => {
            const el = leadForm.full_name.parentElement.querySelector('.invalid-feedback');
            el.style.display = isNameValid(leadForm.full_name.value) ? 'none' : 'block';
        });

        leadForm.whatsapp_number.addEventListener('input', () => {
            const el = leadForm.whatsapp_number.parentElement.querySelector('.invalid-feedback');
            el.style.display = isPhoneValid(leadForm.whatsapp_number.value) ? 'none' : 'block';
        });

        leadForm.pincode.addEventListener('input', () => {
            const val = leadForm.pincode.value.trim();
            const group = leadForm.pincode.parentElement;
            group.querySelector('.invalid-format').style.display = isPinFormatValid(val) ? 'none' : 'block';
            group.querySelector('.invalid-api').style.display = 'none'; 
        });

        const customRadios = leadForm.querySelectorAll('.custom-radio');
        if (customRadios.length) {
            // Handle custom radio selection (monthly bill)
            customRadios.forEach(radio => {
                radio.addEventListener('click', function () {
                    customRadios.forEach(r => r.classList.remove('active'));
                    this.classList.add('active');
                    billInput.value = this.getAttribute('data-value');
                    billError.classList.add('d-none');
                });
            });
        }
        let originalCity = "";
        let searchCityName = ""; 
        leadForm.pincode.addEventListener('keyup', async () => {
            const pinVal = leadForm.pincode.value.trim();

            // Only check when 6 digits are entered
            if (pinVal.length === 6) {
                try {
                    // Lighthouse is behind the auth gateway: go through the WP proxy.
                    const response = await fetch(ajaxObject.ajax_url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: new URLSearchParams({ action: 'sse_get_pincode_status', pincode: pinVal })
                    });
                    const result = await response.json();
                    console.log("Pincode API Response:", result);

                    if (result?.success && result?.data && Object.keys(result.data).length > 0) {
                        originalCity = result?.data?.city || result?.data?.cluster;
                        searchCityName = originalCity;
                        console.log("City found:", originalCity);

                    } else if (result?.data?.lookup_ok) {
                        // Lookup succeeded but the pincode is not in the DB (was `data === null`).
                        const invalidMoePayload = {
                            entered_pin: pinVal,
                            page_url: window.location.href,
                        };
                        Moengage.track_event('invalid_pin_entered', invalidMoePayload);
                    }
                } catch (error) {
                    console.error("Pincode API request failed:", error);
                }
            } else {
                document.querySelector(".pincode-view-homes-wrapper")?.classList.remove("pincode-view-homes-wrapper-bg");
                document.getElementById("viewHomesBox")?.classList.add("d-none");
            }
        });
         /* ================================
        STEP SWITCH LOGIC (VAR1 & VAR2)
        ================================= */

        const nextBtn = leadForm.querySelector('.next-step');

        if (nextBtn) {
            console.log('test');

            nextBtn.addEventListener('click', async function (e) {

                    e.preventDefault();
                    console.log('test2')

                    let hasError = false;

                    const billVal = billInput ? billInput.value.trim() : '';
                    const pinVal = leadForm.pincode ? leadForm.pincode.value.trim() : '';
                    const nameVal = leadForm.full_name ? leadForm.full_name.value.trim() : '';
                    const phoneVal = leadForm.whatsapp_number ? leadForm.whatsapp_number.value.trim() : '';
                    const group = leadForm.pincode.parentElement;  

                    const isVar1 = leadForm.classList.contains('variation-var1');
                    const isVar2 = leadForm.classList.contains('variation-var2');

                    /* ========= VAR1 ========= */
                    if (isVar1) {

                        if (!billVal) {
                            if (billError) billError.classList.remove('d-none');
                            hasError = true;
                        } else {
                            if (billError) billError.classList.add('d-none');
                        }

                       if (!isPinFormatValid(pinVal)) {
                            leadForm.pincode.classList.add('is-error');
                            group.querySelector('.invalid-format').style.display = 'block';   // Show: "Enter 6-digit pincode"
                            group.querySelector('.invalid-api').style.display = 'none';
                            hasError = true;
                        } else {
                            const isApiValid = await isPinValid(pinVal);
                            if (!isApiValid) {
                                leadForm.pincode.classList.add('is-error');
                                group.querySelector('.invalid-format').style.display = 'none';
                                group.querySelector('.invalid-api').style.display = 'block'; // Show: "Invalid pincode"
                                hasError = true;
                            } else {
                                leadForm.pincode.classList.remove('is-error');
                                group.querySelector('.invalid-format').style.display = 'none';
                                group.querySelector('.invalid-api').style.display = 'none';
                            }
                        }
                    }

                    /* ========= VAR2 ========= */
                    if (isVar2) {

                        if (!isNameValid(nameVal)) {
                            const err = leadForm.querySelector('[name="full_name"]')
                                .parentElement.querySelector('.invalid-feedback');
                            if (err) err.style.display = 'block';
                            hasError = true;
                        }

                        if (!isPhoneValid(phoneVal)) {
                            const err = leadForm.querySelector('[name="whatsapp_number"]')
                                .parentElement.querySelector('.invalid-feedback');
                            if (err) err.style.display = 'block';
                            hasError = true;
                        }
                    }

                    if (hasError) return;

                    const step1 = leadForm.querySelector('.step-1');
                    const step2 = leadForm.querySelector('.step-2');

                    if (step1 && step2) {
                        step1.classList.add('d-none');
                        step2.classList.remove('d-none');
                    }

                });


        }
     // ===== On Submit =====
      // Covers the window between entering the handler and the button being
      // disabled further down: the pincode format/API checks are awaited first,
      // so a double-tap or a held Enter could otherwise start two flows and post
      // two leads. Per-form, since this runs once per .leadForm.
      let submitting = false;
      const submitBtn = leadForm.querySelector('button[type="submit"]');

      // Restored from bfcache -- the user submitted, got redirected, then came
      // back. Chrome returns the DOM exactly as it left, so the button is still
      // disabled and the flag above still set, leaving the form dead. Reset both.
      window.addEventListener('pageshow', function (e) {
          if (!e.persisted) return;
          submitting = false;
          if (submitBtn) {
              submitBtn.classList.remove('is-loading');
              submitBtn.disabled = false;
          }
      });

      leadForm.addEventListener('submit', async function (e) {

          e.preventDefault();
          if (submitting) return;
          submitting = true;
          let hasError = false;

          const nameVal = leadForm.full_name.value.trim();
          const phoneVal = leadForm.whatsapp_number.value.trim();
          const billVal = billInput.value;
        
          const pinVal = leadForm.pincode.value.trim();
          const group = leadForm.pincode.parentElement;          
          // const policyChecked = policyCheckbox.checked;
          console.log("leadForm::>", billVal);
          
          // Validate fields
          if (!isNameValid(nameVal)) {
              leadForm.full_name.classList.add('is-error');
              leadForm.full_name.parentElement.querySelector('.invalid-feedback').style.display = 'block';
              hasError = true;
          } else {
              leadForm.full_name.classList.remove('is-error');
              leadForm.full_name.parentElement.querySelector('.invalid-feedback').style.display = 'none';
          }

          if (!isPhoneValid(phoneVal)) {
              leadForm.whatsapp_number.classList.add('is-error');
              leadForm.whatsapp_number.parentElement.querySelector('.invalid-feedback').style.display = 'block';
              hasError = true;
          } else {
              leadForm.whatsapp_number.classList.remove('is-error');
              leadForm.whatsapp_number.parentElement.querySelector('.invalid-feedback').style.display = 'none';
          }
          if (!billVal) {
              billError.classList.remove('d-none');
              hasError = true;
          } else {
              billError.classList.add('d-none');
          }
        if (!isPinFormatValid(pinVal)) {
            leadForm.pincode.classList.add('is-error');
            group.querySelector('.invalid-format').style.display = 'block';   // Show: "Enter 6-digit pincode"
            group.querySelector('.invalid-api').style.display = 'none';
            hasError = true;
        } else {
            const isApiValid = await isPinValid(pinVal);
            if (!isApiValid) {
                leadForm.pincode.classList.add('is-error');
                group.querySelector('.invalid-format').style.display = 'none';
                group.querySelector('.invalid-api').style.display = 'block'; // Show: "Invalid pincode"
                hasError = true;
            } else {
                leadForm.pincode.classList.remove('is-error');
                group.querySelector('.invalid-format').style.display = 'none';
                group.querySelector('.invalid-api').style.display = 'none';
            }
        }


          const { city,pincode_status, isInactivePincode ,pinInDB,state,cluster } = await fetchPincodeData(pinVal);
          console.log("billval2::>", billVal);
          let selectedRangeJson;
          let selectedRange = '';
            if (billVal.startsWith("<") || billVal.startsWith(">") || billVal.includes("-")) {
                // It's a range string, return directly
                selectedRangeJson = { label: billVal.replace("&lt;", "<").replace("&gt;", ">"), value: billVal.replace("&lt;", "<").replace("&gt;", ">") };
            } else {
                // It's an actual numeric bill, clean it
                const amountValue = billVal.replace(/[^0-9.-]+/g, "");
                selectedRangeJson = getBillRange(amountValue);
            }
            if (selectedRangeJson && selectedRangeJson.value !== undefined) {
                selectedRange = selectedRangeJson.value;
                console.log("billval3::>", selectedRange);
            }
        //      selectedRange = '1000-1500'; // Default value if not matched
       

          // Validation rejected it, so nothing is in flight -- let the user retry.
          if (hasError) {
              submitting = false;
          }

          if (!hasError) {
              leadForm.reset();
              billInput.value = '';
              document.querySelectorAll('.custom-radio').forEach(function (el) {
                  el.classList.remove('active');
              });
              let pageType = 'Website'; // default
              const pageSlug = ['/homes', '/on-grid-page', '/off-grid-page'];
              let path = window.location.pathname.toLowerCase().replace(/^\/(sse-blog|blog)/, '').replace(/\/$/, '');



               if (path === '/webinar' || path.startsWith('../../../webinar/index.html') || path === '/webinars' || path.startsWith('../../../webinars/index.html')) pageType = 'Website - Webinar';
                else if (isHome) pageType = 'Website - Home';
                else if (isPmSurya) pageType = 'Website - PMSGY';
                else if (isGoSolar) pageType = 'Website - PrimaryCTA';
                else if (isBtl) pageType = 'Website - Mall';
                else if (isHousing) pageType = 'Website - HousingSociety';
                else if (isCommercial) pageType = 'Website- Commercial';
                else if (path === '/homes') pageType = 'Website - Homes';
                else if (path === '/pages/on-grid-solar-system') pageType = 'Website - PrimaryCTA';
                else if (path === '/pages/off-grid-solar-system') pageType = 'Website - PrimaryCTA';
                else if (path === '/hybrid-solar-system') pageType = 'Website - PrimaryCTA';
                else if (path === '/referral-page') pageType = 'Website - Referral';
                else if (path === '/solar-calculator') pageType = 'Website - Solar Calculator';
                else if (path === '/solar-pro') pageType = 'Website - SolarPro';
                else if (path === '../../../contact-us/index.html') pageType = 'Website - Contact Us';
                else if (isBlogPage) pageType = 'Website - Blog';
                else pageType = 'Website';


              const submittedName = path === '/solar-company-in-nagarro' && !/\s+nagarro$/i.test(nameVal)
                  ? `${nameVal} Nagarro`
                  : nameVal;
              const formData = {
                  name: submittedName,
                  whatsapp: phoneVal,
                  monthly_bill: selectedRange,
                  pincode: pinVal,
                  city: city,
                  isInactivePincode: isInactivePincode,
                  utm_source: getCookie("utm_source") || "",
                  utm_medium: getCookie("utm_medium") || "",
                  utm_campaign: getCookie("utm_campaign") || "",
                  utm_content: getCookie("utm_content") || "",
                  utm_terms: getCookie("utm_term") || "",
                  utm_fbclid: getCookie("fbclid") || "",
                  fbBrowserId: getCookie("_fbp") || "",
                  gclid: getCookie("gclid") || "",
                  utm_campaigntype: getCookie("utm_campaigntype") || "",
                  utm_campaign_id: getCookie("utm_campaign_id") || "",
                  utm_keyword: getCookie("utm_keyword") || "",
                  utm_adgroup_id: getCookie("utm_adgroup_id") || "",
                  utm_ad_id: getCookie("utm_ad_id") || "",
                  utm_placement: getCookie("utm_placement") || "",
                  utm_site_source_name: getCookie("utm_site_source_name") || "",
                  source: pageType,
                  utm_url:  window.location.href,
                  referrer: sseResolveLeadReferrer(),
                  amp_session: sseIsAmpSessionActive(),
                  amp_landing_url: sseGetAmpLandingUrl(),
                  is_new_referrer: new URLSearchParams(window.location.search).get('is_new_referrer') || false,

              };

              if (path === '/referee-page') {
                  const phoneHash = new URLSearchParams(window.location.search).get('phone') || '';
                  formData.phone_hash = phoneHash;
              }

              // Spinner stays up through a successful submit: the success path
              // usually redirects, and re-enabling in the gap invites a double
              // send. Only the two failure paths below restore it.
              if (submitBtn) {
                  submitBtn.classList.add('is-loading');
                  submitBtn.disabled = true;
              }

              fetch(ajaxObject.ajax_url, {
                  method: "POST",
                  headers: { "Content-Type": "application/x-www-form-urlencoded" },
                  body: new URLSearchParams({
                      action: "send_to_lsq_handler",
                      leadData: JSON.stringify(formData)
                  })
              })
              .then(res => res.json())
              .then(async data => {
                if (data.success) {
                    let deletePrefix = null;

                    if (isGoSolar) {
                        deletePrefix = 'lead_go_solar_';
                    }

                    if (deletePrefix) {
                        Object.keys(localStorage).forEach(key => {
                            if (key.startsWith(deletePrefix)) {
                                localStorage.removeItem(key);
                            }
                        });
                    }
                    console.log("All lead_* storage cleared");


                   // document.querySelector('.success_message').classList.remove('d-none');
                    const prospectId = data?.data?.prospectId;
                    const opportunityId = data?.data?.opportunityId;
                    const redirectUrl = data?.data?.redirect_url;
                    const lead_serviceable_check = isInactivePincode === false ? true : false;
                    const formFieldMapping = {
                        "/goodzero": "form_submit",
                        "/windpro": "form_submit_success",
                        "/homes": "form_yes_reduce_my_electricity_bill",
                        "/on-grid-page": "form_submit_details",
                        "/off-grid-page": "form_submit_details",
                        "/hybrid-solar-system": "form_submit_details",
                        "/go-solar": "form_submit_details",
                        "/btl": "form_submit_details",
                        "/pages/on-grid-solar-system/": "form_submit_details",
                        "/pages/off-grid-solar-system/": "form_submit_details",
                        "/referral-page": "form_submit_details"
                    };

                    let formFieldName = 'form_submit'; 
                    if (formFieldMapping[path]) {
                        formFieldName = formFieldMapping[path];
                    } else if (/^\/solar-company-in-[a-z-]+\/?$/.test(path)) {
                        // Example: /solar-company-in-mumbai/
                        formFieldName = "form_get_a_free_quote";
                    }
                    const payloadForm = {
                        ...moengagePayload,
                        prospect_id: prospectId,
                        opportunity_id: opportunityId,
                        lead_serviceable_check: lead_serviceable_check,
                        customer_name: nameVal,
                        customer_mobile: phoneVal,
                        monthly_bill: selectedRange || "",
                        pin_code: pinVal,
                        city: originalCity,
                        form_field_name: formFieldName,
                    };
                    if (path !== '/referee-page') {
                        Moengage.track_event('form_field_clicked', payloadForm);
                    }
                    const moengagePayloadNew = {
                        'customer_name':nameVal,
                        'customer_mobile':phoneVal,
                        'monthly_bill':selectedRange,
                        'pin_code':pinVal,
                        'city': originalCity || '',
                        'is_servicable':!isInactivePincode,
                        'is_pin_valid' : pinInDB || false,
                        'url': window.location.href,
                        'device_type': getDeviceType() || '',
                        'device_name': getDeviceName() || '',
                    }
                    const pageReferrer = sessionStorage.getItem('original_referrer') || '';
                    moengagePayloadNew['page_referrer'] = pageReferrer;
                    const serviceability = getServicibiltyType(pincode_status);
                    console.log("serviceability::>", serviceability);
                    if (typeof serviceability !== 'undefined') {
                        moengagePayloadNew['serviceability'] = serviceability;
                    }
                    const isSOEligible = await checkSOEligibility(pinVal);
                    // console.log("isSOEligible::>", isSOEligible);
                    if (isSOEligible) {
                        moengagePayloadNew['is_so'] = isSOEligible;
                    }else{
                        moengagePayloadNew['is_so'] = false;
                    }
                   
                    Moengage.add_unique_user_id(prospectId);
                    Moengage.add_user_attribute("product_type", "residential");
                    Moengage.add_mobile(phoneVal || "");
                    Moengage.add_user_name(nameVal || "");
                    Moengage.add_user_attribute("prospect_id",prospectId || "");
                    Moengage.add_user_attribute("opportunity_id", opportunityId || "");
                    Moengage.add_user_attribute("monthly_bill", selectedRange || "");
                    Moengage.add_user_attribute("pin_code", pinVal || "");
                    Moengage.add_user_attribute("city", originalCity || "");
                    Moengage.add_user_attribute("page_referrer", pageReferrer);
                    var billValueEvent = sseBillValueEvent(selectedRange);
                   
                 
                    let firstName = nameVal.split(" ")[0];
                    // console.log("firstName::>", firstName);
                    
                    Moengage.add_first_name(firstName || "");
                    console.log("LastName::>", nameVal.split(" ").slice(1).join(" ") || "");
                    Moengage.add_last_name(nameVal.split(" ").slice(1).join(" ") || "");
                    if (path === '/referee-page') {
                        const referrerData = window.referrerTrackingData || {};
                        const refereeAddress = [pinVal, originalCity, data?.data?.state].filter(Boolean).join(', ');
                        const refereePayload = {
                            referee_name: nameVal || '',
                            referee_number: phoneVal || '',
                            referee_address: refereeAddress,
                            referee_id: prospectId || '',
                            referrer_name: referrerData.referrer_name || '',
                            referrer_number: referrerData.referrer_number || '',
                            referrer_id: referrerData.referrer_id || '',
                        };
                        Moengage.track_event('referral_form_submit_success', refereePayload);
                        Moengage.add_user_attribute('referrer_name', referrerData.referrer_name || '');
                        Moengage.add_user_attribute('referrer_id', referrerData.referrer_id || '');
                        Moengage.add_user_attribute('referrer_type', 'existing customer');
                        Moengage.add_user_attribute('unique_link_identifier', new URLSearchParams(window.location.search).get('phone') || '');
                        Moengage.add_user_attribute('utm_source', getCookie('utm_source') || '');
                        Moengage.add_user_attribute('utm_medium', getCookie('utm_medium') || '');
                        Moengage.add_user_attribute('utm_campaign', getCookie('utm_campaign') || '');
                        Moengage.add_user_attribute('utm_content', getCookie('utm_content') || '');
                        Moengage.add_user_attribute('utm_fbclid', getCookie('fbclid') || '');
                    } else {
                        console.log("Moengage Payload windpro::>", JSON.stringify(moengagePayloadNew));
                        Moengage.track_event('lead_form_submit_success', moengagePayloadNew);
                    }
                     const engagement = JSON.parse(sessionStorage.getItem('__engagementData')) || {
                            scroll_percent: 0,
                            engagement_time: 0
                        };
                  
                    
                         var leadSubmitPayload = {
                            'event': isInactivePincode ? 'invalid_pincode' : 'lead_form_submit',
                            'leadsUserData': {
                                'phone_number': '+91' + phoneVal,
                            },
                            'bill_value': selectedRange ,
                            'currency':'INR',
                            'scroll_depth': engagement.scroll_percent,
                            'engagement_time': engagement.engagement_time
                        };
                         dataLayer.push(leadSubmitPayload)
                         // See note above — the OTP page replays this payload as otp_verified.
                         sessionStorage.setItem('__leadSubmitPayload', JSON.stringify({
                            leadId:  (redirectUrl || '').match(/[?&]id=([^&]+)/)?.[1] || '',
                            payload: leadSubmitPayload
                        }));
                        dataLayer.push({'event': billValueEvent});
                    
                    
                        // Criteo Tracking
                        window.criteo_q = window.criteo_q || [];
                        let deviceType = /iPad/.test(navigator.userAgent) ? "t" : /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Silk/.test(navigator.userAgent) ? "m" : "d";
                        window.criteo_q.push(
                            { event: "setAccount", account: 117042 },
                            { event: "setEmail", email: '' },
                            { event: "setSiteType", type: deviceType},
                            { event: "trackTransaction",
                                id: "1",
                                item: [
                                {id: "1", price: "1", quantity: "1" }
                                ]
                            }
                        )

                    console.log("Moengage GoodZero you Payload:", moengagePayload);
                    // console.log("Details submitted successfully!");
                    // Submitted, so the spinner has done its job either way.
                    // While a redirect is in flight the button stays disabled --
                    // the page is on its way out and re-enabling in that gap is
                    // just a second lead waiting to happen.
                    if (submitBtn) {
                        submitBtn.classList.remove('is-loading');
                    }
                    if (redirectUrl) {
                        window.location.href = redirectUrl;
                    } else {
                        submitting = false;
                        if (submitBtn) {
                            submitBtn.disabled = false;
                        }
                    }

                } else {
                    submitting = false;
                    if (submitBtn) {
                        submitBtn.classList.remove('is-loading');
                        submitBtn.disabled = false;
                    }
                    const errorBox = leadForm.querySelector(".form-error-message");
                    if (errorBox) {
                        errorBox.textContent = data.data?.message || data.message || "Something went wrong. Please try again later.";
                        errorBox.style.display = "block";
    
                        setTimeout(() => {
                            errorBox.style.display = "none";
                        }, 10000);
                    }
                }
              })
              .catch(err => {
                      console.error("AJAX Error:", err);
                      console.log("An error occurred. Please try again.");
                      submitting = false;
                      if (submitBtn) {
                          submitBtn.classList.remove('is-loading');
                          submitBtn.disabled = false;
                      }
              });
              console.log('Form Submitted. Values:', formData);
          }
      });
     

    });

   
    // Function to save field progress
    async function saveProgress(fieldName, fieldValue) {
        const DB_FIELD_MAP = {
            full_name: "name",
            whatsapp_number: "mob_no",
            pincode: "pin",
            monthly_bill: "bill",
            city: "city",
        };
        let dbFieldName = DB_FIELD_MAP[fieldName] || fieldName;
        let cityValue = "";
        if (fieldName === "city") {
            cityValue = fieldValue;
        }
        if (fieldName === "pincode") {
            const { city } = await fetchPincodeData(fieldValue);
            cityValue = city || "";
        }
         let pageType = 'Website'; // default
        const pageSlug = ['/homes', '/on-grid-page', '/off-grid-page'];
        let path = window.location.pathname.toLowerCase().replace(/^\/(sse-blog|blog)/, '').replace(/\/$/, '');



        if (path === '/webinar' || path.startsWith('../../../webinar/index.html') || path === '/webinars' || path.startsWith('../../../webinars/index.html')) pageType = 'Website - Webinar';
        else if (isHome) pageType = 'Website - Home';
        else if (isPmSurya) pageType = 'Website - PMSGY';
        else if (isGoSolar) pageType = 'Website - PrimaryCTA';
        else if (isBtl) pageType = 'Website - Mall';
        else if (isHousing) pageType = 'Website - HousingSociety';
        else if (isCommercial) pageType = 'Website- Commercial';
        else if (path === '/homes') pageType = 'Website - Homes';
        else if (path === '/pages/on-grid-solar-system') pageType = 'Website - PrimaryCTA';
        else if (path === '/pages/off-grid-solar-system') pageType = 'Website - PrimaryCTA';
        else if (path === '/hybrid-solar-system') pageType = 'Website - PrimaryCTA';
        else if (path === '/referral-page') pageType = 'Website - Referral';
        else if (path === '/solar-calculator') pageType = 'Website - Solar Calculator';
        else if (path === '/solar-pro') pageType = 'Website - SolarPro';
        else if (path === '../../../contact-us/index.html') pageType = 'Website - Contact Us';
        else if (isBlogPage) pageType = 'Website - Blog';
        else pageType = 'Website';
        const utm_params = {
            utm_source: getCookie("utm_source") || "",
            utm_medium: getCookie("utm_medium") || "",
            utm_campaign: getCookie("utm_campaign") || "",
            utm_content: getCookie("utm_content") || "",
            utm_terms: getCookie("utm_term") || "",
            utm_fbclid: getCookie("fbclid") || "",
            fbBrowserId: getCookie("_fbp") || "",
            gclid: getCookie("gclid") || "",
            utm_campaigntype: getCookie("utm_campaigntype") || "",
            utm_campaign_id: getCookie("utm_campaign_id") || "",
            utm_keyword: getCookie("utm_keyword") || "",
            utm_adgroup_id: getCookie("utm_adgroup_id") || "",
            utm_ad_id: getCookie("utm_ad_id") || "",
            utm_placement: getCookie("utm_placement") || "",
            utm_site_source_name: getCookie("utm_site_source_name") || "",
            source: pageType,
            utm_url:  window.location.href,
            referrer: sseResolveLeadReferrer(),
        };
        
        await ensureSessionId();
        let bodyData = {
            action: "save_partial_lead",
            session_id: SESSION_ID,
            field: dbFieldName,
            value: fieldValue,
            utm: JSON.stringify(utm_params)
        };
        if (cityValue) {
            bodyData["city"] = cityValue;
        }
        await fetch(ajaxObject.ajax_url, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(bodyData)
        });
        let storagePrefix = '';
        if (isGoSolar) {
            storagePrefix = 'lead_go_solar_';
        }
        else{
            return;
        }
        // Store locally to repopulate later
        const storageKey = `${storagePrefix}${fieldName}`;

        localStorage.setItem(storageKey, fieldValue);
        if (cityValue) {
            localStorage.setItem(`${storagePrefix}city`, cityValue);
        }
    }
    async function saveHousingProgress(fieldName, fieldValue) {
        const DB_FIELD_MAP = {
            full_name: "name",
            whatsapp_number: "mob_no",
            pincode: "pin",
            monthly_bill: "bill"
        };
        let dbFieldName = DB_FIELD_MAP[fieldName] || fieldName;
        let cityValue = "";
        if (fieldName === "city") {
            cityValue = fieldValue;
        }
        if (fieldName === "pincode") {
            const { city } = await fetchPincodeData(fieldValue);
            cityValue = city || "";
        }
         let pageType = 'Website'; // default
        const pageSlug = ['/homes', '/on-grid-page', '/off-grid-page'];
        let path = window.location.pathname.toLowerCase().replace(/^\/(sse-blog|blog)/, '').replace(/\/$/, '');

        if (isHome) pageType = 'Website - Home';
        else if (isGoSolar) pageType = 'Website - PrimaryCTA';
        else if (isBtl) pageType = 'Website - Mall';
        else if (isHousing) pageType = 'Website - HousingSociety';
        else pageType = 'Website';

        const utm_params = {
            utm_source: getCookie("utm_source") || "",
            utm_medium: getCookie("utm_medium") || "",
            utm_campaign: getCookie("utm_campaign") || "",
            utm_content: getCookie("utm_content") || "",
            utm_terms: getCookie("utm_term") || "",
            utm_fbclid: getCookie("fbclid") || "",
            fbBrowserId: getCookie("_fbp") || "",
            gclid: getCookie("gclid") || "",
            source: pageType,
            utm_url:  window.location.href,
        };

        await ensureSessionId();
        let bodyData = {
            action: "save_partial_housing_soicety",
            session_id: SESSION_ID,
            field: dbFieldName,
            value: fieldValue,
            utm: JSON.stringify(utm_params)
        };
        if (cityValue) {
            bodyData["city"] = cityValue;
        }
        await fetch(ajaxObject.ajax_url, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(bodyData)
        });
        let storagePrefix = '';
        if (isGoSolar) {
            storagePrefix = 'lead_housing_go_solar_';
        } else if (isBtl) {
            storagePrefix = 'lead_housing_btlpage_';
        } else if (isHousing) {
            storagePrefix = 'lead_housing_';
        }
        else{
            return;
        }
        // Store locally to repopulate later
        const storageKey = `${storagePrefix}${fieldName}`;

        
        if (cityValue) {
            localStorage.setItem(`${storagePrefix}city`, cityValue);
        }
        // Store locally to repopulate later
       localStorage.setItem(storageKey, fieldValue);
       
    }
    async function saveCommercialProgress(fieldName, fieldValue) {
        const DB_FIELD_MAP = {
            full_name: "name",
            whatsapp_number: "mob_no",
            pincode: "pin",
            monthly_bill: "bill"
        };
        let dbFieldName = DB_FIELD_MAP[fieldName] || fieldName;
        
       let cityValue = "";
        if (fieldName === "city") {
            cityValue = fieldValue;
        }
        if (fieldName === "pincode") {
            const { city } = await fetchPincodeData(fieldValue);
            cityValue = city || "";
        }
         let pageType = 'Website'; // default
        const pageSlug = ['/homes', '/on-grid-page', '/off-grid-page'];
        let path = window.location.pathname.toLowerCase().replace(/^\/(sse-blog|blog)/, '').replace(/\/$/, '');



        if (isHome) pageType = 'Website - Home';
        else if (isGoSolar) pageType = 'Website - PrimaryCTA';
        else if (isBtl) pageType = 'Website - Mall';
        else if (isCommercial) pageType = 'Website- Commercial';
        else pageType = 'Website';
        const utm_params = {
            utm_source: getCookie("utm_source") || "",
            utm_medium: getCookie("utm_medium") || "",
            utm_campaign: getCookie("utm_campaign") || "",
            utm_content: getCookie("utm_content") || "",
            utm_terms: getCookie("utm_term") || "",
            utm_fbclid: getCookie("fbclid") || "",
            fbBrowserId: getCookie("_fbp") || "",
            gclid: getCookie("gclid") || "",
            source: pageType,
            utm_url:  window.location.href,
        };

        await ensureSessionId();
        let bodyData = {
            action: "save_partial_commercial",
            session_id: SESSION_ID,
            field: dbFieldName,
            value: fieldValue,
            utm: JSON.stringify(utm_params)
        };
         if (cityValue) {
            bodyData["city"] = cityValue;
        }
        await fetch(ajaxObject.ajax_url, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(bodyData)
        });
        let storageCommercialPrefix = '';
        if (isGoSolar) {
            storageCommercialPrefix = 'lead_commercial_go_solar_';
        } else if (isCommercial) {
            storageCommercialPrefix = 'lead_commercial_';
        }
        else if (isBtl) {
            storageCommercialPrefix = 'lead_commercial_btl_';
        }
        else{
            return;
        }
        // Store locally to repopulate later
        const storageKey = `${storageCommercialPrefix}${fieldName}`;

        localStorage.setItem(storageKey, fieldValue);
        if (cityValue) {
            localStorage.setItem(`${storageCommercialPrefix}city`, cityValue);
        }

       
      
    }
  
    // Check if current page matches
    if (isHousing || isGoSolar || isBtl) {
        let storageHousingPrefix = 'lead_housing_';
        if (isGoSolar) {
            storageHousingPrefix = 'lead_housing_go_solar_';
        } else if (isBtl) {
            storageHousingPrefix = 'lead_housing_btlpage_';
        }
        
          // Restore values only inside the housing form. GoSolar renders three
        // forms with the same field names, so global selectors would overwrite
        // the residential and commercial tabs.
        document.querySelectorAll('form.housing-form-class').forEach(housingForm => {
            ['housing_society_name', 'full_name', 'whatsapp_number', 'pincode', 'city'].forEach(name => {
                const savedHousingValue = localStorage.getItem(`${storageHousingPrefix}${name}`);
                const input = housingForm.querySelector(`[name="${name}"]`);

                if (savedHousingValue && input) {
                    input.value = savedHousingValue;
                }
            });

            const savedBill = localStorage.getItem(`${storageHousingPrefix}monthly_bill`);
            if (savedBill) {
                const billInput = housingForm.querySelector('[name="monthly_bill"]');
                const billDisplay = housingForm.querySelector('#monthlyBillDropdownLabel');
                if (billInput) billInput.value = savedBill;
                if (billDisplay) {
                    const billItem = housingForm.querySelector(`.bill-dropdown .dropdown-item[data-value="${savedBill}"]`);
                    if (billItem) billDisplay.textContent = billItem.textContent;
                }
            }

            const savedAgm = localStorage.getItem(`${storageHousingPrefix}agm_approval_status`);
            if (savedAgm) {
                const agmInput = housingForm.querySelector('[name="agm_status"]');
                const agmDisplay = housingForm.querySelector('#agmStatusDropdownLabel');
                if (agmInput) agmInput.value = savedAgm;
                if (agmDisplay) agmDisplay.textContent = savedAgm;
            }

            const savedDesignation = localStorage.getItem(`${storageHousingPrefix}designation`);
            if (savedDesignation) {
                const designationInput = housingForm.querySelector('[name="designation"]');
                if (designationInput) designationInput.value = savedDesignation;

                const designationRadio = housingForm.querySelector(`.designation-options .custom-radio[data-value="${savedDesignation}"]`);
                if (designationRadio) {
                    housingForm.querySelectorAll('.designation-options .custom-radio').forEach(r => r.classList.remove('active'));
                    designationRadio.classList.add('active');
                }
            }
        });
        
        // Track blur on all text/tel inputs
        ['housing_society_name'].forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('blur', (e) => {
                    saveHousingProgress(id, e.target.value);
                    const payload = { ...moengagePayload, form_field_name:`form_${id}` };
                    Moengage.track_event(EVENT_FORM_FIELD, payload);
                });
            }
        });

        document.addEventListener("click", function (e) {
            if (e.target.closest(".agm-dropdown .dropdown-item")) {
                saveHousingProgress("agm_approval_status", e.target.textContent.trim());
                const payload = { ...moengagePayload, form_field_name: "form_agm_approval_status" };
                Moengage.track_event(EVENT_FORM_FIELD, payload);
            }
        });

        // Bill Dropdown
        document.addEventListener("click", function (e) {
            if (e.target.closest(".bill-dropdown .dropdown-item")) {
                 saveHousingProgress("monthly_bill", e.target.getAttribute('data-value'));
                const payload = { ...moengagePayload, form_field_name: "form_monthly_bill", form_field_value: e.target.dataset.value };
                Moengage.track_event(EVENT_FORM_FIELD, payload);
            }
        });
     
        document.querySelectorAll('.designation-options .custom-radio').forEach(radio => {
            radio.addEventListener('click', () => {
                saveHousingProgress("designation", radio.getAttribute('data-value'));
                const payload = { ...moengagePayload, form_field_name: "form_designation", form_field_value: radio.dataset.value };
                Moengage.track_event(EVENT_FORM_FIELD, payload);
            });
        });

        const EVENT_CTA_CLICKED = 'cta_clicked';

        document.querySelectorAll('[data-cta-housing-society]').forEach(button => {
            button.addEventListener('click', () => {
                const ctaName = button.getAttribute('data-cta-housing-society');
                if (ctaName) {
                    moengagePayload['CTA Name'] = ctaName;
                //  const cleaned = cleanPayload(moengagePayload);
                    console.log(`[MoEngage CTA Clicked] ${ctaName}`, moengagePayload);
                    Moengage.track_event(EVENT_CTA_CLICKED, moengagePayload);
                }
            });
        });
         let city = "";
    
        document.querySelectorAll('.housing-form-class').forEach(leadForm => {
            const fullName = leadForm.querySelector('[name="full_name"]');
            const phone = leadForm.querySelector('[name="whatsapp_number"]');
            const pin = leadForm.querySelector('[name="pincode"]');
            const society = leadForm.querySelector('[name="housing_society_name"]');
            const billSelect = leadForm.querySelector('[name="monthly_bill_select"]');
            const billInput = leadForm.querySelector('[name="monthly_bill"]');
            const designationInput = leadForm.querySelector('[name="designation"]');
            const billError = leadForm.querySelector('.billError');
            const designationError = leadForm.querySelector('.designationError');
            const isMobile = window.innerWidth < 768;

           if (!leadForm || !billInput || !billError || !designationError) return;


            // Live field validation
            function addLiveValidation(inputField, validationFn) {
                inputField.addEventListener('input', () => {
                    const feedbackEl = inputField.parentElement.querySelector('.invalid-feedback');
                    if (feedbackEl) {
                        feedbackEl.style.display = validationFn(inputField.value) ? 'none' : 'block';
                    }
                });
            }

            // Attach live validation to fields
            
            if (fullName) addLiveValidation(fullName, isNameValid);
            if (phone) addLiveValidation(phone, isPhoneValid);
            if (society) addLiveValidation(society, isSocietyValid);

            leadForm.pincode.addEventListener('input', () => {
                const val = leadForm.pincode.value.trim();
                const group = leadForm.pincode.parentElement;
                group.querySelector('.invalid-format').style.display = isPinFormatValid(val) ? 'none' : 'block';
                group.querySelector('.invalid-api').style.display = 'none'; 
            });

            document.querySelectorAll('.agm-dropdown.custom-select-dropdown .dropdown-item').forEach(item => {
                item.addEventListener('click', function (e) {
                    e.preventDefault();
                    const selectedLabel = this.textContent;
                    const selectedValue = this.getAttribute('data-value');
                    document.getElementById('agmStatusDropdownLabel').textContent = selectedLabel;
                    document.getElementById('agmStatusValue').value = selectedValue;
                    const feedback = this.closest('.custom-select-dropdown').querySelector('.agmStatusError');
                    feedback?.classList.add('d-none');
                });
            });
            document.querySelectorAll('#monthlyBillDropdown + .dropdown-menu .dropdown-item').forEach(item => {
                item.addEventListener('click', function (e) {
                    e.preventDefault();
                    const selectedLabel = this.textContent;
                    const selectedValue = this.getAttribute('data-value');
                    document.getElementById('monthlyBillDropdownLabel').textContent = selectedLabel;
                    document.getElementById('monthlyBillValue').value = selectedValue;
                    const feedback = document.querySelector('.billError');
                    feedback?.classList.add('d-none');  
                });
            });


            // Handle custom radio selection (monthly bill)
            
            if (isMobile) {
                leadForm.querySelectorAll('.bill-option .custom-radio').forEach(radio => {
                    radio.addEventListener('click', function () {
                        leadForm.querySelectorAll('.bill-option .custom-radio').forEach(r => r.classList.remove('active'));
                        this.classList.add('active');
                        billInput.value = this.getAttribute('data-value');
                        billError.classList.add('d-none');
                    });
                });
            } else {
                if (billSelect) {
                    billSelect.addEventListener('change', function () {
                        if (billSelect.value === '') {
                            billSelect.classList.add('billError');
                            billError && (billError.style.display = 'block');
                        } else {
                            billSelect.classList.remove('billError');
                            billError && (billError.style.display = 'none');
                        }
                    });
                }   
            }


            leadForm.querySelectorAll('.designation-options  .custom-radio').forEach(radio => {
                radio.addEventListener('click', function () {
                    leadForm.querySelectorAll('.designation-options  .custom-radio').forEach(r => r.classList.remove('active'));
                    this.classList.add('active');
                    designationInput.value = this.getAttribute('data-value');
                    designationError.classList.add('d-none');
                });
            });
        // ===== On Submit =====
        leadForm.addEventListener('submit', async function (e) {
            
            e.preventDefault();
            let hasError = false;

            const nameVal = leadForm.full_name.value.trim();
            const phoneVal = leadForm.whatsapp_number.value.trim();
            const designationVal = designationInput.value;
            const society = leadForm.housing_society_name.value.trim();
            const pinVal = leadForm.pincode.value.trim();
            const agmStatus = document.getElementById('agmStatusValue')?.value || '';
            const agmFieldWrapper = document.getElementById('agmStatusValue')?.closest('.custom-select-dropdown');
            const agmFeedback = agmFieldWrapper?.querySelector('.agmStatusError');
            const group = leadForm.pincode.parentElement;
            let billVal = '';
            if (isMobile) {
                billVal = billInput.value;
            } else {
                const desktopBill = leadForm.querySelector('.monthly_bill_select');
                billVal = desktopBill.value;
                }
            
            
            // Validate fields
            if (!isNameValid(nameVal)) {
                leadForm.full_name.classList.add('is-error');
                leadForm.full_name.parentElement.querySelector('.invalid-feedback').style.display = 'block';
                hasError = true;
            } else {
                leadForm.full_name.classList.remove('is-error');
                leadForm.full_name.parentElement.querySelector('.invalid-feedback').style.display = 'none';
            }

            if (!isSocietyValid(society)) {
                leadForm.housing_society_name.classList.add('is-error');
                leadForm.housing_society_name.parentElement.querySelector('.invalid-feedback').style.display = 'block';
                hasError = true;
            } else {
                leadForm.housing_society_name.classList.remove('is-error');
                leadForm.housing_society_name.parentElement.querySelector('.invalid-feedback').style.display = 'none';
            }

            if (!isPhoneValid(phoneVal)) {
                leadForm.whatsapp_number.classList.add('is-error');
                leadForm.whatsapp_number.parentElement.querySelector('.invalid-feedback').style.display = 'block';
                hasError = true;
            } else {
                leadForm.whatsapp_number.classList.remove('is-error');
                leadForm.whatsapp_number.parentElement.querySelector('.invalid-feedback').style.display = 'none';
            }
            if (!billVal) {
                billError.classList.remove('d-none');
                hasError = true;
            } else {
                billError.classList.add('d-none');
            }
            if (!isPinFormatValid(pinVal)) {
                leadForm.pincode.classList.add('is-error');
                group.querySelector('.invalid-format').style.display = 'block';   // Show: "Enter 6-digit pincode"
                group.querySelector('.invalid-api').style.display = 'none';
                hasError = true;
            } else {
                const isApiValid = await isPinValid(pinVal);
                if (!isApiValid) {
                    leadForm.pincode.classList.add('is-error');
                    group.querySelector('.invalid-format').style.display = 'none';
                    group.querySelector('.invalid-api').style.display = 'block'; // Show: "Invalid pincode"
                    hasError = true;
                } else {
                    leadForm.pincode.classList.remove('is-error');
                    group.querySelector('.invalid-format').style.display = 'none';
                    group.querySelector('.invalid-api').style.display = 'none';
                }
            }
            if (!agmStatus) {
                    agmFeedback?.classList.remove('d-none');
                    hasError = true;
                } else {
                    agmFeedback?.classList.add('d-none');
                }
            if (!designationVal) {
                designationError.classList.remove('d-none');
                hasError = true;
            } else {
                designationError.classList.add('d-none');
            }
            const { city, isInactivePincode,pinInDB } = await fetchPincodeData(pinVal);
            if (!hasError) {
                leadForm.reset();
                billInput.value = '';
                document.querySelectorAll('.custom-radio').forEach(function (el) {
                    el.classList.remove('active');
                });
                console.log(agmStatus)
                const formData = {
                    name: nameVal,
                    society_name: society,
                    phone: phoneVal,
                    pincode: pinVal,
                    bill: billVal,
                    agm_approval: agmStatus,
                    designation: designationVal,
                    city: city,
                    isInactivePincode: isInactivePincode,
                    utm_source: getCookie("utm_source") || "",
                    utm_medium: getCookie("utm_medium") || "",
                    utm_campaign: getCookie("utm_campaign") || "",
                    utm_content: getCookie("utm_content") || "",
                    utm_terms: getCookie("utm_term") || "",
                    utm_fbclid: getCookie("fbclid") || "",
                    fbBrowserId: getCookie("_fbp") || "",
                    gclid: getCookie("gclid") || "",
                    utm_url:  window.location.href,
                    sesstion_id: getCookie('lead_session_id')
                };
                fetch(ajaxObject.ajax_url, {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: new URLSearchParams({
                        action: "send_to_housing_society_handler",
                        leadData: JSON.stringify(formData)
                    })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        // Clear housing localStorage based on page
                        let deletePrefix = null;

                        if (isGoSolar) {
                            deletePrefix = 'lead_housing_go_solar_';
                        } else if (isBtl) {
                            deletePrefix = 'lead_housing_btlpage_';
                        } else if (isHousing) {
                            deletePrefix = 'lead_housing_';
                        }

                        if (deletePrefix) {
                            Object.keys(localStorage).forEach(key => {
                                if (key.startsWith(deletePrefix)) {
                                    localStorage.removeItem(key);
                                }
                            });
                            console.log(`All ${deletePrefix}* storage cleared`);
                        }

                        document.querySelector('.success_housing_message').classList.remove('d-none');
                        const prospectId = data?.data?.mysql_response?.prospectId;
                        const opportunityId = data?.data?.mysql_response?.opportunityId;
                        const redirectUrl = data?.data?.mysql_response?.redirect_url;
                        const formFieldMapping = {
                            "/housing-society": "form_submit_details",
                            "/go-solar": "form_submit_details"
                        };

                        let formFieldName = 'form_submit_details'; 
                        if (formFieldMapping[path]) {
                            formFieldName = formFieldMapping[path];
                        } 
                        const payloadForm = {
                            ...moengagePayload,
                            prospect_id: prospectId,
                            opportunity_id: opportunityId,
                            lead_serviceable_check: isInactivePincode,
                            customer_name: nameVal,
                            customer_mobile: phoneVal,
                            housing_society_name: society,
                            designation: designationVal,
                            agm_approval_satus: agmStatus,
                            monthly_bill: billVal || "",
                            pin_code: pinVal,
                            city: city,
                            is_pin_valid: pinInDB || false,
                            form_field_name: formFieldName,
                        };
                        Moengage.track_event('form_field_clicked', payloadForm);
                        const moengagePayloadNew = {
                            'customer_name':nameVal,
                            'customer_mobile':phoneVal,
                            'monthly_bill':billVal,
                            'pin_code':pinVal,
                            'city': city || '',
                            'url': window.location.href,
                            'device_type':  getDeviceType() || '',
                            'device_name': getDeviceName() || '',
                        }
                        const pageReferrer = sessionStorage.getItem('original_referrer') || '';
                        moengagePayloadNew['page_referrer'] = pageReferrer;

                        Moengage.add_unique_user_id(prospectId);
                        Moengage.add_mobile(phoneVal || "");
                        Moengage.add_user_name(nameVal || "");
                        Moengage.add_user_attribute("prospect_id",prospectId || "");
                        Moengage.add_user_attribute("opportunity_id", opportunityId || "");
                        Moengage.add_user_attribute("monthly_bill", billVal || "");
                        Moengage.add_user_attribute("pin_code", pinVal || "");
                        Moengage.add_user_attribute("city", city || "");
                        Moengage.add_user_attribute("page_referrer", pageReferrer);
                        Moengage.add_user_attribute("product_type", "housing_society");
                        Moengage.add_user_attribute("housing_society_name", society || "");

                        let firstName = nameVal.split(" ")[0];
                        console.log("firstName::>", firstName);
                        
                        Moengage.add_first_name(firstName || "");
                        console.log("LastName::>", nameVal.split(" ").slice(1).join(" ") || "");
                        Moengage.add_last_name(nameVal.split(" ").slice(1).join(" ") || "");
                        console.log("Moengage Payload windpro::>", moengagePayloadNew);
                        Moengage.track_event('lead_form_submit_success', moengagePayloadNew);
                        dataLayer.push({
                            'event': 'lead_form_submit_housing_society',
                            'leadsUserData': {
                                'phone_number': '+91' + phoneVal,
                            },
                            'bill_value': billVal,
                            'currency':'INR'
                        })

                        var billValueEvent = sseBillValueEvent(billVal);
                        dataLayer.push({'event': billValueEvent});

                            window.criteo_q = window.criteo_q || [];
                            let deviceType = /iPad/.test(navigator.userAgent) ? "t" : /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Silk/.test(navigator.userAgent) ? "m" : "d";
                            window.criteo_q.push(
                                { event: "setAccount", account: 117042 },
                                { event: "setEmail", email: '' },
                                { event: "setSiteType", type: deviceType},
                                { event: "trackTransaction",
                                    id: "1",
                                    item: [
                                    {id: "1", price: "1", quantity: "1" }
                                    ]
                                }
                            )
                        
                        console.log("Moengage GoodZero you Payload:", moengagePayload);
                        // console.log("Details submitted successfully!");
                        if (redirectUrl) {
                            window.location.href = redirectUrl;
                        }

                    } else {
                        console.log("Submission failed: " + (data.message || "Try again later."));
                    }
                })
                .catch(err => {
                        console.error("AJAX Error:", err);
                        console.log("An error occurred. Please try again.");
                });
                console.log('Form Submitted. Values:', formData);
            }
        });
        });
    }
   console.log(isCommercial, isGoSolar, isBtl)
    if(isCommercial || isGoSolar || isBtl){
        let storageCommercialPrefix = 'lead_commercial_';
        if (isGoSolar) {
            storageCommercialPrefix = 'lead_commercial_go_solar_';
        } 
        else if (isBtl) {
            storageCommercialPrefix = 'lead_commercial_btl_';
        }
      
        document.querySelectorAll('form.commercial-form-class').forEach(commercialForm => {
            ['company_name','city','monthly_bill'].forEach(name  => {
            const inputs = commercialForm.querySelectorAll(`[name="${name}"]`);
            
            // Try to restore saved value if it exists
            savedCommercialValue = localStorage.getItem(`${storageCommercialPrefix}${name}`);
            
            if (savedCommercialValue) {
                inputs.forEach(input => {
                    input.value = savedCommercialValue;
                });
            }
            
            // Always add blur listeners to save future changes
            if (inputs) {
                inputs.forEach(input => {
                    input.addEventListener('blur', () => {
                        const payload = { ...moengagePayload,  form_field_name: `form_${name}` };
                        
                        saveCommercialProgress(name, input.value);
                        
                        // Remove null or empty values from moengagePayload
                        Object.keys(moengagePayload).forEach((key) => {
                            if (moengagePayload[key] == null || moengagePayload[key] === "") {
                                delete moengagePayload[key];
                            }
                        });
                        
                        Moengage.track_event(EVENT_FORM_FIELD, payload);
                    });
                });
            }
            });
        });
        
        document.querySelectorAll('[data-cta-commercial]').forEach(button => {
            button.addEventListener('click', () => {
                const ctaName = button.getAttribute('data-cta-commercial');
                if (ctaName) {
                    const payload = { ...moengagePayload, "CTA Name": ctaName };
                    console.log(`[MoEngage CTA Clicked] ${ctaName}`, payload);
                    Moengage.track_event(EVENT_CTA_CLICKED, payload);
                }
            });
        });
          
        let city = "";
    
        document.querySelectorAll('.commercial-form-class').forEach(leadForm => {
       

        //   if (!leadForm || !billInput || !billError || !designationError) return;


            // Live field validation
            function addLiveValidation(inputField, validationFn) {
                inputField.addEventListener('input', () => {
                    const feedbackEl = inputField.parentElement.querySelector('.invalid-feedback');
                    if (feedbackEl) {
                        feedbackEl.style.display = validationFn(inputField.value) ? 'none' : 'block';
                    }
                });
            }

            // Attach live validation to fields
            addLiveValidation(leadForm.full_name, isNameValid);
            addLiveValidation(leadForm.whatsapp_number, isPhoneValid);
            addLiveValidation(leadForm.pincode, isPinFormatValid);
            addLiveValidation(leadForm.company_name, isCompanyValid);
            addLiveValidation(leadForm.city, isNameValid);
            addLiveValidation(leadForm.monthly_bill, isBillValid);

        // ===== On Submit =====
        leadForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            let hasError = false;

            const nameVal = leadForm.full_name.value.trim();
            const phoneVal = leadForm.whatsapp_number.value.trim();
            const company = leadForm.company_name.value.trim();
            const pinVal = leadForm.pincode.value.trim();
            const cityVal = leadForm.city.value.trim();
            const billVal = leadForm.monthly_bill.value.trim();
            // Validate fields
            if (!isNameValid(nameVal)) {
                leadForm.full_name.classList.add('is-error');
                leadForm.full_name.parentElement.querySelector('.invalid-feedback').style.display = 'block';
                hasError = true;
            } else {
                leadForm.full_name.classList.remove('is-error');
                leadForm.full_name.parentElement.querySelector('.invalid-feedback').style.display = 'none';
            }
            if (!isNameValid(cityVal)) {
                leadForm.city.classList.add('is-error');
                leadForm.city.parentElement.querySelector('.invalid-feedback').style.display = 'block';
                hasError = true;
            } else {
                leadForm.city.classList.remove('is-error');
                leadForm.city.parentElement.querySelector('.invalid-feedback').style.display = 'none';
            }

                if (!isCompanyValid(company)) {
                    leadForm.company_name.classList.add('is-error');
                    leadForm.company_name.parentElement.querySelector('.invalid-feedback').style.display = 'block';
                    hasError = true;
                } else {
                    leadForm.company_name.classList.remove('is-error');
                    leadForm.company_name.parentElement.querySelector('.invalid-feedback').style.display = 'none';
                }

            if (!isPhoneValid(phoneVal)) {
                leadForm.whatsapp_number.classList.add('is-error');
                leadForm.whatsapp_number.parentElement.querySelector('.invalid-feedback').style.display = 'block';
                hasError = true;
            } else {
                leadForm.whatsapp_number.classList.remove('is-error');
                leadForm.whatsapp_number.parentElement.querySelector('.invalid-feedback').style.display = 'none';
            }
            if (!billVal) {
                leadForm.monthly_bill.classList.add('is-error');
                leadForm.monthly_bill.parentElement.querySelector('.invalid-feedback').style.display = 'block';
                hasError = true;
            } else {
                leadForm.monthly_bill.classList.remove('is-error');
                leadForm.monthly_bill.parentElement.querySelector('.invalid-feedback').style.display = 'none';
            }
            if (!isPinFormatValid(pinVal)) {
                leadForm.pincode.classList.add('is-error');
                leadForm.pincode.parentElement.querySelector('.invalid-feedback').style.display = 'block';
                hasError = true;
            } else {
                const isApiValid = await isPinValid(pinVal);
                if (!isApiValid) {
                    leadForm.pincode.classList.add('is-error');
                    leadForm.pincode.parentElement.querySelector('.invalid-feedback').style.display = 'block';
                    hasError = true;
                } else {
                    leadForm.pincode.classList.remove('is-error');
                    leadForm.pincode.parentElement.querySelector('.invalid-feedback').style.display = 'none';
                }
            } 
            
            const { city, isInactivePincode, pinInDB } = await fetchPincodeData(pinVal);
            if (!hasError) {
                leadForm.reset();
                document.querySelectorAll('.custom-radio').forEach(function (el) {
                    el.classList.remove('active');
                });
                const formData = {
                    name: nameVal,
                    company_name: company,
                    phone: phoneVal,
                    pincode: pinVal,
                    bill: billVal,
                    city: cityVal,
                    isInactivePincode: isInactivePincode,
                    utm_source: getCookie("utm_source") || "",
                    utm_medium: getCookie("utm_medium") || "",
                    utm_campaign: getCookie("utm_campaign") || "",
                    utm_content: getCookie("utm_content") || "",
                    utm_terms: getCookie("utm_term") || "",
                    utm_fbclid: getCookie("fbclid") || "",
                    fbBrowserId: getCookie("_fbp") || "",
                    gclid: getCookie("gclid") || "",
                    utm_url:  window.location.href,
                    sesstion_id: getCookie('lead_session_id')
                };
                fetch(ajaxObject.ajax_url, {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: new URLSearchParams({
                        action: "send_to_commertial_handler",
                        leadData: JSON.stringify(formData)
                    })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        // Clear commercial localStorage based on page
                        let deletePrefix = null;

                        if (isGoSolar) {
                            deletePrefix = 'lead_commercial_go_solar_';
                        } else if (isBtl) {
                            deletePrefix = 'lead_commercial_btl_';
                        } else if (isCommercial) {
                            deletePrefix = 'lead_commercial_';
                        }

                        if (deletePrefix) {
                            Object.keys(localStorage).forEach(key => {
                                if (key.startsWith(deletePrefix)) {
                                    localStorage.removeItem(key);
                                }
                            });
                            console.log(`All ${deletePrefix}* storage cleared`);
                        }

                        document.querySelector('.success_commercial_message').classList.remove('d-none');
                        const prospectId = data?.data?.mysql_response?.prospectId;
                        const opportunityId = data?.data?.mysql_response?.opportunityId;
                        const redirectUrl = data?.data?.mysql_response?.redirect_url;
                        const formFieldMapping = {
                            "/commercial": "form_submit",
                            "/go-solar": "form_submit_details"
                        };

                        let formFieldName = 'form_submit'; 
                        if (formFieldMapping[path]) {
                            formFieldName = formFieldMapping[path];
                        } 
                        console.log(billVal)
                        const payloadForm = {
                            ...moengagePayload,
                            prospect_id: prospectId,
                            opportunity_id: opportunityId,
                            lead_serviceable_check: isInactivePincode,
                            customer_name: nameVal,
                            company_name: company,
                            whatsapp_number: phoneVal,
                            monthly_bill: billVal || "",
                            pin_code: pinVal,
                            city: cityVal,
                            is_pin_valid: pinInDB || false,
                            form_field_name: formFieldName,
                        };
                        Moengage.track_event('form_field_clicked', payloadForm);
                        const moengagePayloadNew = {
                            'customer_name':nameVal,
                            'customer_mobile':phoneVal,
                            'monthly_bill':billVal,
                            'pin_code':pinVal,
                            'city': cityVal || '',
                            'url': window.location.href,
                            'device_type':  getDeviceType() || '',
                            'device_name': getDeviceName() || '',
                        }
                        const pageReferrer = sessionStorage.getItem('original_referrer') || '';
                        moengagePayloadNew['page_referrer'] = pageReferrer;

                    
                        Moengage.add_unique_user_id(prospectId);
                        Moengage.add_mobile(phoneVal || "");
                        Moengage.add_user_name(nameVal || "");
                        Moengage.add_user_attribute("prospect_id",prospectId || "");
                        Moengage.add_user_attribute("opportunity_id", opportunityId || "");
                        Moengage.add_user_attribute("monthly_bill", billVal || "");
                        Moengage.add_user_attribute("pin_code", pinVal || "");
                        Moengage.add_user_attribute("city", cityVal || "");
                        Moengage.add_user_attribute("page_referrer", pageReferrer);
                        Moengage.add_user_attribute("company_name", company || "");
                        Moengage.add_user_attribute("product_type", "commercial");
                        
                        let firstName = nameVal.split(" ")[0];
                        console.log("firstName::>", firstName);
                        
                        Moengage.add_first_name(firstName || "");
                        console.log("LastName::>", nameVal.split(" ").slice(1).join(" ") || "");
                        Moengage.add_last_name(nameVal.split(" ").slice(1).join(" ") || "");
                        console.log("Moengage Payload windpro::>", moengagePayload);
                        Moengage.track_event('lead_form_submit_success', moengagePayloadNew);
                        dataLayer.push({
                                event: isInactivePincode ? 'invalid_pincode' : 'lead_form_submit',
                                'leadsUserData': {
                                    'phone_number': '+91' + phoneVal,
                                },
                                'bill_value': billVal,
                                'currency':'INR'
                                });
                        dataLayer.push({
                            'event': 'lead_form_submit_commercial',
                            'leadsUserData': {
                                'phone_number': '+91' + phoneVal,
                            },
                            'bill_value': billVal,
                            'currency':'INR'
                        })

                        var billValueEvent = sseBillValueEvent(billVal);
                        dataLayer.push({'event': billValueEvent});
                            window.criteo_q = window.criteo_q || [];
                            let deviceType = /iPad/.test(navigator.userAgent) ? "t" : /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Silk/.test(navigator.userAgent) ? "m" : "d";
                            window.criteo_q.push(
                                { event: "setAccount", account: 117042 },
                                { event: "setEmail", email: '' },
                                { event: "setSiteType", type: deviceType},
                                { event: "trackTransaction",
                                    id: "1",
                                    item: [
                                    {id: "1", price: "1", quantity: "1" }
                                    ]
                                }
                            )
                        
                        console.log("Moengage GoodZero you Payload:", moengagePayload);
                        // console.log("Details submitted successfully!");
                        if (redirectUrl) {
                            window.location.href = redirectUrl;
                        }

                    } else {
                        console.log("Submission failed: " + (data.message || "Try again later."));
                    }
                })
                .catch(err => {
                        console.error("AJAX Error:", err);
                        console.log("An error occurred. Please try again.");
                });
                console.log('Form Submitted. Values:', formData);
            }
        });
        });

    }
});

document.querySelectorAll('.custom-select-dropdown .dropdown-item').forEach(item => {
  item.addEventListener('click', function (e) {
    e.preventDefault();

    const selectedLabel = this.textContent.trim();
    const selectedValue = this.getAttribute('data-value');

    const dropdownWrapper = this.closest('.custom-select-dropdown');
    const labelSpan = dropdownWrapper.querySelector('button span');
    const hiddenInput = dropdownWrapper.querySelector('input[type="hidden"]');
    const feedback = dropdownWrapper.querySelector('.invalid-feedback') || dropdownWrapper.querySelector('.billError');

    if (labelSpan && hiddenInput) {
      labelSpan.textContent = selectedLabel;
      hiddenInput.value = selectedValue;
    }

    if (feedback) {
      feedback.classList.add('d-none');
    }
  });
});