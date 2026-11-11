/*
 * Hero v2 -- the mobile tag belt for the hero rendered by includes/hero-v2.php.
 *
 * Lived in city-state.js while the hero was city-only; that file is enqueued for
 * `is_singular('city') || is_singular('state')` alone, so on the homes page the
 * pills sat there without sliding. It ships with the component now.
 */
/**
 * Hero tag bar: below 1024px the pills run as an endless belt -- no first, no
 * last. The track holds one extra pill to the left so a neighbour is always
 * peeking, slides one step, then silently moves the leading pill to the back
 * and resets the transform. Every tick looks the same, so there is nowhere to
 * rewind from. AMP never runs this -- amp-carousel does the sliding there.
 */
document.addEventListener("DOMContentLoaded", function () {
    const track = document.querySelector(".city-hero-v2 .hero-tags-bar");
    if (!track) return;

    const order = Array.prototype.slice.call(track.children);
    if (order.length < 2) return;

    const mobile = window.matchMedia("(max-width: 1023.98px)");
    let timer = null;
    let running = false;

    // In hero-v2.css, each pill has `flex: 0 0 295px` with `gap: 12px` below 1024px.
    // Querying offsetWidth immediately after DOM mutations (insertBefore/appendChild)
    // causes a forced synchronous layout (forced reflow). We default to 307px (295 + 12)
    // and observe pill size changes asynchronously via ResizeObserver to stay reflow-free.
    let stepWidth = 307;

    if (window.ResizeObserver && order[0]) {
        const ro = new ResizeObserver(function (entries) {
            for (let i = 0; i < entries.length; i++) {
                const entry = entries[i];
                let width = 0;
                if (entry.borderBoxSize && entry.borderBoxSize.length > 0) {
                    width = entry.borderBoxSize[0].inlineSize;
                } else if (entry.contentRect) {
                    width = entry.contentRect.width + 32; // 16px padding on each side
                }
                if (width > 0) {
                    stepWidth = Math.round(width) + 12;
                }
            }
        });
        ro.observe(order[0]);
    }

    function step() {
        return stepWidth;
    }

    function park() {
        track.style.transition = "none";
        track.style.transform = "translateX(-" + step() + "px)";
    }

    function advance() {
        track.style.transition = "transform 0.5s ease";
        track.style.transform = "translateX(-" + step() * 2 + "px)";
    }

    track.addEventListener("transitionend", function () {
        if (!running) return;
        track.appendChild(track.firstElementChild);
        park();
    });

    function start() {
        running = true;
        track.insertBefore(track.lastElementChild, track.firstElementChild);
        park();
        timer = setInterval(advance, 3000);
    }

    function stop() {
        running = false;
        clearInterval(timer);
        timer = null;
        track.style.transition = "";
        track.style.transform = "";
        order.forEach(function (pill) {
            track.appendChild(pill);
        });
    }

    function sync() {
        if (mobile.matches && !timer) {
            start();
        } else if (!mobile.matches && timer) {
            stop();
        }
    }

    sync();
    if (mobile.addEventListener) {
        mobile.addEventListener("change", sync);
    } else if (mobile.addListener) {
        mobile.addListener(sync);
    }
});

/**
 * SSE-13394: below 768px the hero photo is a tap target that carries the user to
 * the lead form sitting under it. The form is the only thing the page asks for,
 * and on a phone it starts a full screen below the fold, so the banner has to
 * lead into it.
 *
 * The rating strip already carries .js-form-scroll, but both handlers for that
 * class (script.js and city-state.js) scroll to `.city-tag-slider-wrapper
 * .slick-dots` -- markup only the pre-redesign hero renders -- so on a
 * .city-hero-v2 page they silently do nothing. Binding the whole .hero-visual
 * here covers the rating strip too, and lands on the form's own anchor rather
 * than on a slider that is not there.
 *
 * Desktop is deliberately untouched: the form sits beside the hero there, so
 * there is nothing to scroll to. AMP never runs this.
 */
document.addEventListener("DOMContentLoaded", function () {
    const visual = document.querySelector(".city-hero-v2 .hero-visual");
    const form = document.querySelector(".city-hero-v2 #lead-form");
    if (!visual || !form) return;

    visual.addEventListener("click", function (event) {
        if (!window.matchMedia("(max-width: 767.98px)").matches) return;

        // Anything already clickable keeps its own behaviour -- the hero CTA link
        // and the tag pills' images among them.
        if (event.target.closest("a, button, input, label, select, textarea")) return;

        // The navbar is fixed, so scroll the form clear of it. Its height changes
        // with the breakpoint (80px, 72px under 768px), hence the measurement.
        const navbar = document.querySelector(".navbar");
        const offset = navbar ? navbar.getBoundingClientRect().height : 72;
        const top = form.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({ top: top, behavior: "smooth" });
    });
});
