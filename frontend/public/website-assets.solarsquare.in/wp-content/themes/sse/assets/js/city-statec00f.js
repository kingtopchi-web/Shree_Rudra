// Cached pages skip store_utm_params_in_cookie(), so save URL UTMs here with the same encoding and expiry.
(function () {
    try {
        const params = new URLSearchParams(window.location.search);
        (window.ajaxObject?.utm_params || []).forEach((param) => {
            const value = params.get(param);
            if (value === null) return;
            document.cookie = param + '=' + encodeURIComponent(value).replace(/%20/g, '+')
                + '; path=/; max-age=' + (30 * 24 * 60 * 60);
        });
    } catch (e) {}
})();

jQuery(document).ready(function ($) {
    $('.card-slider, .city-tag-slick-slider').slick();
     function resetStaleSlick($sliders) {
        $sliders.each(function () {
            const $slider = $(this);
            if (!$slider.hasClass('slick-initialized')) return;
            $slider.find('.slick-cloned, .slick-arrow, .slick-dots').remove();
            $slider.find('.slick-slide')
                .removeClass('slick-slide slick-current slick-active slick-center')
                .removeAttr('data-slick-index aria-hidden tabindex style role aria-describedby id')
                .find('[tabindex="-1"]').removeAttr('tabindex').end()
                .appendTo($slider);
            $slider.children('.slick-list').remove();
            $slider.removeClass('slick-initialized slick-slider slick-dotted');
        });
        return $sliders;
    }
    resetStaleSlick($('.testimonials-slider-desktop')).slick();


    $('.js-home-see-solar-slider').each(function () {
        var $slider = $(this);
        var $dots = $slider.closest('.home-see-solar-media').find('.home-see-solar-dots');

        if ($slider.children('.home-see-solar-slide').length <= 1 || $slider.hasClass('slick-initialized')) {
            return;
        }

        $slider.slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 4000,
            arrows: false,
            dots: true,
            appendDots: $dots.length ? $dots : undefined,
            pauseOnHover: true,
            adaptiveHeight: false
        });
    });

    $('#mainCTA').on('click', function (event) {
        event.stopImmediatePropagation();
        $('#mobileNav').removeClass('show')
    });
    const $mobileNav = $("#mobileNav");
    const $mobileNavClose = $("#mobileNavClose");
    $mobileNavClose.on("click", () => $mobileNav.removeClass("show"));
    $('.book-consultation-form .bill-field .custom-radio').removeClass('d-none');
    $('.book-consultation-form .bill-field .bill-radio').remove();
    sseMarkAmpSessionIfNeeded();
    getStoredExternalReferrer();
});

// Pincode status via the WP backend proxy (sse_get_pincode_status).
// Resolves to the Lighthouse `data` object, or null if not found / on error.
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
    // Default return object for invalid/error cases
    const defaultReturn = {
        city: '',
        pincode_status: '',
        isInactivePincode: true,
        pinInDB: false,
        state: '',
        cluster: ''
    };

    if (pincode.length !== 6) {
        return defaultReturn;
    }

    // Helper to normalize city names
    const normalizeCityName = (cityName) => {
        return cityName === 'Aurangabad' ? 'Chhatrapati Sambhajinagar' : (cityName || '');
    };

    try {
        const data = await getPincodeStatus(pincode);

        if (!data) {
            return defaultReturn;
        }

        const { pincode_status, city: rawCity, state = '', cluster = '' } = data;
        const city = normalizeCityName(rawCity);

        if (pincode_status === 'Active') {
            return {
                city,
                pincode_status,
                isInactivePincode: false,
                pinInDB: true,
                state,
                cluster
            };
        }

        const inactiveStatuses = ["Inactive State", "Inactive City", "Inactive Pincode"];
        if (inactiveStatuses.includes(pincode_status)) {
            return {
                city,
                pincode_status,
                isInactivePincode: true,
                pinInDB: true,
                state,
                cluster
            };
        }

        return defaultReturn;

    } catch (error) {
        return defaultReturn;
    }
}

async function isPinValid(pin) {
    if (!/^[1-9][0-9]{5}$/.test(pin)) return false;
    try {
        const data = await getPincodeStatus(pin);
        return !!data && Object.keys(data).length > 0;
    } catch (error) {
        return false;
    }
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
        return false;
    }
}

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
        } catch (e) {}
    }

    var isExternal = !!ref && !!refHost && refHost !== currentHost;

    if (isExternal) {
        sessionStorage.setItem("original_referrer", ref);
        return ref;
    } else {
        if (stored === null) {
            sessionStorage.setItem("original_referrer", "");
        }
        return stored || "";
    }
}

