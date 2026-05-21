document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // Language Toggle
    // ========================================
    const langToggle = document.getElementById('langToggle');
    const body = document.body;
    let currentLang = 'en';
    
    langToggle.addEventListener('click', function() {
        currentLang = currentLang === 'en' ? 'es' : 'en';
        body.setAttribute('data-lang', currentLang);
        
        // Update toggle button
        const enSpan = langToggle.querySelector('.lang-en');
        const esSpan = langToggle.querySelector('.lang-es');
        
        if (currentLang === 'es') {
            enSpan.classList.remove('active');
            esSpan.classList.add('active');
        } else {
            esSpan.classList.remove('active');
            enSpan.classList.add('active');
        }
        
        // Update all translatable content
        updateLanguage(currentLang);
        
        // Add animation to body
        body.style.opacity = '0.95';
        setTimeout(() => {
            body.style.opacity = '1';
        }, 100);
    });
    
    function updateLanguage(lang) {
        const elements = document.querySelectorAll('[data-en][data-es]');
        
        elements.forEach(el => {
            const text = el.getAttribute(`data-${lang}`);
            if (text) {
                // Animate text change
                el.style.opacity = '0';
                el.style.transform = 'translateY(5px)';
                
                setTimeout(() => {
                    el.textContent = text;
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, 150);
            }
        });
    }
    
    // ========================================
    // Navbar Scroll Effect
    // ========================================
    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateNavbar() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });
    
    // ========================================
    // Scroll Animations (Intersection Observer)
    // ========================================
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
              
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => {
        animationObserver.observe(el);
    });

    // ========================================
    // Reveal Observer (.reveal class — How It Works & Payment sections)
    // ========================================
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // ========================================
    // Scramble Number Effect (.scramble-num — step numbers 01 / 02 / 03)
    // ========================================
    const DIGITS = '0123456789';

    function scrambleNum(el, finalStr) {
        const len = finalStr.length;
        let frame = 0;
        const total = 20;
        const iv = setInterval(() => {
            frame++;
            let out = '';
            for (let i = 0; i < len; i++) {
                if (/[^0-9]/.test(finalStr[i])) {
                    out += finalStr[i];
                } else if (frame / total > (i / len) * 0.75 + 0.25) {
                    out += finalStr[i];
                } else {
                    out += DIGITS[Math.floor(Math.random() * 10)];
                }
            }
            el.textContent = out;
            if (frame >= total) { el.textContent = finalStr; clearInterval(iv); }
        }, 48);
    }

    const scrambleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                scrambleNum(entry.target, entry.target.dataset.final || entry.target.textContent);
                scrambleObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });

    document.querySelectorAll('.scramble-num').forEach(el => scrambleObserver.observe(el));

    // ========================================
    // Counter Animation
    // ========================================
    const counters = document.querySelectorAll('.counter');
    let countersAnimated = false;
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                countersAnimated = true;
                animateCounters();
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
    
    function animateCounters() {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        });
    }
    
    // ========================================
    // Smooth Scroll for Anchor Links
    // ========================================
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ========================================
    // Floating Call Button - Enhanced Interaction
    // ========================================
    const floatingCall = document.querySelector('.floating-call');
    
    if (floatingCall) {
        // Add ripple effect on click
        floatingCall.addEventListener('click', function(e) {
            // Create ripple element
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
        
        // Add ripple animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // ========================================
    // Service Cards - Tilt Effect
    // ========================================
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
    
    // ========================================
    // Payment Cards - Hover Pulse
    // ========================================
    const paymentCards = document.querySelectorAll('.payment-card');
    
    paymentCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.addEventListener('mouseenter', function() {
            this.style.animation = 'none';
            this.offsetHeight; // Trigger reflow
            this.style.animation = 'float 2s ease-in-out infinite';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.animation = 'none';
        });
    });
    
    // ========================================
    // Set Current Year in Footer
    // ========================================
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // ========================================
    // Parallax Effect for Hero Background
    // ========================================
    const heroBg = document.querySelector('.hero-bg img');
    
    if (heroBg && window.innerWidth > 768) {
        window.addEventListener('scroll', function() {
            const scrollY = window.scrollY;
            const heroHeight = document.querySelector('.hero').offsetHeight;
            
            if (scrollY < heroHeight) {
                heroBg.style.transform = `translateY(${scrollY * 0.3}px) scale(1.1)`;
            }
        });
        
        // Initial scale
        heroBg.style.transform = 'scale(1.1)';
    }
    
    // ========================================
    // Button Press Animation
    // ========================================
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('mousedown', function() {
            this.style.transform = this.classList.contains('btn-primary') 
                ? 'skewX(-5deg) scale(0.98)' 
                : 'scale(0.98)';
        });
        
        btn.addEventListener('mouseup', function() {
            this.style.transform = this.classList.contains('btn-primary') 
                ? 'skewX(-5deg) scale(1)' 
                : 'scale(1)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = this.classList.contains('btn-primary') 
                ? 'skewX(-5deg)' 
                : '';
        });
    });
    
    // ========================================
    // Phone Link Shake on Hover
    // ========================================
    const phoneLinks = document.querySelectorAll('.phone-link, .footer-phone');
    
    phoneLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.animation = 'shake 0.5s ease-in-out';
            }
        });
        
        link.addEventListener('mouseleave', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.animation = 'shake 2s infinite';
            }
        });
    });
    
    // ========================================
    // Badges Stagger Animation
    // ========================================
    const badges = document.querySelectorAll('.badge-item');
    
    const badgeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                badges.forEach((badge, index) => {
                    setTimeout(() => {
                        badge.style.opacity = '1';
                        badge.style.transform = 'translateX(0)';
                    }, index * 100);
                });
                badgeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    if (badges.length > 0) {
        badges.forEach(badge => {
            badge.style.opacity = '0';
            badge.style.transform = 'translateX(-20px)';
            badge.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
        
        badgeObserver.observe(document.querySelector('.badges-grid'));
    }
    
    // ========================================
    // License Highlight Glow Pulse
    // ========================================
    const licenseHighlight = document.querySelector('.license-highlight');
    
    if (licenseHighlight) {
        const pulseGlow = () => {
            licenseHighlight.style.boxShadow = '0 0 20px rgba(250, 204, 21, 0.3)';
            setTimeout(() => {
                licenseHighlight.style.boxShadow = '0 0 0px rgba(250, 204, 21, 0)';
            }, 1000);
        };
        
        // Initial delay then periodic pulse
        setTimeout(() => {
            pulseGlow();
            setInterval(pulseGlow, 3000);
        }, 2000);
    }
    
    // ========================================
    // CTA Section Particle Effect (Subtle)
    // ========================================
    const ctaSection = document.querySelector('.cta-section');
    
    if (ctaSection && window.innerWidth > 768) {
        const createParticle = () => {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: var(--primary-red);
                border-radius: 50%;
                pointer-events: none;
                opacity: 0.3;
                z-index: 0;
            `;
            
            particle.style.left = Math.random() * 100 + '%';
            particle.style.bottom = '0';
            
            ctaSection.appendChild(particle);
            
            // Animate upward
            let posY = 0;
            const speed = Math.random() * 2 + 1;
            const drift = (Math.random() - 0.5) * 2;
            
            const animateParticle = () => {
                posY += speed;
                particle.style.transform = `translateY(-${posY}px) translateX(${Math.sin(posY / 30) * 20 + drift * posY / 10}px)`;
                particle.style.opacity = Math.max(0, 0.3 - posY / 500);
                
                if (posY < 500) {
                    requestAnimationFrame(animateParticle);
                } else {
                    particle.remove();
                }
            };
            
            requestAnimationFrame(animateParticle);
        };
        
        // Create particles periodically
        setInterval(createParticle, 500);
    }
    
    // ========================================
    // Mobile Menu Toggle (If needed in future)
    // ========================================
    // Placeholder for mobile menu functionality
    // Currently not needed as nav is simple
    
    // ========================================
    // Performance: Debounce Scroll Events
    // ========================================
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // ========================================
    // Initialize Transition Styles
    // ========================================
    document.querySelectorAll('[data-en][data-es]').forEach(el => {
        el.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    });
    
    // ========================================
    // "Hablamos Español" bubble notification
    // ========================================
    const langBubble = document.getElementById('langBubble');

    if (langBubble) {
        let bubbleTimer;

        const showBubble = () => {
            langBubble.classList.remove('hide');
            langBubble.classList.add('show');
            bubbleTimer = setTimeout(hideBubble, 3800);
        };

        const hideBubble = () => {
            clearTimeout(bubbleTimer);
            langBubble.classList.remove('show');
            langBubble.classList.add('hide');
        };

        // Pop in 1.8 s after load so the hero has settled
        setTimeout(showBubble, 1800);

        // Dismiss immediately when the user clicks the toggle
        document.getElementById('langToggle').addEventListener('click', hideBubble, { once: true });

        // Dismiss on any click outside the bubble
        document.addEventListener('click', (e) => {
            if (!langBubble.contains(e.target) && e.target.id !== 'langToggle') {
                hideBubble();
            }
        });
    }

    // ========================================
    // Console Easter Egg
    // ========================================
    console.log('%c RED TRUCKING ', 'background: #E60000; color: white; font-size: 24px; font-weight: bold; padding: 10px 20px; border-radius: 4px;');
    console.log('%c 24/7 Diesel Truck Road Assistance ', 'color: #a1a1aa; font-size: 14px;');
    console.log('%c Call: (555) 123-4567 ', 'color: #FACC15; font-size: 12px;');
});
