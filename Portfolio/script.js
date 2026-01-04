// Particles System
class ParticlesSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.maxParticles = 100;
        
        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.animate();
        this.addEventListeners();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = Math.max(window.innerHeight, document.documentElement.scrollHeight);
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    addEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });

        window.addEventListener('scroll', () => {
            this.resize();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach((particle, index) => {
            // Move particles
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;

            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.x -= (dx / distance) * force * 0.5;
                particle.y -= (dy / distance) * force * 0.5;
            }

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(99, 102, 241, ${particle.opacity})`;
            this.ctx.fill();

            // Draw connections
            this.particles.slice(index + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.strokeStyle = `rgba(99, 102, 241, ${0.2 * (1 - distance / 150)})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            });
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Page Navigation System
class PageNavigation {
    constructor() {
        this.currentPage = 'hero';
        this.pages = document.querySelectorAll('.page-section');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
            });
        });

        // Mobile menu toggle
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }

        // Close mobile menu on link click
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });

        // Update active nav link on scroll
        window.addEventListener('scroll', () => {
            this.updateActiveNavLink();
        });

        // Initialize - show all sections
        this.pages.forEach((page) => {
            page.classList.add('active');
        });
    }

    scrollToSection(pageId) {
        const targetPage = document.getElementById(pageId);
        if (!targetPage) return;

        const navHeight = document.querySelector('.nav-container').offsetHeight;
        const targetPosition = targetPage.offsetTop - navHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        // Update nav links
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${pageId}`) {
                link.classList.add('active');
            }
        });

        // Trigger animations based on page
        setTimeout(() => {
            this.triggerPageAnimations(pageId);
        }, 500);
    }

    updateActiveNavLink() {
        const scrollPosition = window.scrollY + 100;
        
        this.pages.forEach(page => {
            const pageTop = page.offsetTop;
            const pageBottom = pageTop + page.offsetHeight;
            
            if (scrollPosition >= pageTop && scrollPosition < pageBottom) {
                const pageId = page.id;
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${pageId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    triggerPageAnimations(pageId) {
        switch(pageId) {
            case 'projects':
                this.animateProjects();
                break;
            case 'skills':
                this.animateSkills();
                break;
            case 'articles':
                this.animateArticles();
                break;
        }
    }

    animateProjects() {
        // Only animate project cards that are visible (not hidden by CSS)
        const projectCards = Array.from(document.querySelectorAll('.project-card')).filter(card => {
            return window.getComputedStyle(card).display !== 'none';
        });

        projectCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('visible');
            }, index * 100);
        });
    }

    animateSkills() {
        const skillItems = document.querySelectorAll('.skill-item');
        skillItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('visible');
                const progressBar = item.querySelector('.skill-progress');
                if (progressBar) {
                    const progress = progressBar.getAttribute('data-progress');
                    setTimeout(() => {
                        progressBar.style.width = `${progress}%`;
                    }, 200);
                }
            }, index * 100);
        });
    }

    animateArticles() {
        const articleCards = document.querySelectorAll('.article-card');
        articleCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('visible');
            }, index * 150);
        });
    }
}

// Form Validation
class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.init();
    }

    init() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validate()) {
                this.submitForm();
            }
        });

        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });
    }

    validateField(field) {
        const fieldGroup = field.closest('.form-group');
        const errorSpan = fieldGroup.querySelector('.form-error');
        let isValid = true;
        let errorMessage = '';

        // Remove previous error state
        fieldGroup.classList.remove('error');

        // Check if required field is empty
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && field.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Update error state
        if (!isValid) {
            fieldGroup.classList.add('error');
            errorSpan.textContent = errorMessage;
        } else {
            errorSpan.textContent = '';
        }

        return isValid;
    }

    validate() {
        const inputs = this.form.querySelectorAll('input, textarea');
        let isFormValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        return isFormValid;
    }

    submitForm() {
        // Simulate form submission
        const submitBtn = this.form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            this.showSuccess();
            this.form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            // Remove error states
            this.form.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('error');
                group.querySelector('.form-error').textContent = '';
            });
        }, 2000);
    }

    showSuccess() {
        const successDiv = document.getElementById('form-success');
        if (successDiv) {
            successDiv.classList.add('show');
            setTimeout(() => {
                successDiv.classList.remove('show');
            }, 5000);
        }
    }
}

// Resume Download Handler
class ResumeHandler {
    constructor() {
        this.init();
    }

    init() {
        const resumeBtn = document.getElementById('resume-download');
        if (resumeBtn) {
            resumeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleDownload();
            });
        }
    }

    handleDownload() {
        // Create a sample PDF link (replace with actual resume URL)
        const link = document.createElement('a');
        link.href = '#'; // Replace with actual resume PDF URL
        link.download = 'resume.pdf';
        
        // Animate button
        const btn = document.getElementById('resume-download');
        btn.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
            // Uncomment when you have actual resume:
            // link.click();
            
            // Show notification
            this.showNotification('Resume download started!');
        }, 200);
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: rgba(99, 102, 241, 0.9);
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Intersection Observer for Lazy Loading
class LazyLoader {
    constructor() {
        this.init();
    }

    init() {
        const observerOptions = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe project cards
        document.querySelectorAll('.project-card').forEach(card => {
            observer.observe(card);
        });

        // Observe article cards
        document.querySelectorAll('.article-card').forEach(card => {
            observer.observe(card);
        });
    }
}

// Smooth Scroll Enhancement
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        // Add smooth scroll behavior to all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href !== '#' && href.length > 1) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }
}

// 3D Icon Interactions
class Icon3DInteractions {
    constructor() {
        this.init();
    }

    init() {
        const icons = document.querySelectorAll('.icon-3d');
        icons.forEach(icon => {
            icon.addEventListener('mousemove', (e) => {
                const rect = icon.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                icon.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
            });

            icon.addEventListener('mouseleave', () => {
                icon.style.transform = '';
            });
        });
    }
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Particles
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        new ParticlesSystem(canvas);
    }

    // Initialize Navigation
    window.pageNavigation = new PageNavigation();

    // Initialize Form Validator
    new FormValidator('contact-form');

    // Initialize Resume Handler
    new ResumeHandler();

    // Initialize Lazy Loader
    new LazyLoader();

    // Initialize Smooth Scroll
    new SmoothScroll();

    // Initialize 3D Icon Interactions
    new Icon3DInteractions();

    // Trigger animations when sections come into view
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                const pageNav = window.pageNavigation;
                if (pageNav) {
                    pageNav.triggerPageAnimations(sectionId);
                }
                animationObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.page-section').forEach(section => {
        animationObserver.observe(section);
    });

    // Add parallax effect to gradient blurs
    window.addEventListener('mousemove', (e) => {
        const gradientBlurs = document.querySelectorAll('.gradient-blur');
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        gradientBlurs.forEach((blur, index) => {
            const speed = (index % 3 + 1) * 0.02;
            const x = (mouseX - 0.5) * 100 * speed;
            const y = (mouseY - 0.5) * 100 * speed;
            blur.style.transform = `translate(${x}px, ${y}px)`;
        });
    });

    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('.animate-fade-in, .animate-slide-up, .animate-scale-in').forEach(el => {
        scrollObserver.observe(el);
    });
});

// Modal: Resume preview open/close
(function() {
    const openBtn = document.getElementById('nav-details-btn');
    const modal = document.getElementById('resume-modal');
    const backdrop = document.getElementById('resume-modal-backdrop');
    const closeBtn = document.getElementById('resume-modal-close');
    const triggers = document.querySelectorAll('.open-resume-modal');

    if (!modal) return;

    function openModal() {
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (openBtn) {
        openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    }

    if (triggers && triggers.length) {
        triggers.forEach(t => t.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        }));
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
            closeModal();
        }
    });

    // Wire modal download link: if resume file missing, show a small notice
    const modalDownload = document.getElementById('modal-resume-download');
    if (modalDownload) {
        modalDownload.addEventListener('click', (e) => {
            // Let browser handle download; if file missing, fallback handled by server
        });
    }
})();

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is not visible
        document.body.style.animationPlayState = 'paused';
    } else {
        document.body.style.animationPlayState = 'running';
    }
});

