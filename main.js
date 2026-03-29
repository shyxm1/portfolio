document.addEventListener('DOMContentLoaded', () => {

    // Initial animations skip (lenis removed)

    // --- 1. Preloader & Initial Animations ---
    const preloader = document.querySelector('.preloader');
    const preloaderProgress = document.querySelector('.preloader-progress');
    
    // Simulate loading progress
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        if (preloaderProgress) preloaderProgress.style.width = `${progress}%`;
        
        if (progress === 100) {
            clearInterval(progressInterval);
        }
    }, 200);

    window.addEventListener('load', () => {
        if (preloaderProgress) preloaderProgress.style.width = '100%';
        if (preloader) preloader.style.display = 'none';
        initHeroAnimations();
    });

    function initHeroAnimations() {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.from('.hero-content .greeting', { y: 20, opacity: 0, duration: 0.8 })
          .from('.hero-content .name', { y: 30, opacity: 0, duration: 1 }, "-=0.6")
          .from('.hero-content .subtitle', { y: 20, opacity: 0, duration: 0.8 }, "-=0.6")
          .from('.hero-content .tagline', { y: 20, opacity: 0, duration: 0.8 }, "-=0.6")
          .from('.hero-buttons .btn', { y: 20, opacity: 0, duration: 0.8, stagger: 0.2 }, "-=0.6")
          .from('.social-icons a', { y: 20, opacity: 0, duration: 0.6, stagger: 0.1 }, "-=0.6")
          .from('.hero-image-container', { scale: 0.9, opacity: 0, duration: 1.2, ease: 'power2.out' }, "-=1");

        // Hero Image Parallax (Linked to scroll)
        gsap.to('.hero-image-container', {
            yPercent: 30,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero-section",
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });
    }

    // --- 2. Custom Cursor ---
    const cursor = document.querySelector('.custom-cursor');
    
    if (cursor && window.innerWidth >= 1024) {
        document.addEventListener('mousemove', (e) => {
            // GSAP quickTo is great for performant cursor tracking, but requestAnimationFrame is also fine.
            // Using standard style updates for simplicity with CSS transition as defined.
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        });

        const hoverElements = document.querySelectorAll('a, button, input, textarea, .nav-link, .skill-card, .project-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    // --- 3. Sticky Navigation & Scroll To Top ---
    const navbar = document.querySelector('.navbar');
    const scrollTopBtn = document.getElementById('scroll-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- 4. Mobile Menu Toggle ---
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuBtn.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }

    navLinksItems.forEach(link => {
        link.addEventListener('click', (e) => {
            // Smooth scroll to section
            const targetId = link.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    window.scrollTo({
                        top: targetEl.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }

            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = menuBtn.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        });
    });

    // --- 5. Scroll Spy (Active Link) ---
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        navLinksItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // --- 6. ScrollTrigger Animations (Replacing IntersectionObserver) ---
    const faders = document.querySelectorAll('.fade-in');
    
    // Using GSAP batch for staggered scroll animations
    ScrollTrigger.batch(faders, {
        onEnter: batch => gsap.to(batch, {opacity: 1, y: 0, stagger: {each: 0}, overwrite: true, duration: 0.4, ease: "power2.out"}),
        start: "top 85%",
    });

    // Animate progress bars on scroll for Skills
    const skillBars = document.querySelectorAll('.progress');
    skillBars.forEach(bar => {
        // Store original width and reset
        const targetWidth = bar.style.width;
        bar.style.width = '0%';
        
        ScrollTrigger.create({
            trigger: bar,
            start: "top 90%",
            onEnter: () => {
                gsap.to(bar, { width: targetWidth, duration: 1.5, ease: "power3.out" });
            }
        });
    });


    // --- 7. Contact Form (Mock) ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
            btn.style.opacity = '0.7';
            
            setTimeout(() => {
                btn.innerHTML = 'Message Sent! <i class="fas fa-check"></i>';
                btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                btn.style.opacity = '1';
                contactForm.reset();
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = ''; 
                }, 3000);
            }, 1500);
        });
    }

    // --- 8. Subtle Parallax for Background Shapes ---
    document.addEventListener('mousemove', (e) => {
        const shapes = document.querySelectorAll('.bg-shape');
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 20;
            const xOffset = (window.innerWidth / 2 - e.pageX) / speed;
            const yOffset = (window.innerHeight / 2 - e.pageY) / speed;
            shape.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
    });

    // --- 9. Magnetic Buttons Effect ---
    const magneticBtns = document.querySelectorAll('.btn, .social-icons a');
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            const position = btn.getBoundingClientRect();
            const x = e.clientX - position.left - position.width / 2;
            const y = e.clientY - position.top - position.height / 2;
            
            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.5,
                ease: "power3.out"
            });
        });
        
        btn.addEventListener('mouseleave', function() {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });

    // Removed Horizontal Scroll Projects Section
});
