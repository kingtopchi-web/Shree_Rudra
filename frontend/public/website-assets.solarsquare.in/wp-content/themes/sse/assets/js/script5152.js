// Debug helper function - call from browser console: checkReferrer()
// window.checkReferrer = function() {
//     console.log("=== Referrer Debug Info ===");
//     console.log("Current document.referrer:", document.referrer || "(empty)");
//     console.log("Stored original_referrer:", sessionStorage.getItem("original_referrer") || "(empty)");
//     console.log("Current hostname:", location.hostname);
//     console.log("Current URL:", location.href);
//     console.log("getStoredExternalReferrer() returns:", getStoredExternalReferrer());
//     return {
//         documentReferrer: document.referrer,
//         storedReferrer: sessionStorage.getItem("original_referrer"),
//         currentHost: location.hostname,
//         currentUrl: location.href
//     };
// }

jQuery(document).ready(function ($) {
    $(document).ready((function () {
       
        // Good zero page sliders
        $('.tag-slick-slider').slick({
                infinite: true,
                slidesToShow: 4,
                slidesToScroll: 1,
                autoplay: true,
                arrows: false,
                dots: false,
                autoplaySpeed: 0,   
                speed: 4000,    
                cssEase: 'linear',    
                pauseOnHover: false,  
                pauseOnFocus: false,
                responsive: [{
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2.3,
                        slidesToScroll: 1,
                        infinite: true,
                    }
                }]
            });
            $('.tag-slick-homes-slider').slick({
                infinite: true,
                slidesToShow: 2.3,
                slidesToScroll: 1,
                autoplay: true,
                arrows: false,
                dots: false,
                autoplaySpeed: 0,   
                speed: 4000,    
                cssEase: 'linear',    
                pauseOnHover: false,  
                pauseOnFocus: false,
                responsive: [{
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2.3,
                        slidesToScroll: 1,
                        infinite: true,
                    }
                }]
            }); 
        
        $('.goodzero-gallery-slider,.referral-video-image-slider').slick({
            dots: true,
            arrows: false,
            autoplay: false,
            fade: true,
            speed: 500,
            cssEase: 'ease-in-out',
            infinite: true,
            pauseOnHover: false,
            adaptiveHeight: true
        });

        // Pause videos when slide changes
        $('.referral-video-image-slider').on('beforeChange', function() {
            $(this).find('.referral-slider-video').each(function() {
                this.pause();
                $(this).siblings('.play-btn').show();
            });
        });

        // Self-hosted Video Play/Pause
        $('.referral-slider-video').each(function() {
            const video = this;
            video.controls = true; // Enable native video controls (play, pause, volume, progress bar)
            const btn = $(this).siblings('.play-btn');

            btn.on('click', function() {
                if (video.paused) {
                    video.play();
                    btn.hide();
                } else {
                    video.pause();
                    btn.show();
                }
            });
        });
         $('.testimonial-slider').slick({
            vertical: true,
            slidesToShow: 2, 
            slidesToScroll: 1,
            verticalSwiping: true,
            autoplay: false,
            autoplaySpeed: 3000,
            arrows: true,
            dots: false,
            adaptiveHeight: true,
            responsive: [{
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    vertical: false,
                    verticalSwiping: false,
                    adaptiveHeight: false,
                    arrows: false,

                }
            }]
        });
        $('.vertical-slider .wp-block-group__inner-container').slick({
            vertical: true,
            autoplay: true,
            autoplaySpeed: 2000,
            arrows: false,
            dots: false,
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            adaptiveHeight: true
        });
        $('.slider-webinar').slick({
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 2,
            autoplay: true,
            arrows: false,
            dots: true,
            responsive: [{
                    breakpoint: 1024, // Landscape tablets
                    settings: {
                        slidesToShow: 3, // Show 2 slides on landscape tablets
                        slidesToScroll: 3,
                        infinite: true,
                        dots: true
                    }
                },
                {
                    breakpoint: 768, // Portrait tablets
                    settings: {
                        slidesToShow: 1, // Show 1 slide on portrait tablets
                        slidesToScroll: 1,
                        dots: true
                    }
                }
            ]
        });
        $('.slider-block,.slider-block-mob').slick({
            autoplay: true,
            arrows: false
        });
        $('.card-slider').slick({
                dots: false,
                arrows: false,
                infinite: true,
                speed: 400,
                slidesToShow: 1,
                adaptiveHeight: true
            }); 
        

        $('.certificate-card-slider').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
            infinite: false,
            responsive: [
                {
                    breakpoint: 768, 
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        dots: true
                    }
                },
                {
                    breakpoint: 992, // small desktop
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1,
                    }
                },
                {
                    breakpoint: 1200, // large desktop
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 1,
                    }
                }
            ]
        });
        $('.logo-slider').slick({
            slidesToShow: 6,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 2000,
            arrows: false,
            dots: false,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 4
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 3
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 4
                    }
                }
            ]
        });
      

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
        $('.hero-slider').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 3000,
            arrows: false,
            dots: false,
            pauseOnHover: false,
            responsive: [{
                breakpoint: 768,
                settings: {
                    slidesToShow: 1
                }
            }, {
                breakpoint: 520,
                settings: {
                    slidesToShow: 1
                }
            }]
        });
        // A page saved via "Save as" keeps Slick's generated markup, and Slick
        // skips elements that already have .slick-initialized. Restore the
        // original slides so the slider can be initialized again.
        
        $('.chs-city-slider').slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            // autoplay: true,
            // autoplaySpeed: 2000,
            arrows: false,
            dots: false,
        });
        $('.city-card.slick-current').addClass('active-card');
        $('#city-0').show();
        $('#map-0').show();
        // Click to activate
        $('.city-card').on('click', function () {
            var index = $(this).data('city-index');
            $('.city-card').removeClass('active-card');
            $(this).addClass('active-card');
            $('.city-details').hide();
            $('.city-map').hide();
            $('#city-' + index).show();
            $('#map-' + index).show();
        });
        $(".selectBox").on("click", function (e) {
            $(this).toggleClass("show");
            var dropdownItem = e.target;
            var container = $(this).find(".selectBox__value");
            container.text(dropdownItem.text);
            $(dropdownItem)
                .addClass("active")
                .siblings()
                .removeClass("active");
        });
        
        $(".prev-btn, .next-btn").removeClass("slick-disabled");

        $('.search-toggler').on('click', function (event) {
            event.preventDefault();
            $('.search-box-mob').toggleClass('show');
            if ($('#mobileNav').hasClass('show')) {
                $('#mobileNav').removeClass('show');
            }
        });

        $('.book-consultation-form .bill-field .custom-radio').removeClass('d-none');
        $('.book-consultation-form .bill-field .bill-radio').remove();
    }));
});

