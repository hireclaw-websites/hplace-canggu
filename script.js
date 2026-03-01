/**
 * HPlace - Interactive JavaScript
 * Smooth animations, scroll effects, and interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Hide loader
    const loader = document.querySelector('.loader');
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 1500);

    // Navigation scroll effect
    const nav = document.querySelector('.nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                
                // Animate counters if this is a stat item
                if (entry.target.classList.contains('stat-item')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe elements with data-aos
    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });

    // Observe stat items
    document.querySelectorAll('.stat-item').forEach(el => {
        observer.observe(el);
    });

    // Counter animation
    function animateCounter(element) {
        const valueEl = element.querySelector('.stat-value');
        if (!valueEl || valueEl.classList.contains('counted')) return;
        
        const target = parseFloat(valueEl.dataset.count);
        const isDecimal = target % 1 !== 0;
        const duration = 2000;
        const start = performance.now();
        
        valueEl.classList.add('counted');
        
        function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out expo
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = target * easeProgress;
            
            valueEl.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                valueEl.textContent = isDecimal ? target.toFixed(1) : target;
            }
        }
        
        requestAnimationFrame(update);
    }

    // Gallery lightbox (simple implementation)
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img) {
                openLightbox(img.src, img.alt);
            }
        });
    });

    function openLightbox(src, alt) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-overlay"></div>
            <div class="lightbox-content">
                <img src="${src}" alt="${alt}">
                <button class="lightbox-close">×</button>
            </div>
        `;
        
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';
        
        // Animate in
        requestAnimationFrame(() => {
            lightbox.classList.add('active');
        });
        
        // Close handlers
        const close = () => {
            lightbox.classList.remove('active');
            setTimeout(() => {
                lightbox.remove();
                document.body.style.overflow = '';
            }, 300);
        };
        
        lightbox.querySelector('.lightbox-close').addEventListener('click', close);
        lightbox.querySelector('.lightbox-overlay').addEventListener('click', close);
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') close();
        }, { once: true });
    }

    // Parallax effect for hero
    const heroBg = document.querySelector('.hero-bg-layer');
    
    if (heroBg && !window.matchMedia('(pointer: coarse)').matches) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.4;
            heroBg.style.transform = `translateY(${rate}px) scale(1.1)`;
        });
    }

    // Mobile menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Add lightbox styles dynamically
    const lightboxStyles = document.createElement('style');
    lightboxStyles.textContent = `
        .lightbox {
            position: fixed;
            inset: 0;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .lightbox.active {
            opacity: 1;
        }
        
        .lightbox-overlay {
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.95);
            cursor: pointer;
        }
        
        .lightbox-content {
            position: relative;
            z-index: 1;
            max-width: 90vw;
            max-height: 90vh;
        }
        
        .lightbox-content img {
            max-width: 100%;
            max-height: 90vh;
            object-fit: contain;
            border-radius: 8px;
        }
        
        .lightbox-close {
            position: absolute;
            top: -50px;
            right: 0;
            width: 40px;
            height: 40px;
            background: none;
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            font-size: 24px;
            cursor: pointer;
            border-radius: 50%;
            transition: all 0.2s ease;
        }
        
        .lightbox-close:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: white;
        }
    `;
    document.head.appendChild(lightboxStyles);

    // Reveal animations on scroll
    const revealElements = document.querySelectorAll('.section-header, .experience-card, .menu-category, .review-card');
    
    revealElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`;
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        revealObserver.observe(el);
    });
});
