document.addEventListener("DOMContentLoaded", () => {
    // Lock scroll for preloader
    document.body.classList.add('no-scroll');

    /* ==========================================================================
       1. Lenis Smooth Scrolling Integration
       ========================================================================== */
    window.lenisInstance = null;
    if (typeof Lenis !== 'undefined') {
        window.lenisInstance = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            smooth: true
        });

        window.lenisInstance.stop(); // Pause during preloader

        function raf(time) {
            window.lenisInstance.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    /* ==========================================================================
       2. Initialize Basic Libraries (AOS, Swiper)
       ========================================================================== */
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 1000, once: true, offset: 50, easing: 'ease-out-cubic' });
    }

    // Swipers
    if (typeof Swiper !== 'undefined') {
        new Swiper('.brands-swiper', {
            slidesPerView: 2, spaceBetween: 30, autoplay: { delay: 3000, disableOnInteraction: false },
            breakpoints: { 576: { slidesPerView: 3 }, 768: { slidesPerView: 4 }, 1024: { slidesPerView: 6 } }
        });

        new Swiper('.review-swiper', {
            slidesPerView: 1, spaceBetween: 30, autoplay: { delay: 5000, disableOnInteraction: false },
            pagination: { el: '.swiper-pagination', clickable: true },
            breakpoints: { 768: { slidesPerView: 2 } }
        });
    }

    /* ==========================================================================
       3. Navbar & Mobile Menu Logic
       ========================================================================== */
    const header = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });

    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (navMenu.classList.contains('active')) icon.classList.replace('fa-bars', 'fa-times');
            else icon.classList.replace('fa-times', 'fa-bars');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.querySelector('i').classList.replace('fa-times', 'fa-bars');
            }
        });
    });

    /* ==========================================================================
       4. Animated Counters (Handles Ints & Floats correctly)
       ========================================================================== */
    const counters = document.querySelectorAll('.counter');
    if (counters.length && typeof IntersectionObserver !== 'undefined') {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const isFloat = counter.classList.contains('float-counter');
                    const target = parseFloat(counter.getAttribute('data-target'));
                    
                    const updateCount = () => {
                        const count = parseFloat(counter.innerText || 0);
                        const inc = target / 100; // Speed control

                        if (count < target) {
                            counter.innerText = isFloat ? (count + inc).toFixed(1) : Math.ceil(count + inc);
                            requestAnimationFrame(updateCount);
                        } else {
                            counter.innerText = isFloat ? target.toFixed(1) : target;
                        }
                    };
                    updateCount();
                    obs.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(counter => observer.observe(counter));
    }

    /* ==========================================================================
       5. FAQ Accordion Logic
       ========================================================================== */
    const accHeaders = document.querySelectorAll('.acc-header');
    accHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const icon = header.querySelector('i');
            
            document.querySelectorAll('.acc-content').forEach(item => {
                if (item !== content) {
                    item.style.maxHeight = null;
                    item.previousElementSibling.classList.remove('active');
                    item.previousElementSibling.querySelector('i').classList.replace('fa-chevron-up', 'fa-chevron-down');
                }
            });

            header.classList.toggle('active');
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                icon.classList.replace('fa-chevron-down', 'fa-chevron-up');
            }
        });
    });

    /* ==========================================================================
       6. Booking Form to WhatsApp API
       ========================================================================== */
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get values from the form
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const vehicle = document.getElementById('vehicle').value.trim();
            const service = document.getElementById('service').value;

            // Ensure all fields are filled
            if(!name || !phone || !vehicle || !service) return;

            // Cleanly formatted text for WhatsApp
            const text = "Hi American Detailer's,\n\nI want to book an appointment.\n\n*Booking Details:*\n👤 *Name:* " + name + "\n📱 *Phone:* " + phone + "\n🚗 *Vehicle:* " + vehicle + "\n✨ *Service:* " + service + "\n\nPlease share your availability.";
            
            // Encode text so spaces and newlines work perfectly in URLs
            const encodedText = encodeURIComponent(text);
            
            // Your exact WhatsApp number
            const waNumber = '918264121920';
            
            // Open WhatsApp in a new tab
            window.open(`https://wa.me/${waNumber}?text=${encodedText}`, '_blank');
            
            // Reset the form after submission
            bookingForm.reset();
        });
    }
});

/* ==========================================================================
   PRELOADER & GSAP REVEAL SEQUENCE
   ========================================================================== */
const preloaderStartTime = Date.now();

window.addEventListener("load", () => {
    const elapsed = Date.now() - preloaderStartTime;
    const minWaitTime = 2800; // Minimum 2.8 seconds for premium animation sequence
    const remainingTime = Math.max(0, minWaitTime - elapsed);

    setTimeout(() => {
        const preloader = document.getElementById('premium-preloader');
        if (preloader) {
            // Smooth fade out & scale
            preloader.style.opacity = '0';
            preloader.style.transform = 'scale(1.02)';
            preloader.style.pointerEvents = 'none';

            setTimeout(() => {
                preloader.style.display = 'none';
                document.body.classList.remove('no-scroll');
                if (window.lenisInstance) {
                    window.lenisInstance.start();
                }
                playCinematicReveal();
            }, 600); // Wait for CSS transition
        } else {
            // Failsafe
            document.body.classList.remove('no-scroll');
            if (window.lenisInstance) window.lenisInstance.start();
            playCinematicReveal();
        }
    }, remainingTime);
});

function playCinematicReveal() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        if (window.lenisInstance) {
            window.lenisInstance.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => { window.lenisInstance.raf(time * 1000); });
            gsap.ticker.lagSmoothing(0);
        }

        // Reveal Header
        gsap.from(".header", { y: -100, opacity: 0, duration: 1.2, ease: "power3.out" });

        // Reveal Hero Elements
        gsap.from(".gs-reveal", { y: 40, opacity: 0, duration: 1.2, stagger: 0.2, ease: "power3.out" });

        // Initialize ScrollTrigger after DOM is scrollable again
        setTimeout(() => {
            ScrollTrigger.refresh();

            // Scroll Progress Bar
            const scrollBar = document.getElementById('scroll-progress');
            if (scrollBar) {
                gsap.to(scrollBar, {
                    width: "100%", ease: "none",
                    scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.3 }
                });
            }

            // Studio Alternating GSAP Animations
            const gsLefts = document.querySelectorAll('.gs-left');
            const gsRights = document.querySelectorAll('.gs-right');
            
            gsLefts.forEach(el => {
                gsap.from(el, {
                    x: -100, opacity: 0, duration: 1, ease: "power3.out",
                    scrollTrigger: { trigger: el, start: "top 80%" }
                });
            });
            
            gsRights.forEach(el => {
                gsap.from(el, {
                    x: 100, opacity: 0, duration: 1, ease: "power3.out",
                    scrollTrigger: { trigger: el, start: "top 80%" }
                });
            });
        }, 100);
    }
}