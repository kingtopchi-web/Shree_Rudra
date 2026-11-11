// Site-wide scripts for markup that ships on every page (header.php and
// footer.php). Loaded on all pages, including the home page, city/state pages
// and the thank-you flows that drop script.js, so keep page-specific code out
// of here and only depend on jQuery.

jQuery(document).ready(function ($) {
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

    $('#openModalButton').on('click', function () {
        $('#categoryModal').modal('show');
    });

    $('#closeModal').on('click', function () {
        $('#categoryModal').modal('hide');
    });
});
jQuery(document).ready(function ($) {
    
     function animateCounter($el, target) {
        const isDecimal = target.toString().includes(".");
        $({ countNum: 0 }).animate({ countNum: target }, {
            duration: 2000,
            easing: 'swing',
            step: function () {
                let value = this.countNum;
                let displayVal = isDecimal
                    ? value.toFixed(1)
                    : Math.floor(value).toLocaleString(); // adds commas
                let prefix = $el.data('prefix') || '';
                $el.text(prefix + displayVal);
            },
            complete: function () {
                let value = target;
                let displayVal = isDecimal
                    ? parseFloat(value).toFixed(1)
                    : Math.floor(value).toLocaleString();
                let prefix = $el.data('prefix') || '';
                // let suffix = $el.data('suffix') || '';
                 $el.text(prefix + displayVal);
            }
        });
    }

    function isInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
        );
    }

    const counters = $('.counter');
    const counted = new Set();

    function checkCounters() {
        counters.each(function () {
            const $this = $(this);
            if (!counted.has(this) && isInViewport(this)) {
                const target = parseFloat($this.data('count'));
                animateCounter($this, target);
                counted.add(this);
            }
        });
    }

    // Run on scroll + on load
    $(window).on('scroll load', checkCounters);
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.forEach(function (tooltipTriggerEl) {
            new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
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
(function() {

  // ---- Clear session storage on page load ----
  sessionStorage.removeItem('__engagementData');

  // ---- Initialize engagement data object ----
  window.__engagementData = {
    scroll_percent: 0,
    engagement_time: 0
  };

  // ---- Scroll Tracking ----
  const scrollPoints = [0, 50, 60, 75];
  let maxScroll = -1;

  window.addEventListener('scroll', function() {
    const scrollTop = window.scrollY || window.pageYOffset;
    const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    const winHeight = window.innerHeight;
    const scrollPercent = Math.floor(((scrollTop + winHeight) / docHeight) * 100);

    scrollPoints.forEach(function(point) {
      if (scrollPercent >= point && point > maxScroll) {
        maxScroll = point;
        window.__engagementData.scroll_percent = point;
        sessionStorage.setItem('__engagementData', JSON.stringify(window.__engagementData));
      }
    });
  });

  // ---- Engagement Timer ----
  const engagementTimes = [0, 30, 60];
  engagementTimes.forEach(sec => {
    setTimeout(() => {
      if (sec > window.__engagementData.engagement_time) {
        window.__engagementData.engagement_time = sec;
        sessionStorage.setItem('__engagementData', JSON.stringify(window.__engagementData));
        console.log("Engagement time updated:", sec + "s");
      }
    }, sec * 1000);
  });

})();
// Sticky CTA (.sticky-button-wrapper) on the blog index and single posts.
document.addEventListener("DOMContentLoaded", function () {
    const stickyBtn = document.querySelector(".sticky-button-wrapper");
    const isMobile = window.matchMedia("(max-width: 767px)");

    function handleScroll() {
        // if (!isMobile.matches) return;

        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight;
        const winHeight = window.innerHeight;

        const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;

        if (scrollPercent > 1) {
            stickyBtn?.classList.add("show");
        } else {
            stickyBtn?.classList.remove("show");
        }
    }

    window.addEventListener("scroll", handleScroll);
    isMobile.addEventListener("change", handleScroll);
});