function getServicibiltyType(pincode_status) {
    if (['Inactive City', 'Inactive State'].includes(pincode_status)) {
        return 'Inactive_PIN_Inactive_City';
    } else if (['Inactive Pincode'].includes(pincode_status)) {
        return 'Inactive_PIN_Active_City';
    } else if (pincode_status === null || pincode_status === undefined || pincode_status === 'undefined') {
        return 'Inactive_PIN_Unidentified';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    let path = window.location.pathname;
    path = path.replace(/^\/(sse-blog|blog)/, '');

    // Constants
    const STORAGE_PREFIX = 'lead_citypage_';
    const EVENT_FORM_FIELD = 'form_field_clicked';
    const EVENT_CTA_CLICKED = 'cta_clicked';
    const FORM_FIELDS = ['full_name', 'whatsapp_number', 'pincode', 'monthly_bill'];

    let SESSION_ID = getCookie('lead_session_id');
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
                    SESSION_ID = res?.data?.session_id || getCookie('lead_session_id') || '';
                    return SESSION_ID;
                })
                .catch(() => SESSION_ID);
        }
        return sessionIdPromise;
    }

    if (!SESSION_ID) ensureSessionId();

    // Helper: Clean empty values from payload
    const cleanPayload = (payload) => {
        const cleaned = { ...payload };
        Object.keys(cleaned).forEach(key => {
            if (cleaned[key] == null || cleaned[key] === "") delete cleaned[key];
        });
        return cleaned;
    };

    // Helper: Get all UTM cookies
    const getUtmParams = () => ({
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
        referrer: sseResolveLeadReferrer()
    });

    // Helper: Toggle validation error display
    const toggleValidationError = (element, errorSelector, isValid) => {
        const errorEl = element.parentElement.querySelector(errorSelector);
        if (errorEl) errorEl.style.display = isValid ? 'none' : 'block';
        element.classList.toggle('is-error', !isValid);
    };

    // Helper: UTM cookie only, the same source getUtmParams() sends with the lead (mirrors sse_otp_flow_required).
    const getUtmValue = (param) => {
        const fromCookie = getCookie(param) || '';
        try {
            return decodeURIComponent(fromCookie.replace(/\+/g, ' '));
        } catch (e) {
            return fromCookie;
        }
    };

    const isFormOtpRequired = () => Object.entries(ajaxObject?.form_otp_rules || {}).some(([param, values]) => {
        const value = getUtmValue(param).trim().toLowerCase();
        return value !== '' && Array.isArray(values) && values.includes(value);
    });

    const FORM_OTP_MAX_ATTEMPTS = 5;
    const FORM_OTP_RESEND_DELAY = 35;

    // Helper: OTP step inside the lead form for configured UTM values; null when not required.
    const setupFormOtp = (leadForm, isPhoneValid, force = false) => {
        const phoneInput = leadForm.whatsapp_number;
        if (!phoneInput || (!force && !isFormOtpRequired())) return null;

        const submitBtns = leadForm.querySelectorAll('button[type="submit"]');
        const phoneWrapper = phoneInput.closest('.form-field-inner-wrapper') || phoneInput.parentElement;
        phoneWrapper.insertAdjacentHTML('afterend', `
            <div class="form-otp-block d-none">
                <p class="form-otp-label">Enter OTP received on the above number</p>
                <div class="form-otp-inputs">
                    <input type="text" inputmode="numeric" class="form-otp-box" autocomplete="one-time-code" aria-label="OTP digit 1"/>
                    <input type="text" inputmode="numeric" maxlength="1" class="form-otp-box" autocomplete="off" aria-label="OTP digit 2"/>
                    <input type="text" inputmode="numeric" maxlength="1" class="form-otp-box" autocomplete="off" aria-label="OTP digit 3"/>
                    <input type="text" inputmode="numeric" maxlength="1" class="form-otp-box" autocomplete="off" aria-label="OTP digit 4"/>
                </div>
                <p class="form-otp-error d-none"></p>
                <p class="form-otp-resend">Didn't get the OTP?
                    <span class="form-otp-timer">Resend OTP in <span class="form-otp-countdown">${FORM_OTP_RESEND_DELAY}</span>s</span>
                    <a href="#" class="form-otp-resend-btn d-none">Resend OTP</a>
                </p>
            </div>`);
        // Shown by the form-otp-verified class that syncLock() toggles on the wrapper.
        phoneWrapper.insertAdjacentHTML('beforeend', '<span class="form-otp-verified-badge" aria-live="polite">Verified</span>');

        const block = phoneWrapper.nextElementSibling;
        const boxes = Array.from(block.querySelectorAll('.form-otp-box'));
        const errorEl = block.querySelector('.form-otp-error');
        const timerEl = block.querySelector('.form-otp-timer');
        const countdownEl = block.querySelector('.form-otp-countdown');
        const resendBtn = block.querySelector('.form-otp-resend-btn');

        let sessionId = '';
        let otpMobile = '';
        let verifiedMobile = '';
        let token = '';
        let attempts = 0;
        let resendTimer = null;
        let verifying = false;

        const post = (body) => fetch(ajaxObject.ajax_url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(body)
        }).then(res => res.json());

        const currentPhone = () => phoneInput.value.trim();
        const isVerified = () => token !== '' && verifiedMobile === currentPhone();

        const syncLock = () => {
            const verified = isVerified();
            phoneWrapper.classList.toggle('form-otp-verified', verified);
            submitBtns.forEach(btn => btn.classList.toggle('is-otp-locked', !verified));
        };

        const showError = (msg) => {
            errorEl.textContent = msg;
            errorEl.classList.remove('d-none');
        };
        const hideError = () => errorEl.classList.add('d-none');

        const clearBoxes = () => boxes.forEach(box => {
            box.value = '';
            box.disabled = false;
            box.classList.remove('error');
        });

        const showResendNow = () => {
            clearInterval(resendTimer);
            timerEl.classList.add('d-none');
            resendBtn.classList.remove('d-none');
        };

        const startCountdown = () => {
            let timeLeft = FORM_OTP_RESEND_DELAY;
            countdownEl.textContent = timeLeft;
            timerEl.classList.remove('d-none');
            resendBtn.classList.add('d-none');
            clearInterval(resendTimer);
            resendTimer = setInterval(() => {
                timeLeft--;
                countdownEl.textContent = timeLeft;
                if (timeLeft <= 0) showResendNow();
            }, 1000);
        };

        const sendOtp = async (action) => {
            const mobile = otpMobile;
            startCountdown();
            try {
                const data = await post({ action, mobile });
                if (mobile !== otpMobile) return;
                if (data.success) {
                    sessionId = data.data?.sessionId || sessionId;
                } else {
                    showError(data.data?.message || 'Could not send OTP. Please try again.');
                    showResendNow();
                }
            } catch (err) {
                if (mobile !== otpMobile) return;
                showError('Could not send OTP. Please try again.');
                showResendNow();
            }
        };

        const resetOtp = () => {
            sessionId = '';
            otpMobile = '';
            attempts = 0;
            clearInterval(resendTimer);
            clearBoxes();
            hideError();
            block.classList.add('d-none');
        };

        const startOtp = (phone) => {
            resetOtp();
            otpMobile = phone;
            block.classList.remove('d-none');
            boxes[0].focus();
            sendOtp('lead_send_otp');
        };

        const verifyOtp = async () => {
            if (verifying || attempts >= FORM_OTP_MAX_ATTEMPTS) return;
            const mobile = otpMobile;
            verifying = true;
            boxes.forEach(box => { box.disabled = true; });
            try {
                const data = await post({
                    action: 'lead_verify_otp',
                    sessionId,
                    otp: boxes.map(box => box.value).join('')
                });
                if (mobile !== otpMobile) return;
                if (data.success && data.data?.otpToken) {
                    token = data.data.otpToken;
                    verifiedMobile = mobile;
                    resetOtp();
                    syncLock();
                    return;
                }
                attempts++;
                const message = data.data?.message || '';
                boxes.forEach(box => box.classList.add('error'));
                if (attempts >= FORM_OTP_MAX_ATTEMPTS) {
                    showError('Maximum verification attempts reached. Please resend a new OTP.');
                    showResendNow();
                } else {
                    showError(/expired/i.test(message) ? message : 'You have entered an incorrect OTP, please try again or resend');
                }
            } catch (err) {
                showError('Could not verify OTP. Please try again.');
            } finally {
                verifying = false;
                if (!isVerified()) {
                    boxes.forEach(box => { box.disabled = attempts >= FORM_OTP_MAX_ATTEMPTS; });
                }
            }
        };

        const afterBoxChange = () => {
            boxes.forEach(box => box.classList.remove('error'));
            hideError();
            if (boxes.every(box => box.value.length === 1)) verifyOtp();
        };

        boxes.forEach((box, idx) => {
            box.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !box.value && idx > 0) boxes[idx - 1].focus();
            });

            box.addEventListener('input', () => {
                const raw = box.value.replace(/\D/g, '');
                if (raw.length > 1) {
                    // Native keyboard OTP suggestions drop the whole code into one box.
                    raw.split('').slice(0, boxes.length - idx).forEach((ch, i) => { boxes[idx + i].value = ch; });
                    boxes[Math.min(idx + raw.length, boxes.length) - 1].focus();
                } else {
                    box.value = raw;
                    if (raw && idx < boxes.length - 1) boxes[idx + 1].focus();
                }
                afterBoxChange();
            });

            box.addEventListener('paste', (e) => {
                e.preventDefault();
                const text = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
                text.split('').slice(0, boxes.length).forEach((ch, i) => { boxes[i].value = ch; });
                boxes[Math.max(Math.min(text.length, boxes.length) - 1, 0)].focus();
                afterBoxChange();
            });
        });

        resendBtn.addEventListener('click', (e) => {
            e.preventDefault();
            attempts = 0;
            clearBoxes();
            hideError();
            sendOtp('lead_resend_otp');
        });

        // Any change to a verified number throws the verification away.
        phoneInput.addEventListener('input', () => {
            const phone = currentPhone();
            if (token && phone !== verifiedMobile) {
                token = '';
                verifiedMobile = '';
            }
            if (!token && phone !== otpMobile) {
                resetOtp();
                if (isPhoneValid(phone)) startOtp(phone);
            }
            syncLock();
        });

        leadForm.addEventListener('reset', () => {
            token = '';
            verifiedMobile = '';
            resetOtp();
            syncLock();
        });

        syncLock();

        return {
            isVerified,
            token: () => (isVerified() ? token : ''),
            // Called when submit is blocked: a restored phone value never fired 'input', so send now.
            prompt: () => {
                const phone = currentPhone();
                if (!isPhoneValid(phone)) return;
                if (phone !== otpMobile) startOtp(phone);
                showError('Please verify your WhatsApp number with OTP to continue');
            }
        };
    };

    // Helper: Validate pincode with API
    const validatePincode = async (pinVal, leadForm, group) => {
        const isPinFormatValid = /^[1-9][0-9]{5}$/.test(pinVal.trim());
        
        if (!isPinFormatValid) {
            leadForm.pincode.classList.add('is-error');
            group.querySelector('.invalid-format').style.display = 'block';
            group.querySelector('.invalid-api').style.display = 'none';
            return false;
        }
        
        const isApiValid = await isPinValid(pinVal);
        if (!isApiValid) {
            leadForm.pincode.classList.add('is-error');
            group.querySelector('.invalid-format').style.display = 'none';
            group.querySelector('.invalid-api').style.display = 'block';
            return false;
        }
        
        leadForm.pincode.classList.remove('is-error');
        group.querySelector('.invalid-format').style.display = 'none';
        group.querySelector('.invalid-api').style.display = 'none';
        return true;
    };


    const previousPage = getRouteFromUrl(document.referrer) || '';
    const page_source = getRouteFromUrl(window.location.href);
    const deviceType = getDeviceType();
    const deviceName = getDeviceName();
    const moengagePayload = {
        page_source: page_source || '',
        device_type: deviceType || '',
        device_name: deviceName || '',
        previous_page_source: previousPage || '',
        ...getUtmParams()
    };

    if (!window.__moengagePageViewed) {
        window.__moengagePageViewed = true;
        Moengage.track_event('page_viewed', moengagePayload);
    }

    // Setup form field tracking and restoration
    FORM_FIELDS.forEach(name => {
        const inputs = document.querySelectorAll(`[name="${name}"]`);
        
        // Add blur event tracking
        inputs.forEach(input => {
            input.addEventListener('blur', (e) => {
                const form = input.closest('form');
                if (form?.classList.contains('leadForm')) {
                    saveProgress(name, e.target.value);
                }
                const payload = cleanPayload({
                    ...moengagePayload,
                    form_field_name: `form_${name}`,
                    form_field_value: e.target.value
                });
                Moengage.track_event(EVENT_FORM_FIELD, payload);
            });
        });

        // Restore saved values
        const savedValue = localStorage.getItem(`${STORAGE_PREFIX}${name}`);
        if (savedValue) {
            inputs.forEach(input => {
                input.value = savedValue;
            });

            if (name === 'monthly_bill') {
                document.querySelectorAll('.custom-radio-block .custom-radio').forEach(radio => {
                    radio.classList.toggle('active', radio.dataset.value === savedValue);
                    if (radio.dataset.value === savedValue) {
                        const billInput = document.querySelector('input[name="monthly_bill"]');
                        if (billInput) billInput.value = savedValue;
                    }
                });
            }
        }
    });

    function attachMoengageClickTracking(selector, fieldName, openLink = false) {
        document.querySelectorAll(selector).forEach(el => {
            el.addEventListener('click', function (e) {
                e.preventDefault();
                const payload = cleanPayload({
                    ...moengagePayload,
                    form_field_name: fieldName
                });
                Moengage.track_event(EVENT_FORM_FIELD, payload);
                if (openLink) {
                    window.open(this.getAttribute('href'), '_blank');
                }
            });
        });
    }

    attachMoengageClickTracking('.tooltip-info', 'form_monthly_bill_i_button');
    attachMoengageClickTracking('.terms-of-use', 'form_terms_of_service', true);
    attachMoengageClickTracking('.privacy-policy', 'form_privacy_policy', true);

    document.querySelectorAll('.custom-radio-block .custom-radio').forEach(radio => {
        radio.addEventListener('click', (e) => {
            const form = radio.closest('form');
            if (form?.classList.contains('leadForm')) {
                saveProgress("monthly_bill", e.target.dataset.value);
            }
            const payload = cleanPayload({
                ...moengagePayload,
                form_field_name: "form_monthly_bill",
                form_field_value: e.target.dataset.value
            });
            Moengage.track_event(EVENT_FORM_FIELD, payload);
        });
    });

    document.querySelectorAll('[data-cta]').forEach(button => {
        button.addEventListener('click', () => {
            const ctaName = button.getAttribute('data-cta');
            const faqName = button.getAttribute('data-faq') || '';
            const payload = cleanPayload({
                ...moengagePayload,
                "CTA Name": ctaName,
                ...(faqName && { faq_name: faqName })
            });
            Moengage.track_event(EVENT_CTA_CLICKED, payload);
        });
    });

    document.querySelectorAll('.track-news').forEach(link => {
        link.addEventListener('click', () => {
            const newsTitle = link.getAttribute('data-news-title') || '';
            const payload = {
                ...moengagePayload,
                'CTA Name': 'news_article',
                'news_article_name': newsTitle
            };
            Moengage.track_event('cta_clicked', payload);
        });
    });


    // Toggle read more button
    const toggleBtn = document.getElementById('toggle-read-more-btn');
    const toggleContent = document.getElementById('content');
    if (toggleBtn && toggleContent) {
        toggleBtn.addEventListener('click', () => {
            const isVisible = toggleContent.style.display === 'block';
            toggleContent.style.display = isVisible ? 'none' : 'block';
        });
    }
    const triggerButtons = document.querySelectorAll('.btn-open-lead-form');
    const submitButton = document.querySelector('.leadFormSubmitBtn');
    const modalTitle = document.getElementById('leadFormLabel');
    triggerButtons.forEach(button => {
        button.addEventListener('click', function () {
            const newText = this.getAttribute('data-button-text');
            const newTitle = this.textContent.trim();
            console.log('New Text:', newText, 'New Title:', newTitle);
            if (newText && submitButton) {
                submitButton.textContent = newText;
            }

            if (newTitle && modalTitle) {
                modalTitle.textContent = newTitle;
            }
        });
    });
    let city = "";
    let isInactivePincode = false;

    // Process each lead form
    document.querySelectorAll('.leadForm').forEach(leadForm => {
        const billInput = leadForm.querySelector('[name="monthly_bill"]');
        const billError = leadForm.querySelector('.billError');

        if (!leadForm || !billInput || !billError) return;

        // Validation functions
        const isNameValid = val => /^[a-zA-Z\s]{2,}$/.test(val.trim());
        const isPhoneValid = val => (ajaxObject?.wp_env === 'production' ? /^[6-9][0-9]{9}$/ : /^[5-9][0-9]{9}$/).test(val.trim());
        const isPinFormatValid = val => /^[1-9][0-9]{5}$/.test(val.trim());

        // Input validation listeners
        leadForm.full_name.addEventListener('input', () => {
            toggleValidationError(leadForm.full_name, '.invalid-feedback', isNameValid(leadForm.full_name.value));
        });

        leadForm.whatsapp_number.addEventListener('input', () => {
            toggleValidationError(leadForm.whatsapp_number, '.invalid-feedback', isPhoneValid(leadForm.whatsapp_number.value));
        });

        let formOtp = setupFormOtp(leadForm, isPhoneValid);

        leadForm.pincode.addEventListener('input', () => {
            const val = leadForm.pincode.value.trim();
            const group = leadForm.pincode.parentElement;
            const isValid = isPinFormatValid(val);
            group.querySelector('.invalid-format').style.display = isValid ? 'none' : 'block';
            group.querySelector('.invalid-api').style.display = 'none';
        });

        // Custom radio handling
        const customRadios = leadForm.querySelectorAll('.custom-radio');
        if (customRadios.length) {
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

        // Next step button handler
        const nextBtn = leadForm.querySelector('.next-step');
        if (nextBtn) {
            nextBtn.addEventListener('click', async function (e) {
                e.preventDefault();
                let hasError = false;

                const billVal = billInput?.value.trim() || '';
                const pinVal = leadForm.pincode?.value.trim() || '';
                const nameVal = leadForm.full_name?.value.trim() || '';
                const phoneVal = leadForm.whatsapp_number?.value.trim() || '';
                const group = leadForm.pincode.parentElement;

                const isVar1 = leadForm.classList.contains('variation-var1');
                const isVar2 = leadForm.classList.contains('variation-var2');

                if (isVar1) {
                    if (!billVal) {
                        billError?.classList.remove('d-none');
                        hasError = true;
                    } else {
                        billError?.classList.add('d-none');
                    }

                    if (!(await validatePincode(pinVal, leadForm, group))) {
                        hasError = true;
                    }
                }

                if (isVar2) {
                    if (!isNameValid(nameVal)) {
                        const err = leadForm.querySelector('[name="full_name"]')?.parentElement.querySelector('.invalid-feedback');
                        if (err) err.style.display = 'block';
                        hasError = true;
                    }

                    if (!isPhoneValid(phoneVal)) {
                        const err = leadForm.querySelector('[name="whatsapp_number"]')?.parentElement.querySelector('.invalid-feedback');
                        if (err) err.style.display = 'block';
                        hasError = true;
                    } else if (formOtp && !formOtp.isVerified()) {
                        formOtp.prompt();
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
            
            // Validate all fields
            const nameIsValid = isNameValid(nameVal);
            toggleValidationError(leadForm.full_name, '.invalid-feedback', nameIsValid);
            if (!nameIsValid) hasError = true;

            const phoneIsValid = isPhoneValid(phoneVal);
            toggleValidationError(leadForm.whatsapp_number, '.invalid-feedback', phoneIsValid);
            if (!phoneIsValid) hasError = true;

            // Read before leadForm.reset() below, which clears the verification.
            const otpToken = formOtp ? formOtp.token() : '';
            if (formOtp && phoneIsValid && !otpToken) {
                formOtp.prompt();
                hasError = true;
            }

            if (!billVal) {
                billError.classList.remove('d-none');
                hasError = true;
            } else {
                billError.classList.add('d-none');
            }

            if (!(await validatePincode(pinVal, leadForm, group))) {
                hasError = true;
            }

            const { city, pincode_status, isInactivePincode, pinInDB, state, cluster } = await fetchPincodeData(pinVal);

            // Assign to outer scope variables for MoEngage tracking
            originalCity = city || cluster;
            searchCityName = originalCity;

            // Parse bill range
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

            // Validation rejected it, so nothing is in flight -- let the user retry.
            if (hasError) {
                submitting = false;
                return;
            }

            // Reset form
            leadForm.reset();
            billInput.value = '';
            document.querySelectorAll('.custom-radio').forEach(el => el.classList.remove('active'));

            // Prepare form data
            const currentPath = window.location.pathname.toLowerCase().replace(/^\/(sse-blog|blog)/, '').replace(/\/$/, '');
            const pageType = 'Website - Citypage';
            const submittedName = currentPath === '/solar-company-in-nagarro' && !/\s+nagarro$/i.test(nameVal)
                ? `${nameVal} Nagarro`
                : nameVal;

            const formData = {
                name: submittedName,
                whatsapp: phoneVal,
                monthly_bill: selectedRange,
                pincode: pinVal,
                city: city,
                isInactivePincode: isInactivePincode,
                ...getUtmParams(),
                source: pageType,
                utm_url: window.location.href,
                referrer: sseResolveLeadReferrer(),
                amp_session: sseIsAmpSessionActive(),
                amp_landing_url: sseGetAmpLandingUrl(),
                is_new_referrer: new URLSearchParams(window.location.search).get('is_new_referrer') || false,
            };
            if (otpToken) formData.otp_token = otpToken;


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
                        // Clear local storage
                        let deletePrefix = null;
                        deletePrefix = 'lead_citypage_';
                       
                        Object.keys(localStorage).forEach(key => {
                            if (key.startsWith(deletePrefix)) {
                                localStorage.removeItem(key);
                            }
                        });
                        

                       // document.querySelector('.success_message')?.classList.remove('d-none');
                       const prospectId = data?.data?.prospectId;
                        const opportunityId = data?.data?.opportunityId;
                        const redirectUrl = data?.data?.redirect_url;
                        const lead_serviceable_check = isInactivePincode === false ? true : false;

                        const formFieldName = /^\/solar-company-in-[a-z-]+\/?$/.test(currentPath)
                            ? "form_get_a_free_quote"
                            : 'form_submit';

                        const moengagePayloadNew = {
                            customer_name: nameVal,
                            customer_mobile: phoneVal,
                            monthly_bill: selectedRange,
                            pin_code: pinVal,
                            city: originalCity || '',
                            is_servicable: !isInactivePincode,
                            is_pin_valid: pinInDB || false,
                            url: window.location.href,
                            device_type: getDeviceType() || '',
                            device_name: getDeviceName() || '',
                        };
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

                        // Moengage user attributes
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

                        var billValue = selectedRange;
                        var billValueEvent = '';
                        if (billValue == '<1500') {
                            billValueEvent = 'bill_insufficient';
                        } else if (billValue == '1500-2500') {
                            billValueEvent = 'bill_low';
                        } else if (billValue == '2500-4000') {
                            billValueEvent = 'bill_mid';
                        } else if (billValue == '4000-8000') {
                            billValueEvent = 'bill_high';
                        } else if (billValue == '>8000') {
                            billValueEvent = 'bill_max';
                        }

                        Moengage.add_user_attribute("state", state || "");
                        Moengage.add_user_attribute("cluster", cluster || "");
                        
                        let firstName = nameVal.split(" ")[0];
                        Moengage.add_first_name(firstName || "");
                        console.log("LastName::>", nameVal.split(" ").slice(1).join(" ") || "");
                        Moengage.add_last_name(nameVal.split(" ").slice(1).join(" ") || "");
                        Moengage.track_event('lead_form_submit_success', moengagePayloadNew);

                        const isInactivePincodeB = sessionStorage.getItem('isInactivePincode') === 'true';
                        const engagement = JSON.parse(sessionStorage.getItem('__engagementData')) || {
                            scroll_percent: 0,
                            engagement_time: 0
                        };

                        
                        var check_lead_status = isInactivePincode ? 'invalid_pincode' : 'lead_form_submit';
                        cityName = city.trim();
                        searchCityName = searchCityName.trim();
                        const isMatch = new RegExp(cityName, "i").test(searchCityName) || new RegExp(searchCityName, "i").test(cityName);
                        var check_pincode_status = '';
                        if (isMatch || (cityName === 'Bengaluru' && searchCityName === 'Bangalore')) {
                            check_pincode_status = isInactivePincode ? 'lead_inactive_pin_accurate_cluster' : 'lead_active_pin_accurate_cluster';
                        } else {
                            check_pincode_status = isInactivePincode ? 'lead_inactive_pin_inaccurate_cluster' : 'lead_active_pin_inaccurate_cluster';
                        }
                    
                
                        var leadSubmitPayload = {
                            event: check_lead_status,
                            'leadsUserData': {
                                'phone_number': '+91' + phoneVal,
                                'pincode': pinVal,
                            }
                        };
                        dataLayer.push(leadSubmitPayload)
                        // Kept for the OTP page, which fires otp_verified with this
                        // same payload. Engagement data is cleared on every page load,
                        // so it can only be captured here. The lead id rides along so
                        // that page can reject a payload belonging to an earlier lead.
                        sessionStorage.setItem('__leadSubmitPayload', JSON.stringify({
                            leadId:  (redirectUrl || '').match(/[?&]id=([^&]+)/)?.[1] || '',
                            payload: leadSubmitPayload
                        }));
                        dataLayer.push({
                            'event': check_pincode_status,
                            'leadsUserData': {
                                'phone_number': '+91' + phoneVal,
                            },
                            'bill_value': selectedRange ,
                            'currency':'INR',
                            'scroll_depth': engagement.scroll_percent,
                            'engagement_time': engagement.engagement_time
                        })

                    
                        dataLayer.push({'event': billValueEvent});
                        

                        // Criteo tracking
                        window.criteo_q = window.criteo_q || [];
                        const deviceTypeCode = /iPad/.test(navigator.userAgent) ? "t"
                            : /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Silk/.test(navigator.userAgent) ? "m" : "d";
                        window.criteo_q.push(
                            { event: "setAccount", account: 117042 },
                            { event: "setEmail", email: '' },
                            { event: "setSiteType", type: deviceTypeCode },
                            { event: "trackTransaction", id: "1", item: [{ id: "1", price: "1", quantity: "1" }] }
                        );

                        // Nitro Tracking
                        var nitroPayload = {
                            monthly_bill: selectedRange || "",
                            page: window.location.href,
                        };
                        if (!window.nitro) {
                            window.nitroSettings = {
                                ready: function (orgId, roamingId, nitroId) {
                                    nitro.track('Book_Consultation', nitroPayload);
                                }
                            };
                        } else {
                            window.nitro.track('Book_Consultation', nitroPayload);
                        }

                        // Submitted, so the spinner has done its job either way.
                        // While a redirect is in flight the button stays disabled
                        // -- the page is on its way out and re-enabling in that
                        // gap is just a second lead waiting to happen.
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
                        // A cached page can carry stale OTP rules; the server's answer wins.
                        if (data.data?.otp_required && !formOtp) {
                            formOtp = setupFormOtp(leadForm, isPhoneValid, true);
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
                    submitting = false;
                    if (submitBtn) {
                        submitBtn.classList.remove('is-loading');
                        submitBtn.disabled = false;
                    }
                    const errorBox = leadForm.querySelector(".form-error-message");
                    if (errorBox) {
                        errorBox.textContent = "Network error. Please check your connection and try again.";
                        errorBox.style.display = "block";
                        setTimeout(() => errorBox.style.display = "none", 10000);
                    }
                });
        });
    });

    async function saveProgress(fieldName, fieldValue) {
        const DB_FIELD_MAP = {
            full_name: "name",
            whatsapp_number: "mob_no",
            pincode: "pin",
            monthly_bill: "bill",
            city: "city",
        };

        const dbFieldName = DB_FIELD_MAP[fieldName] || fieldName;
        let cityValue = "";

        if (fieldName === "city") {
            cityValue = fieldValue;
        } else if (fieldName === "pincode") {
            const { city } = await fetchPincodeData(fieldValue);
            cityValue = city || "";
        }

        const currentPath = window.location.pathname.toLowerCase().replace(/^\/(sse-blog|blog)/, '').replace(/\/$/, '');
        const pageType = 'Website - Citypage';

        const utm_params = {
            ...getUtmParams(),
            source: pageType,
            utm_url: window.location.href,
        };

        await ensureSessionId();

        const bodyData = {
            action: "save_partial_lead",
            session_id: SESSION_ID,
            field: dbFieldName,
            value: fieldValue,
            utm: JSON.stringify(utm_params),
            ...(cityValue && { city: cityValue })
        };

        await fetch(ajaxObject.ajax_url, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(bodyData)
        });

        const storageKey = `${STORAGE_PREFIX}${fieldName}`;
        localStorage.setItem(storageKey, fieldValue);

        if (cityValue) {
            localStorage.setItem(`${STORAGE_PREFIX}city`, cityValue);
        }
        
    }
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
            new bootstrap.Tooltip(el);
        });
    }
    const heading = document.querySelector(".gradient-heading");
    if (heading) {
        const words = heading.textContent.trim().split(" ");
        if (words.length >= 2) {
            const lastTwo = words.splice(-2).join(" ");
            const firstPart = words.join(" ");
            heading.innerHTML = `${firstPart} <span class="gradient-text">${lastTwo}</span>`;
        }
    }
    
    // Scroll helper for mobile form interaction
    function scrollToSlickDots() {
        if (window.innerWidth <= 768) {
            const slickDots = document.querySelector('.city-tag-slider-wrapper .slick-dots');
            if (!slickDots) {
                const wrapper = document.querySelector('.city-tag-slider-wrapper');
                if (wrapper) {
                    wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                return;
            }
            const isVisible = slickDots.offsetParent !== null;
            if (isVisible) {
                slickDots.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    }

    // Scroll on form field focus
    document.querySelectorAll('.form-section .leadForm .form-control,.form-section .leadForm .custom-radio')
        .forEach(field => field.addEventListener('focus', scrollToSlickDots));
    
    // Scroll on CTA click
    document.querySelectorAll('.js-form-scroll')
        .forEach(section => section.addEventListener('click', scrollToSlickDots));
});

document.querySelectorAll('.bill-option-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.bill-option-btn').forEach(el => el.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('selectedBill').textContent = btn.textContent;
        const hiddenInput = document.getElementById('bill_desktop');
        hiddenInput.value = btn.getAttribute('data-value');
        hiddenInput.dispatchEvent(new Event('change'));
        document.getElementById('billOptions').classList.add('d-none');
        document.getElementById('billChevron').classList.remove('fa-chevron-up');
        document.getElementById('billChevron').classList.add('fa-chevron-down');
    });
});
document.addEventListener("DOMContentLoaded", function() {
    const lazyBackgrounds = document.querySelectorAll(".lazy-bg");
    if ("IntersectionObserver" in window) {
        let observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    let el = entry.target;
                    el.style.backgroundImage = `url(${el.dataset.bg})`;
                    observer.unobserve(el);
                }
            });
        });
        lazyBackgrounds.forEach(bg => observer.observe(bg));
    } else {
        // Fallback for older browsers
        lazyBackgrounds.forEach(bg => {
            bg.style.backgroundImage = `url(${bg.dataset.bg})`;
        });
    }
});

jQuery(function ($) {
    function updateCounter($el, value, isDecimal) {
        const prefix = $el.data('prefix') || '';
        const displayValue = isDecimal ? value.toFixed(1) : Math.floor(value).toLocaleString();
        $el.text(prefix + displayValue);
    }

    function animateCounter($el) {
        const target = parseFloat($el.data('count'));
        const isDecimal = String(target).includes('.');

        $({ value: 0 }).animate(
            { value: target },
            {
                duration: 2000,
                easing: 'swing',
                step() {
                    updateCounter($el, this.value, isDecimal);
                },
                complete() {
                    updateCounter($el, target, isDecimal);
                }
            }
        );
    }

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter($(entry.target));
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3
        });

        $('.counter').each(function () {
            observer.observe(this);
        });
    } else {
        const counted = new Set();

        function checkCounters() {
            $('.counter').each(function () {
                if (counted.has(this)) return;
                const rect = this.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    animateCounter($(this));
                    counted.add(this);
                }
            });
        }

        $(window).on('scroll load', checkCounters);
    }
});