//----------------------------------------- page-webinar.php-----------------------------------------
jQuery(document).ready(function ($) {
    // Check if carousel exists and has more than one slide
    if ($('.webinar-carousel').length && $('.web-panel-upcoming-webinar').length > 1) {
        $('.webinar-carousel').slick({
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 3500,
            arrows: false,
            responsive: [{
                breakpoint: 768,
                settings: {
                    arrows: false
                }
            }]
        });
    }
});
//--------------------------------page-solar-calculator-------------------------------------

document.addEventListener('DOMContentLoaded', function () {
    const billTrigger = document.getElementById('billTrigger');
        if(billTrigger ){
            billTrigger.addEventListener('click', function () {
                const options = document.getElementById('billOptions');
                const chevron = document.getElementById('billChevron');

                options.classList.toggle('d-none');
                chevron.classList.toggle('fa-chevron-down');
                chevron.classList.toggle('fa-chevron-up');
             });
        }
   
 });

document.querySelectorAll('.bill-option-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
        // Remove active class from all
        document.querySelectorAll('.bill-option-btn').forEach(el => el.classList.remove('active'));

        // Add active to selected
        btn.classList.add('active');

        // Update text and value
        document.getElementById('selectedBill').textContent = btn.textContent;
        // Update hidden input value and trigger 'change'
        const hiddenInput = document.getElementById('bill_desktop');
        hiddenInput.value = btn.getAttribute('data-value');

        // 🔥 Trigger change event manually
        hiddenInput.dispatchEvent(new Event('change'));

        // Close dropdown
        document.getElementById('billOptions').classList.add('d-none');
        document.getElementById('billChevron').classList.remove('fa-chevron-up');
        document.getElementById('billChevron').classList.add('fa-chevron-down');
    });
});
const desktopModal = document.getElementById('formSubmitDesktopModal');
if (desktopModal) {
    desktopModal.addEventListener('show.bs.modal', function () {
        const amountInput = document.getElementById('amount');
        if (!amountInput) return;
        const amountValue = amountInput.value;
        const amountValueWithoutRupee = amountValue.replace(/[^0-9.-]+/g, "");
        const matched = getBillRange(amountValueWithoutRupee);
        if (matched) {
            document.getElementById('selectedBill').textContent = matched.label;

            // Update hidden input value and trigger change
            const hiddenInput = document.getElementById('bill_desktop');
            hiddenInput.value = matched.value;
            hiddenInput.dispatchEvent(new Event('change'));

            // Set the correct active button
            document.querySelectorAll('.bill-option-btn').forEach(btn => {
                if (btn.getAttribute('data-value') === matched.value) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }
    });
}
document.addEventListener('DOMContentLoaded', function () {

    const mobModal = document.getElementById('formSubmitModal');
        if (mobModal) {
        mobModal.addEventListener('show.bs.modal', function () {

            // Get the hidden input #amount
            const amountInput = document.getElementById('amount');
            const billSelect = document.getElementById('bill');
            const amountValue = amountInput ? amountInput.value : '';

            console.log('amountValue:', amountValue); // Debug: Check the value of #amount

            if (amountValue) {
                // Check for direct match in select options
                const options = billSelect.options;
                let directMatch = false;
                for (let i = 0; i < options.length; i++) {
                    if (options[i].value === amountValue) {
                        billSelect.value = amountValue;
                        console.log('Direct match found, selecting:', amountValue);
                        directMatch = true;
                        break;
                    }
                }

                // If no direct match, try mapping numeric value to a range
                if (!directMatch) {
                    const amount = parseFloat(amountValue.replace(/[^0-9.-]+/g, '')); // Clean non-numeric characters

                    console.log('Parsed amount:', amount); // Debug: Check parsed number

                    let selectedRange;
                    if (isNaN(amount)) {
                        console.log('Amount is not a number, skipping range mapping');
                    } else if (amount < 1500) {
                        selectedRange = '<1500';
                    } else if (amount >= 1500 && amount <= 2500) {
                        selectedRange = '1500-2500';
                    } else if (amount > 2500 && amount <= 4000) {
                        selectedRange = '2500-4000';
                    } else if (amount > 4000 && amount <= 8000) {
                        selectedRange = '4000-8000';
                    } else if (amount > 8000) {
                        selectedRange = '>8000';
                    }

                    if (selectedRange) {
                        billSelect.value = selectedRange;
                        console.log('Mapped to range:', selectedRange);
                    } else {
                        console.log('No valid range mapped');
                    }
                }
            } else {
                console.log('No amountValue found or #amount is missing/empty');
            }
        });
    }
});

// ------------------Mobile- skeleton-loader.php
jQuery(document).ready(function ($) {
    $("#slider").slider({
        min: 0,
        max: 100,
        value: 100,
        range: "min",
        disabled: true,
        create: function () {
            $("#slider .ui-slider-range").css("background", "#00BDFF");
        },
        slide: function (event, ui) {
            $(this).find("#custom-handle-1").css({
                left: ui.value + "%"
            });
        }
    });
});

// ------------------ Single.php



document.addEventListener('DOMContentLoaded', function() {
    // gradint Top heading
    const heading = document.querySelector(".gradient-heading");
    if (heading) {
        const words = heading.textContent.trim().split(" ");
        if (words.length >= 2) {
            const lastTwo = words.splice(-2).join(" ");
            const firstPart = words.join(" ");
            heading.innerHTML = `${firstPart} <span class="gradient-text">${lastTwo}</span>`;
        }
    }
      function updateDesktopMarginTop() {
    const navbar = document.querySelector(".navbar");
    const content = document.getElementById("hero-section");

    if (navbar && content) {
        content.style.paddingTop = navbar.offsetHeight + "px";
      } else {
        if(content){
             content.style.paddingTop = "0";
        }
      }
    
  }

    window.addEventListener("load", updateDesktopMarginTop);
    window.addEventListener("resize", updateDesktopMarginTop);
    
});


document.addEventListener('DOMContentLoaded', function () {
    const cityCards = document.querySelectorAll('.city-card');
    const cityDetails = document.querySelectorAll('.city-details');

    cityCards.forEach(card => {
      card.addEventListener('click', () => {
        const index = card.getAttribute('data-city-index');

        cityDetails.forEach(detail => detail.style.display = 'none');
        document.getElementById(`city-${index}`).style.display = 'block';
      });
    });
});


jQuery(document).ready(function ($) {
    if (!window.location.pathname.includes('../../../schedule-meeting/index.html')) {
        return
    }
    const dateContainer = $('#schedule-date-time-container');
    let selectedDate = null;
    let selectedTime = null;
    let city='';
    const overlay = document.getElementById('spinner-overlay');
    const $scheduleButton = $('#schedule-btn');
     
    const EVENT_NAME = 'page_viewed';
    const url = window.location.href;
    const page_source = getRouteFromUrl(url);
    const device_type = getDeviceType();
    const device_name = getDeviceName();
    let previousPage = getRouteFromUrl(document.referrer) || '';   
    const moengagePayload = {
        'page_source':page_source || '',
        'device_type': device_type || '',
        'device_name':device_name || '',
        'previous_page_source':previousPage,
        "utm_source": getCookie("utm_source") || "",
        "utm_medium": getCookie("utm_medium") || "",
        "utm_campaign": getCookie("utm_campaign") || "",
        "utm_content": getCookie("utm_content") || "",
        "utm_fbclid": getCookie("fbclid") || "",
        "gclid": getCookie("gclid") || "",
    }
    Object.keys(moengagePayload).forEach((key) => (moengagePayload[key] == null || moengagePayload[key] == '') && delete moengagePayload[key]);
    // console.log('Moengage payload: ', moengagePayload);
    Moengage.track_event(EVENT_NAME, moengagePayload);
    postMoeLogs(EVENT_NAME, moengagePayload);    

    function showSpinner() { overlay.classList.remove('d-none'); }
    function hideSpinner() { overlay.classList.add('d-none'); }

    function updateScheduleButtonState() {
        $scheduleButton.prop('disabled', !(selectedDate && selectedTime));
    }

    function generateNext7Days() {
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date();
        const nowIST = new Date(today.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
        const startFrom = nowIST.getHours() >= 17 ? 2 : 1;

        for (let i = startFrom; i <= startFrom + 7; i++) {
            const futureDate = new Date();
            futureDate.setDate(today.getDate() + i);
            if (futureDate.getDay() === 1) continue; // Skip Monday
            const date = futureDate.getDate();
            const day = daysOfWeek[futureDate.getDay()];
            const yearMonthDay = futureDate.toISOString().split('T')[0];
            dateContainer.append(`
                <div class="schedule-date-time" data-date="${yearMonthDay}">
                    <span class="schedule-date">${date < 10 ? '0' + date : date}</span><br>
                    <span class="schedule-day">${day}</span>
                </div>
            `);
        }
    }
    
    if (window.location.pathname.includes('../../../schedule-meeting/index.html')) {
        generateNext7Days();
    }

    function formatTimeRange(start, end) {
        const startTime = new Date(start).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).replace(/\s/g, '').replace(':00', '').toLowerCase();
        const endTime = new Date(end).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).replace(/\s/g, '').replace(':00', '').toLowerCase();
        return `${startTime} - ${endTime}`;
    }
    function getLeadIdFromUrl() {
        const pathParts = window.location.pathname.split("/").filter(Boolean);
        const leadIndex = pathParts.indexOf("schedule-meeting");
        if (leadIndex !== -1 && pathParts[leadIndex + 1]) {
            return pathParts[leadIndex + 1]; // return ID part
        }
        return null;
    }
    function getLeadDetails(id) {

        return $.ajax({
            url: ajaxObject.ajax_url,
            type: 'POST',
            dataType: 'json',
            data: {
                action: 'get_schedule_meeting_details',
                meeting_id: id
            }
        }).then(function(response){

            if (!response.success) {
                throw new Error('Invalid response');
            }

            return {
                city: response.data.city,
                lead_id: response.data.lead_id
            };

        });
    }

    $(document).on("click", ".schedule-date-time[data-date]", async function () {
        showSpinner();
        $(".schedule-date-time[data-date]").removeClass("active");
        $(this).addClass("active");
        selectedDate = $(this).data("date");
        $(".schedule-time-btn[data-time]").removeClass("active");
        selectedTime = null;
        $("#date-first-alert-container").hide();
        $(".alert-container").hide();
        updateScheduleButtonState();
        meetingId = getLeadIdFromUrl();
        const leadDetails = await getLeadDetails(meetingId);
        const date = selectedDate+"T00:00:00+0000";
         city = leadDetails.city;
        
         $.ajax({
            url: ajaxObject.ajax_url,
            type: "POST",
            dataType: "json",
            data: {
                action: "sse_get_slots",
                city: city,
                date: date,
            },
            success: function (response) { 
                const formMoengagePayload = {
                        ...moengagePayload,
                        'selected_date': selectedDate+"T00:00:00+0000" || '',
                    };
                    console.log("formMoengagePayload", formMoengagePayload);
                    Moengage.track_event('form_field_clicked', formMoengagePayload);
                    postMoeLogs('form_field_clicked', formMoengagePayload);
                    if (!overlay.classList.contains('d-none')) {
                        hideSpinner();
                    }

                if (response.success) {
                    const timeSlots = document.querySelectorAll(".schedule-time-btn");
                    const slots = response.data.details; 
                    slots.forEach(slot => {
                        console.log(timeSlots)
                        console.log(slot)
                        const formattedTime = formatTimeRange(slot.start, slot.end);
                        timeSlots.forEach(btn => {
                            if (btn.dataset.time.trim() === formattedTime.trim() && !slot.isAvailable) {
                                btn.classList.add("disabled");
                            }
                        });
                    });
                }
            },
            error: hideSpinner
        });
    
    });
    async function postMoeLogs(eventName, payload) {
        const meetingId = getLeadIdFromUrl();
        const leadDetails = await getLeadDetails(meetingId);
        const lead_id = leadDetails.lead_id;
       
        let logPayload = {
            action: 'submit_moengage_logs',   // WP action hook
            entityId: lead_id,                // define this globally
            type: 'event',
            payload: {
                eventName: eventName,
                payload: {
                    ...payload
                }
            }
        };

        $.ajax({
            url: ajaxObject.ajax_url,   // localized ajax url
            type: 'POST',
            dataType: 'json',
            data: logPayload,
            success: function(response) {
                console.log("response", response);
            }
        });
    }

    $(document).on("click", ".schedule-time-btn[data-time]", function () {
            if (!selectedDate) {
                $("#date-first-alert-container").show();
                return;
            }
            $(".schedule-time-btn[data-time]").removeClass("active");
            $(this).addClass("active");
            selectedTime = $(this).data("time");
            updateScheduleButtonState();
            const formMoengagePayloadTime ={
                ...moengagePayload,
                'selected_time': selectedTime || '',
            }
            console.log("formMoengagePayloadTime", formMoengagePayloadTime);
            Moengage.track_event('form_field_clicked', formMoengagePayloadTime);
            postMoeLogs('form_field_clicked', formMoengagePayloadTime);
    });

    function convertToISODate(date, timeRange) {
        const [startTime, endTime] = timeRange.split(" - ");
        function convertTo24Hour(time) {
            const [timePart, modifier] = time.match(/[a-z]+|[^a-z]+/gi);
            let [hours, minutes] = timePart.split(":");
            minutes = minutes || "00";
            hours = parseInt(hours, 10);
            if (modifier.toLowerCase() === "pm" && hours !== 12) hours += 12;
            else if (modifier.toLowerCase() === "am" && hours === 12) hours = 0;
            return `${String(hours).padStart(2, '0')}:${minutes}:00.000Z`;
        }
        return {
            startISO: `${date}T${convertTo24Hour(startTime)}`,
            endISO: `${date}T${convertTo24Hour(endTime)}`
        };
    }
    

    $("#scheduleMeetingForm").submit(function (e) {
        e.preventDefault();
        if (selectedDate && selectedTime) {
            $("#schedule-btn").prop("disabled", true);
            $(".alert-container").hide();
            const { startISO, endISO } = convertToISODate(selectedDate, selectedTime);
            const leadId = getLeadIdFromUrl();
            $.ajax({
                url: ajaxObject.ajax_url,
                type: "POST",
                dataType: "json",
                data: {
                    action: "sse_schedule_meeting",
                    lead_id: leadId,
                    start: startISO,
                    end: endISO
                },
                success: function (data) {
                    if (data.success) {
                        window.location.href = `${window.location.origin}/schedule-meeting/${leadId}/thank-you`;
                    }
                    $("#schedule-btn").prop("disabled", false);
                    Moengage.track_event('cta_clicked', subMissionMoePayload);
                    postMoeLogs('cta_clicked', subMissionMoePayload);
                },
                error: function (data) {
                    let responseMessage = "Something went wrong, please try again later";
                    if (data?.responseJSON?.message) {
                        responseMessage = data.responseJSON.message;
                    }
                    $("#alert-dynamic").html("<strong>Error!</strong> " + responseMessage + "!");
                    $("#alert-container-dynamic").show();
                    $("#schedule-btn").prop("disabled", false);
                }
            });
        } else {
            $(".alert-container").show();
        }
    });

});
document.addEventListener("DOMContentLoaded", function () {
   const forms = document.querySelectorAll("form[data-action]");
   forms.forEach(form => {
        form.addEventListener("submit", function (e) {
            e.preventDefault(); // prevent refresh
                    let errors = {};

                    const name = document.getElementById("name").value.trim();
                    const phone = document.getElementById("phone").value.trim();
                    const hsnameInput = document.getElementById("hsname"); 
                    const hsname = hsnameInput ? hsnameInput.value.trim() : ""; 
                    const city = document.getElementById("city").value.trim();

                    // JS validation
                    if (!name.match(/^[\p{L}\s\-]+$/u)) {
                        errors.name = "Name is required";
                    }
                    if (name === "") {
                        errors.name = "Name is required";
                    } else if (!name.match(/^[\p{L}\s\-]+$/u)) {
                        errors.name = "Name is invalid";
                    }
                    if (phone === "") {
                        errors.phone = "WhatsApp number is required";
                    } else if (!/^\d+$/.test(phone)) {
                        errors.phone = "Mobile number should be numeric";
                    } else if (phone.length !== 10) {
                        errors.phone = "WhatsApp number must be 10 digits";
                    }
                    if (hsnameInput && hsname === "") {
                        errors.hsname = "Name is required";
                    }
                    if (city === "") {
                        errors.city = "City is required";
                    } else if (!city.match(/^[\p{L}\s\-]+$/u)) {
                        errors.city = "City is invalid";
                    }
                   

        // Clear old errors
            form.querySelectorAll(".error-msg, .error").forEach(el => (el.innerText = ""));

            // Show new errors
            Object.keys(errors).forEach(key => {
                const errorEl = form.querySelector(`#error-${key}`);
                if (errorEl) errorEl.innerText = errors[key];
            });
            // Stop submission if validation fails
            if (Object.keys(errors).length > 0) return;
            // Read action from data attribute
            const action = form.dataset.action;
            const utm_source = getCookie("utm_source") || "";
            const utm_medium = getCookie("utm_medium") || "";
            const utm_campaign = getCookie("utm_campaign") || "";
            const utm_term = getCookie("utm_term") || "";
            const utm_url = window.location.href;

            const formData = new FormData(form);
            
            formData.append("action", action);
            formData.append("utm_source", utm_source);
            formData.append("utm_medium", utm_medium);
            formData.append("utm_campaign", utm_campaign);
            formData.append("utm_term", utm_term);
            formData.append("utm_url", utm_url);
            

            fetch(ajaxObject.ajax_url, {
                method: "POST",
                body: formData,
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    window.location.href = data.data.redirect;
                } else {
                    const errors = data.data;
                    for (let field in errors) {
                        if (document.getElementById("error-" + field)) {
                        document.getElementById("error-" + field).innerText = errors[field];
                        }
                    }
                }
            })
            .catch(err => console.error("AJAX Error:", err));
        });
    });
    const heading = document.querySelector(".sse-slider-header-1");
    if (heading) {
        heading.innerHTML = heading.innerHTML.replace(
            /rooftop solar/gi,
            '<span style="color:#06ccf8; font-weight:bold;">$&</span>'
        );
    }
    // Smooth scroll for referral button - Mobile only (must run before sections check)

        const cityPageLogoButtons = document.querySelectorAll('.city-page-variant');
        if(cityPageLogoButtons.length > 0){
            cityPageLogoButtons.forEach(function(button) {
                button.addEventListener('click', function(e) {
                    console.log("City page logo button clicked");
                    const href = this.getAttribute('href');
                    if (href && href.startsWith('#')) {
                        e.preventDefault();
                        const targetId = href.substring(1);
                        const targetElement = document.getElementById(targetId);
                        if (targetElement) {
                            // Calculate header height for offset
                            const header = document.querySelector('nav');
                            const headerHeight = header ? header.offsetHeight : 80;
                            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                            const offsetPosition = targetPosition - headerHeight; // 20px extra padding
                            window.scrollTo({
                                top: offsetPosition,
                                behavior: 'smooth'
                            });
                        }
                    }
                });
            });
        }
});


