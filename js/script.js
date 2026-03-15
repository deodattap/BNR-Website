/* 
   BNR Infrastructure - Professional UI Scripts 
   Intersection Observer for Reveal & Counter 
*/

document.addEventListener('DOMContentLoaded', () => {
    
    /* ── REVEAL ON SCROLL ── */
    const revealElements = document.querySelectorAll('.reveal, .timeline-item');
    
    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active', 'reveal-active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealOnScroll.observe(el));

    /* ── COUNTER ANIMATION ── */
    const counterElements = document.querySelectorAll('.stat-number');
    
    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const stepTime = Math.abs(Math.floor(duration / target));
        let current = 0;
        
        const timer = setInterval(() => {
            current += 1;
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

});
