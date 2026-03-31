/* 
   BNR Infrastructure — Shared UI Scripts
   Hamburger menu, active nav, scroll reveal, counters, scroll-to-top
*/

document.addEventListener('DOMContentLoaded', () => {

    /* ── ACTIVE NAV LINK ── */
    let currentPage = window.location.pathname.split('/').pop();
    if (!currentPage || currentPage === '') currentPage = 'index.html';

    document.querySelectorAll('.nav-link, .mobile-menu .nav-link').forEach(link => {
        link.classList.remove('active'); // clear any hardcoded active
        const href = link.getAttribute('href');
        if (href && href === currentPage) {
            link.classList.add('active');
        }
    });

    /* ── HAMBURGER MENU ── */
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('open');
            hamburger.classList.toggle('open', isOpen);
            document.body.classList.toggle('menu-open', isOpen);
            hamburger.setAttribute('aria-expanded', isOpen);
        });

        // Close menu when a link is clicked
        mobileMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                hamburger.classList.remove('open');
                document.body.classList.remove('menu-open');
            });
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                mobileMenu.classList.remove('open');
                hamburger.classList.remove('open');
                document.body.classList.remove('menu-open');
            }
        });
    }

    /* ── REVEAL ON SCROLL ── */
    const revealElements = document.querySelectorAll('.reveal, .timeline-item');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ── COUNTER ANIMATION ── */
    const counterElements = document.querySelectorAll('.stat-number[data-target]');

    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-target'));
        if (!target) return;
        const duration = 2000;
        const stepTime = Math.max(Math.floor(duration / target), 16);
        let current = 0;

        const timer = setInterval(() => {
            current = Math.min(current + Math.ceil(target / (duration / stepTime)), target);
            el.innerText = current;
            if (current >= target) {
                el.innerText = target + '+';
                clearInterval(timer);
            }
        }, stepTime);
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counterElements.forEach(el => counterObserver.observe(el));

    /* ── SCROLL TO TOP ── */
    const scrollBtn = document.getElementById('scrollTopBtn');
    if (scrollBtn) {
        window.addEventListener('scroll', () => {
            scrollBtn.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });

        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

});