jQuery(document).ready(function ($) {
      let previousPage = getRouteFromUrl(document.referrer) || '';   
        const page_source = getRouteFromUrl(window.location.href);
        const deviceType = getDeviceType(); 
        const deviceName = getDeviceName();
     const pathname = window.location.pathname.replace(/\/$/, '');
     function getBaseMoengagePayload() {
            return {
                page_source: page_source || '',
                device_type: deviceType || '',
                device_name: deviceName || '',
                previous_page_source: previousPage || '',
                utm_source: getCookie("utm_source") || '',
                utm_medium: getCookie("utm_medium") || '',
                utm_campaign: getCookie("utm_campaign") || '',
                utm_content: getCookie("utm_content") || '',
                utm_fbclid: getCookie("fbclid") || '',
                gclid: getCookie("gclid") || ''
            };
        }
    // Fire ONLY on book-solar-consultation page
    if (pathname.endsWith('/book-solar-consultation')){
        const EVENT_NAME = 'landing_page_viewed';
      
        const moengagePayload = { ...getBaseMoengagePayload() };
        Object.keys(moengagePayload).forEach((key) => (moengagePayload[key] == null || moengagePayload[key] == '') && delete moengagePayload[key]);
            console.log('Moengage payload pageview: ', moengagePayload);
        Moengage.track_event(EVENT_NAME, moengagePayload);
         const EVENT_FORM_FIELD = 'form_field_clicked';
        
        // Track blur on all text/tel inputs
        ['name', 'city', 'mob_no', 'pin','meeting_date','email'].forEach(name  => {
            const inputs = document.querySelectorAll(`[name="${name}"]`);
            

            if (inputs) {
                inputs.forEach(input => {
                    input.addEventListener('blur', (e) => {
                       
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

    }
   
    $('.radio-group .custom-radio').click(function(){
        $(this).parent().find('.custom-radio').removeClass('selected');
        $(this).addClass('selected');
        var val = $(this).attr('data-value');
        $(this).parent().find('input').val(val);
        $(this).parent().find('label').remove();
    });
    
    $(document).on("input", "#book_pincode", function () {
        var el = $(this);
        var val = el.val();
        // Remove anything that's not a digit
        val = val.replace(/\D/g, "");
        el.val(val); 
        const errorEl = $(".error-message-mobile");
        
        if (val.length === 6) {
            errorEl.addClass("d-none");
            $.ajax({
                url: ajaxObject.ajax_url,
                cache: false,
                dataType: "json",
                type: "POST",
                data: { action: "sse_get_pincode_status", pincode: val },
                success: function (result) {
                    // console.log("API Response:", result);
                    if (result?.data && result?.data?.pincode_status === 'Active') {
                        let cityName = result?.data?.city;
                        let displayCity = cityName === 'Aurangabad' ? 'Chhatrapati Sambhajinagar' : cityName;
                        $("#homes_city").val(displayCity);
                    }else{
                        console.log($('#homes_city').length)
                        if (["Inactive State","Inactive City","Inactive Pincode"].includes(result?.data?.pincode_status)) {
                            let cityName = result?.data?.city;
                            let displayCity = cityName === 'Aurangabad' ? 'Chhatrapati Sambhajinagar' : cityName;
                            // $('.not-active-city').removeClass("d-none");
                            // let str = result?.data?.pin_code + ' (' + displayCity + ')';
                            // el.val(str);
                            $("#homes_city").val(displayCity);
                        }else{
                            $("#homes_city").val('');
                            
                            // isInactivePincode = true;
                            // sessionStorage.setItem('isInactivePincode', true);
                            // const invalidMoePayload = {
                            //     entered_pin :  val,
                            //     page_url: window.location.href,
                            // };
                            // Moengage.track_event('invalid_pin_entered', invalidMoePayload);
                        }
                    }
                },
            error: function () {
                console.error("API request failed");
            }
        });
        } else if (val.length > 6) {
            $('.invalid-pincode').removeClass("d-none");
            $("#homes_pincode").addClass("error-border");
            $("#slider-meow").slider("option", "disabled", true);
        } else {
            $("#calculate-now-calc").attr("disabled", "disabled");
            $('.invalid-pincode').addClass("d-none");
            $('.not-active-city').addClass("d-none");
            $("#homes_pincode").addClass("error-border");
            $("#slider-meow").slider("option", "disabled", true);
        }
    });
   function validateField($field) {
        const name = $field.attr('name');
        console.log(name)
        const value = $field.val().trim();
        let error = '';

        switch (name) {
            case 'mob_no':
                if (!/^\d{10}$/.test(value)) {
                    error = "Please enter at least 10 characters.";
                }
                break;

            case 'name':
                if (value.length < 2) {
                    error = "Enter your full name";
                }
                break;

            case 'bill':
                console.log('Bill value:', value);
                if (!value) {
                    error = "Please select your monthly bill range";
                }
                break;

            case 'pin':
                if (!/^\d{6}$/.test(value)) {
                    error = "Enter a valid 6-digit pincode";
                }
                break;

            case 'city':
                if (value) {
                    if (!/^[a-zA-Z\s'-]+$/.test(value)) {
                        error = "Enter a valid city";
                    }
                }
                break;

            case 'email':
                if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    error = "Enter a valid email";
                }
                break;

            case 'meeting_date':
                if (!value) {
                    error = "Please select a consultation date";
                }
                break;
        }

        // Show or clear error
        const $errorBox = $field.closest('.mb-3, .col-md-6, .row').find('[data-error-for="' + name + '"], #error_' + name);
        if (error) {
            $errorBox.text(error).removeClass('d-none');
            return false;
        } else {
            $errorBox.text('').addClass('d-none');
            return true;
        }
    }

    /**
     * Attach blur validation to all inputs
     */
    $('#npSolarForm1 input, #npSolarForm2 input, #npSolarForm3 input').on('blur', function() {
        validateField($(this));
    });
    $('#npSolarForm1 button').on('click', function () {
                const whatsappNumber = $('#npSolarForm1 #whatsapp_number').val() || '';
                const moengagePayload = { ...getBaseMoengagePayload() };
                moengagePayload['customer_mobile'] = whatsappNumber;
                moengagePayload['cta_name'] = 'Check Details';
               
                // console.log("Moengage payload:homes ", moengagePayload);
                Moengage.track_event('cta_clicked', moengagePayload);

    });
    $('#npSolarForm3 button').on('click', function () {
        const whatsappNumber = $('#npSolarForm3 #currentPhoneNumber').val() || '';
        const fullName = $('#npSolarForm3 #customerNameVal').val() || '';
        const billAmount = $('#npSolarForm3 #homes_bill').val() || '';
        const moengagePayload = { ...getBaseMoengagePayload() };
        moengagePayload['customer_mobile'] = whatsappNumber;
        moengagePayload['customer_name'] = fullName;
        moengagePayload['monthly_bill'] = billAmount;
        moengagePayload['pin_code'] = $('#npSolarForm3 #homes_pincode').val();
        moengagePayload['city'] = $('#npSolarForm3 #homes_city').val();
        moengagePayload['meeting_date'] = $('#npSolarForm3 #datepicker').val();
        moengagePayload['cta_name'] = 'Schedule Consultation';

        // console.log("Moengage payload:homes ", moengagePayload);
        Moengage.track_event('cta_clicked', moengagePayload);

    });
    $('#npSolarForm2 button').on('click', function () {
        const whatsappNumber = $('#npSolarForm2 #whatsapp_number').val() || '';
        const fullName = $('#npSolarForm2 #name').val() || '';
        const billAmount = $('#npSolarForm2 #homes_bill').val() || '';
        const pinCode = $('#npSolarForm2 #homes_pincode').val() || '';
        const city = $('#npSolarForm2 #homes_city').val() || '';
        const email = $('#npSolarForm2 #email').val() || '';
        const moengagePayload = { ...getBaseMoengagePayload() };
        moengagePayload['customer_mobile'] = whatsappNumber;
        moengagePayload['customer_name'] = fullName;
        moengagePayload['monthly_bill'] = billAmount;
        moengagePayload['pin_code'] = pinCode;
        moengagePayload['city'] = city;
        moengagePayload['email'] = email;
        moengagePayload['cta_name'] = 'Yes! Reduce my electricity bill';
        // console.log("Moengage payload:homes ", moengagePayload);
        Moengage.track_event('cta_clicked', moengagePayload);

    });

    /**
     * Validate a whole form
     */
    function validateForm($form) {
        
        let isValid = true;
        $form.find('input').each(function() {
            if (!validateField($(this))) {
                isValid = false;
            }
        });
        console.log(isValid)
        return isValid;
    } 

    function ajaxSubmit(formId, action, successCallback) {
      
        $(formId).submit(function (e) {
            e.preventDefault();
            
          //  $('.alert').addClasss('d-none');
            var $form = $(this);
      
            // validate first
            if (!validateForm($form)) {
                return false;
            }
            $form.find('.form-submitted-1, .form-submitted-2, .form-submitted-3').removeClass('d-none');
            $form.find('.form-submit-1, .form-submit-2, .form-submit-3').addClass('d-none');
      
            $.post(ajaxObject.ajax_url, $form.serialize() + '&action=' + action, function (data) {
                $form.find('.form-submitted-1, .form-submitted-2, .form-submitted-3').addClass('d-none');
                $form.find('.form-submit-1, .form-submit-2, .form-submit-3').removeClass('d-none');

                successCallback(data, $form);
            }).fail(function (xhr) {
                if(xhr.responseJSON && xhr.responseJSON.errors){
                    $.each(xhr.responseJSON.errors, function(key, val){
                        $('#error_'+key).text(val).removeClass('d-none');
                    });
                } else {
                    console.log('Something went wrong');
                }
            });
        });
    }

    ajaxSubmit('#npSolarForm1', 'np_check_ajax', function(data, form){
        if(data.success){
            const moengagePayloadNew = {
                ...getBaseMoengagePayload(),
                'customer_mobile':$('#whatsapp_number').val(),
            }
                
            Moengage.track_event('whatsapp_number_submit', moengagePayloadNew);
            if(data.data.length > 0){
                if (data.data[0].Status === 'Won' || data.data[0].mx_Custom_2 === 'Booked' || data.data[0].mx_Custom_2 === 'Closed - Won') {
                    $('.form-submit-1').after('<div class="alert alert-success mt-3">Hello '+data.data[0].LeadName+'ji, You already have a booking/order in progress. Please connect with your Solar Consultant for more details</div>')
                } else {
                            // Switch to form 3
                    $('.np-form-1').addClass('d-none');
                    $('.np-form-3').removeClass('d-none');
                    $('#customerName').text(data.data[0].LeadName);
                    $('#customerNameVal').val(data.data[0].LeadName);
                    $('#currentPhoneNumber').val($('#whatsapp_number').val());
                    $('#opportunityId').val(data.data[0].OpportunityId);
                    $('#leadId').val(data.lead[0].ProspectID);
                    $('#currentStage').val(data.data[0].mx_Custom_2);
                    $('#npSolarForm3 #homes_pincode, #npSolarForm3 #book_pincode').val(data.lead[0].mx_Pin_Code);
                    $('#npSolarForm3 #homes_city').val(data.lead[0].mx_City);
                    $('#npSolarForm3 #homes_bill').val(data.lead[0].mx_Monthly_Bill_Amount);
                    $("#npSolarForm3 .custom-radio").each(function() {
                        if ($(this).attr("data-value") === data.lead[0].mx_Monthly_Bill_Amount) {
                            $(this).addClass("selected");
                        }
                    });

                }
            }
            if (data.data.length === 0) {
                var mobileNumber = $('#npSolarForm1 input[name="mob_no"]').val();
                $('.np-form-1').addClass('d-none');
                $('.np-form-2').removeClass('d-none');
                $('#npSolarForm2 input[name="mob_no"]').val(mobileNumber);
            }
           
        } else {
            var mobileNumber = $('#npSolarForm1 input[name="mob_no"]').val();
            $('.np-form-1').addClass('d-none');
            $('.np-form-2').removeClass('d-none');
            $('#npSolarForm2 input[name="mob_no"]').val(mobileNumber);
        }
    });

    ajaxSubmit('#npSolarForm2', 'homes_enquiry_ajax', async function(response, $form){
        const $submitBtn = $form.find('.form-submit-2');
        const $loadingBtn = $form.find('.form-submitted-2');
        const $msgBox = $('#solar-form-message');
        $form.find('.error-message').text('');
        $msgBox.html('');

            $submitBtn.removeClass('d-none');
            $loadingBtn.addClass('d-none');

            if (response.success) {
               
                $msgBox.html('<div class="alert alert-success">' + response.data.message + '</div>');
                const nameVal  = $form.find('[name="name"]').val()?.trim() || '';
                const phoneVal = $form.find('[name="mob_no"]').val()?.trim() || '';
                const billVal  = $form.find('[name="bill"]').val() || '';
                const pinVal  = $form.find('[name="pin"]').val()?.trim() || '';
                const originalCity  = $form.find('[name="city"]').val()?.trim() || '';
                 const prospectId = response?.data?.prospectId;
                const opportunityId = response?.data?.opportunityId;
                const { city,pincode_status, isInactivePincode ,pinInDB,state,cluster } = await fetchPincodeData(pinVal);
                $form[0].reset();
                const moengagePayloadNew = {
                        ...getBaseMoengagePayload(),
                        'customer_name':nameVal,
                        'customer_mobile':phoneVal,
                        'monthly_bill':billVal,
                        'pin_code':pinVal,
                        'city': originalCity || '',
                        'is_servicable':!isInactivePincode,
                        'is_pin_valid' : pinInDB || false,
                    }
                    const pageReferrer = sessionStorage.getItem('original_referrer') || '';
                    moengagePayloadNew['page_referrer'] = pageReferrer;
                    console.log("moengagePayloadNewmoengagePayloadNewmoengagePayloadNew",moengagePayloadNew)
                    const serviceability = getServicibiltyType(pincode_status);
                    console.log("serviceability::>", serviceability);
                    if (typeof serviceability !== 'undefined') {
                        moengagePayloadNew['serviceability'] = serviceability;
                    }
                    //Check is SO Eligible
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
                    Moengage.add_user_attribute("monthly_bill", billVal || "");
                    Moengage.add_user_attribute("pin_code", pinVal || "");
                    Moengage.add_user_attribute("city", originalCity || "");
                    Moengage.add_user_attribute("page_referrer", pageReferrer);
                 
                    let firstName = nameVal.split(" ")[0];
                    console.log("firstName::>", firstName);
                    
                    Moengage.add_first_name(firstName || "");
                    console.log("LastName::>", nameVal.split(" ").slice(1).join(" ") || "");
                    Moengage.add_last_name(nameVal.split(" ").slice(1).join(" ") || "");
                    console.log("Moengage Payload windpro::>", moengagePayloadNew);
                    Moengage.track_event('lead_form_submit_success', moengagePayloadNew);
               // window.location.href = response.data.redirect_url;
            } else {
                if (response.data.errors) {
                    Object.entries(response.data.errors).forEach(([field, msg]) => {
                        $form.find('[data-error-for="' + field + '"]').text(msg);
                    });
                } else {
                    $msgBox.html('<div class="alert alert-danger">Something went wrong. Try again.</div>');
                }
            }
       
    });
    ajaxSubmit('#npSolarForm3', 'np_submit_ajax', function(data, form){
       if (data.success) {
         const whatsappNumber = $('#npSolarForm3 #currentPhoneNumber').val();
        const fullName = $('#npSolarForm3 #customerNameVal').val();    
        console.log("Moengage started---------", data);
                    Moengage.add_unique_user_id(data.data.lead_id);
                    console.log("Moengage User ID set to---------", data.data.lead_id);
                    Moengage.add_user_attribute("prospect_id", data.data.lead_id || "");
            const moengagePayloadNew = {
                    ...getBaseMoengagePayload(),
                    'customer_name':fullName,
                    'customer_mobile':data.data.phone,
                    'monthly_bill': data.data.bill,
                    'pin_code': data.data.pin,
                    'city': $('#npSolarForm3 #homes_city').val(),
                    'is_servicable':!data.data.invalid_pincode,
                    'meeting_date':$('#npSolarForm3 #datepicker').val(),
                    'url': window.location.href,
                }
            const serviceability = getServicibiltyType(data.pincode_status);
            
            if (typeof serviceability !== 'undefined') {
                moengagePayloadNew['serviceability'] = serviceability;
            }           
            console.log('Moengage payload consultation scheduled: ', moengagePayloadNew);
            Moengage.track_event('consultation_scheduled', moengagePayloadNew);

            const duplicateLeadPayload = {
                fullname: fullName || "",
                whatsappNumber: data.data.phone || "",
                pincode: data?.data?.pin || "",
                pincode_servicable: !data.data.invalid_pincode,
                monthly_bill: data?.data?.bill || "",
                utm_source: getCookie("utm_source") || "",
                utm_medium: getCookie("utm_medium") || "",
                utm_campaign: getCookie("utm_campaign") || "",
                utm_content: data?.data?.retargetted_date || "",
                utm_term: getCookie("utm_term") || "",
                opportunityId: data?.opportunity_id || "",
                fbclid: getCookie("fbclid") || "",
                mx_custom_63: "Website - Retargeting",
                action: "send_retargeting_to_bff"
            };

            // Send retargeting data to BFF
            fetch(ajaxObject.ajax_url, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(duplicateLeadPayload)
            })
            .then(response => response.json())
            .then(result => {
                console.log("Retargeting data sent to BFF:", result);
            })
            .catch(error => {
                console.error("Error sending retargeting data to BFF:", error);
            });

            $('.form-submit-3').after('<div class="alert alert-success mt-3">'+data.data.message+'</div>')
        }
        if (!data.success) {
            $('.form-submit-3').after('<div class="alert alert-danger mt-3">Something went wrong. Please try again later.</div>')
        }
    });
    $('#knowMoreForm').on('submit', function(e){
        e.preventDefault();

        var $form = $(this);

        // Run your custom validation
        if (!validateForm($form)) {
            return false; // stop submission if invalid
        }
        $('.alert').remove();
        $('.form-submitted').removeClass('d-none');
        $('.form-submit').addClass('d-none');
         var action = 'homes_enquiry_ajax';
        // AJAX request
        $.ajax({
            url: ajaxObject.ajax_url,
            type: 'POST',
            data: $form.serialize() + '&action=' + action,
            success: function(data) {
                console.log(data);
                $('.form-submitted').addClass('d-none');
                $('.form-submit').removeClass('d-none'); 
                $form.trigger('reset');
                $('.custom-radio').removeClass('selected');

                // dataLayer push
                dataLayer.push({'event': data.invalid_pincode ? 'invalid_pincode' : 'lead_form_submit'});

                // Redirect if URL returned
              
                if(data.success && data.data.redirect_url){
                      console.log(data.data.redirect_url)
                    window.location.href = data.data.redirect_url;
                }
              
            },
            error: function(xhr, status, error){
                $('.form-submitted').addClass('d-none');
                $('.form-submit').removeClass('d-none'); 
                $('.form-submit').after('<div class="alert alert-danger mt-3">Something went wrong. Please try again!</div>');
            }
        });

    });

    // Datepicker
    if ($('#npSolarForm3 #datepicker').length && typeof $.fn.datetimepicker === 'function') {
        $("#npSolarForm3 #datepicker").datetimepicker({
            format:'d-m-Y H:i',
            minDate: '+1970/01/03',
            maxDate: '+1970/01/09',
            allowTimes:[
                '9:00', '10:00', '11:00',
                '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
            ]
        });
    }
});
jQuery(document).ready(function($) {
    $(".faq-card").on("click", function(e) {
        e.preventDefault();
        var category = $(this).data("category");
        $('h2').text('Result for "' + category + '"');
        $(".faq-card").removeClass("active");
        $(this).addClass("active");

        loadFaqs(category, $("#faqSearch").val(), false);
    });

    // Search input
    $("#faqSearch").on("change", function() {
        var keyword = $(this).val();
   //     var activeCategory = $(".faq-card.active").data("category") || 'all';
       $("#faqSearchClear").show();
         $('h2').text('Result for "' + keyword + '"');
         loadFaqs('', keyword, false);
    });

    $("#faqSearchClear").on("click", function() {
        $("#faqSearch").val('');
        $(".faq-card").removeClass("active"); // reset filters
        $("#faqSearchClear").hide();
        loadFaqs('', '', true); // load popular questions
    });

    // AJAX function to load FAQs
    function loadFaqs(category, keyword, popularOnly = false) {
        $("#faqAccordionInnerWrapper").html('<p>Loading FAQs...</p>');

        $.ajax({
            url: ajaxObject.ajax_url,
            method: "POST",
            data: {
                action: "filter_faq_by_category",
                category: category,
                keyword: keyword,
                popular: popularOnly
            },
            success: function(response) {
                $("#faqAccordionInnerWrapper").html(response);
                console.log(keyword)
                console.log($.trim(response))
               if (keyword && response.indexOf('No results found') !== -1) {
                    $('h2').hide();
                    $(".faq-categories").hide();
                } else {
                    $('h2').show();
                    $(".faq-categories").show();
                }
            },
            error: function(xhr, status, error) {
                console.error(error);
                $("#faqAccordionInnerWrapper").html('<p>Failed to load FAQs.</p>');
                $(".faq-categories").show();
            }
        });
    }
     $('#viewAllFaqs').on('click', function(){
        $('.extra-faq').removeClass('d-none');
        $('.view-all-faq-btn-wrapper').hide(); // Hide the button after expanding
    });

});

