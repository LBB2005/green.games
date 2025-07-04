/**
 * ===================================
 * GREEN GAMES - MAIN JAVASCRIPT
 * Enhanced interactivity and smooth user experience
 * ===================================
 */

/**
 * Logger utility for consistent logging throughout the application
 * Follows Winston-style logging with different levels
 */
const Logger = {
    levels: {
        ERROR: 0,
        WARN: 1,
        INFO: 2,
        DEBUG: 3
    },
    
    currentLevel: 2, // INFO level by default
    
    /**
     * Log error messages for critical issues
     * @param {string} message - Error message to log
     * @param {Object} data - Additional error data
     */
    error: function(message, data = {}) {
        if (this.currentLevel >= this.levels.ERROR) {
            console.error(`[GREEN-GAMES ERROR] ${message}`, data);
        }
    },
    
    /**
     * Log warning messages for potential issues
     * @param {string} message - Warning message to log
     * @param {Object} data - Additional warning data
     */
    warn: function(message, data = {}) {
        if (this.currentLevel >= this.levels.WARN) {
            console.warn(`[GREEN-GAMES WARN] ${message}`, data);
        }
    },
    
    /**
     * Log informational messages for workflow tracking
     * @param {string} message - Info message to log
     * @param {Object} data - Additional info data
     */
    info: function(message, data = {}) {
        if (this.currentLevel >= this.levels.INFO) {
            console.log(`[GREEN-GAMES INFO] ${message}`, data);
        }
    },
    
    /**
     * Log debug messages for development tracking
     * @param {string} message - Debug message to log
     * @param {Object} data - Additional debug data
     */
    debug: function(message, data = {}) {
        if (this.currentLevel >= this.levels.DEBUG) {
            console.log(`[GREEN-GAMES DEBUG] ${message}`, data);
        }
    }
};

/**
 * Main application class for Green Games website
 * Handles navigation, animations, and core functionality
 */
class GreenGamesApp {
    constructor() {
        Logger.info('Initializing Green Games application');
        
        this.isScrolling = false;
        this.lastScrollTop = 0;
        this.activeSection = 'home';
        this.sections = ['home', 'about', 'features', 'games', 'contact'];
        
        // Initialize application components
        this.init();
    }
    
    /**
     * Initialize all application components and event listeners
     * Sets up navigation, scroll handlers, and interactive elements
     */
    init() {
        Logger.info('Setting up application components');
        
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupComponents());
        } else {
            this.setupComponents();
        }
    }
    
    /**
     * Setup all interactive components after DOM is ready
     * Initializes navigation, scroll effects, and animations
     */
    setupComponents() {
        Logger.info('DOM loaded, setting up interactive components');
        
        try {
            this.setupNavigation();
            this.setupScrollEffects();
            this.setupAnimations();
            this.setupInteractiveElements();
            this.setupScrollReveal();
            
            Logger.info('All components initialized successfully');
        } catch (error) {
            Logger.error('Failed to initialize components', { error: error.message });
        }
    }
    
    /**
     * Setup navigation functionality
     * Handles smooth scrolling and active state management
     */
    setupNavigation() {
        Logger.debug('Setting up navigation system');
        
        const navLinks = document.querySelectorAll('.nav-links a');
        const scrollIndicator = document.querySelector('.scroll-indicator');
        
        // Handle navigation link clicks for smooth scrolling
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
                
                Logger.debug('Navigation clicked', { target: targetId });
            });
        });
        
        // Handle scroll indicator click
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                this.scrollToSection('about');
                Logger.debug('Scroll indicator clicked');
            });
        }
        
        // Update active navigation based on scroll position
        window.addEventListener('scroll', () => this.updateActiveNavigation());
    }
    
    /**
     * Smooth scroll to a specific section
     * @param {string} sectionId - ID of the section to scroll to
     */
    scrollToSection(sectionId) {
        Logger.debug('Scrolling to section', { sectionId });
        
        const targetSection = document.getElementById(sectionId);
        
        if (targetSection) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetSection.offsetTop - navbarHeight;
            
            // Smooth scroll with custom easing
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Update active section
            this.activeSection = sectionId;
        } else {
            Logger.warn('Target section not found', { sectionId });
        }
    }
    
    /**
     * Update active navigation link based on current scroll position
     * Highlights the current section in the navigation menu
     */
    updateActiveNavigation() {
        if (this.isScrolling) return;
        
        const navLinks = document.querySelectorAll('.nav-links a');
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const scrollPosition = window.scrollY + navbarHeight + 100;
        
        let currentSection = 'home';
        
        // Determine which section is currently in view
        this.sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    currentSection = sectionId;
                }
            }
        });
        
        // Update active navigation link
        navLinks.forEach(link => {
            const linkTarget = link.getAttribute('href').substring(1);
            if (linkTarget === currentSection) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Update active section
        this.activeSection = currentSection;
    }
    
    /**
     * Setup scroll effects for navbar and other elements
     * Adds dynamic effects based on scroll position
     */
    setupScrollEffects() {
        Logger.debug('Setting up scroll effects');
        
        const navbar = document.querySelector('.navbar');
        
        const updateScrollEffects = () => {
            const scrollTop = window.scrollY;
            
            // Navbar background opacity based on scroll
            if (scrollTop > 50) {
                navbar.style.background = 'rgba(15, 23, 42, 0.98)';
                navbar.style.backdropFilter = 'blur(25px)';
            } else {
                navbar.style.background = 'rgba(15, 23, 42, 0.95)';
                navbar.style.backdropFilter = 'blur(20px)';
            }
            
            // Add parallax effect to hero section
            const hero = document.querySelector('.hero');
            if (hero && scrollTop < hero.offsetHeight) {
                hero.style.transform = `translateY(${scrollTop * 0.5}px)`;
            }
            
            this.lastScrollTop = scrollTop;
        };
        
        // Throttle scroll events for better performance
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateScrollEffects();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    /**
     * Setup scroll reveal animations
     * Animates elements as they come into view
     */
    setupScrollReveal() {
        Logger.debug('Setting up scroll reveal animations');
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Special handling for stat numbers
                    if (entry.target.classList.contains('stat-number')) {
                        this.animateStatNumber(entry.target);
                    }
                    
                    // Special handling for feature cards
                    if (entry.target.classList.contains('feature-card')) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, Math.random() * 300);
                    }
                }
            });
        }, observerOptions);
        
        // Observe elements for scroll animations
        const elementsToObserve = document.querySelectorAll([
            '.about-text h3',
            '.about-text p',
            '.stat-item',
            '.feature-card',
            '.contact-option',
            '.planet-animation',
            '.earth-container'
        ].join(','));
        
        elementsToObserve.forEach(element => {
            // Add initial styles for animation
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            
            observer.observe(element);
        });
    }
    
    /**
     * Animate stat numbers with counting effect
     * @param {Element} statElement - The stat number element
     */
    animateStatNumber(statElement) {
        const targetText = statElement.textContent;
        const targetNumber = parseInt(targetText.replace(/[^0-9]/g, ''));
        
        if (isNaN(targetNumber)) return;
        
        const duration = 2000;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentNumber = Math.floor(targetNumber * progress);
            const suffix = targetText.includes('+') ? '+' : '';
            const prefix = targetText.includes('%') ? '' : '';
            const postfix = targetText.includes('%') ? '%' : '';
            
            statElement.textContent = prefix + currentNumber + postfix + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    /**
     * Setup animations for various elements
     * Adds floating animations and other visual effects
     */
    setupAnimations() {
        Logger.debug('Setting up element animations');
        
        // Add staggered animations to feature cards
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
        
        // Add hover animations to social links
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'translateY(-3px) scale(1.1)';
            });
            
            link.addEventListener('mouseleave', () => {
                link.style.transform = 'translateY(0) scale(1)';
            });
        });
        
        // Enhanced planet animation interaction
        const planetAnimation = document.querySelector('.planet-animation');
        if (planetAnimation) {
            planetAnimation.addEventListener('mouseenter', () => {
                const planet = planetAnimation.querySelector('.planet');
                const orbits = planetAnimation.querySelectorAll('.orbit');
                
                if (planet) {
                    planet.style.animationDuration = '5s';
                }
                
                orbits.forEach(orbit => {
                    orbit.style.animationDuration = '3s';
                });
            });
            
            planetAnimation.addEventListener('mouseleave', () => {
                const planet = planetAnimation.querySelector('.planet');
                const orbits = planetAnimation.querySelectorAll('.orbit');
                
                if (planet) {
                    planet.style.animationDuration = '20s';
                }
                
                orbits.forEach((orbit, index) => {
                    orbit.style.animationDuration = index === 0 ? '10s' : '15s';
                });
            });
        }
    }
    
    /**
     * Setup interactive elements and hover effects
     * Enhances user interaction with visual feedback
     */
    setupInteractiveElements() {
        Logger.debug('Setting up interactive elements');
        
        // Enhanced hero feature interactions
        const heroFeatures = document.querySelectorAll('.hero-feature');
        heroFeatures.forEach(feature => {
            feature.addEventListener('mouseenter', () => {
                this.handleHeroFeatureHover(feature, true);
            });
            
            feature.addEventListener('mouseleave', () => {
                this.handleHeroFeatureHover(feature, false);
            });
        });
        
        // Contact option interactions
        const contactOptions = document.querySelectorAll('.contact-option');
        contactOptions.forEach(option => {
            option.addEventListener('mouseenter', () => {
                option.style.transform = 'translateX(15px) scale(1.02)';
            });
            
            option.addEventListener('mouseleave', () => {
                option.style.transform = 'translateX(0) scale(1)';
            });
        });
        
        // Footer section animations
        const footerSections = document.querySelectorAll('.footer-section');
        footerSections.forEach(section => {
            section.addEventListener('mouseenter', () => {
                section.style.transform = 'translateY(-5px)';
            });
            
            section.addEventListener('mouseleave', () => {
                section.style.transform = 'translateY(0)';
            });
        });
    }
    
    /**
     * Handle hero feature hover effects with enhanced animations
     * @param {Element} feature - The hero feature element
     * @param {boolean} isHovering - Whether the feature is being hovered
     */
    handleHeroFeatureHover(feature, isHovering) {
        const icon = feature.querySelector('.hero-feature-icon');
        const featureType = feature.getAttribute('data-feature');
        
        if (isHovering) {
            // Add enhanced hover effects based on feature type
            if (featureType === 'gaming') {
                this.triggerParticleEffect(feature);
            } else if (featureType === 'climate') {
                this.triggerGlowEffect(feature);
            } else if (featureType === 'eco') {
                this.triggerWaveEffect(feature);
            }
            
            Logger.debug('Hero feature hovered', { featureType });
        }
    }
    
    /**
     * Trigger particle effect for gaming feature
     * @param {Element} feature - The feature element
     */
    triggerParticleEffect(feature) {
        const particles = feature.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            setTimeout(() => {
                particle.style.opacity = '1';
                particle.style.transform = 'scale(1.5)';
            }, index * 100);
        });
    }
    
    /**
     * Trigger glow effect for climate feature
     * @param {Element} feature - The feature element
     */
    triggerGlowEffect(feature) {
        const glow = feature.querySelector('.feature-glow');
        if (glow) {
            glow.style.opacity = '1';
            glow.style.transform = 'scale(1.1)';
        }
    }
    
    /**
     * Trigger wave effect for eco feature
     * @param {Element} feature - The feature element
     */
    triggerWaveEffect(feature) {
        const waves = feature.querySelectorAll('.wave');
        waves.forEach((wave, index) => {
            setTimeout(() => {
                wave.style.opacity = '1';
                wave.style.animation = `waveMove 1.5s ease-in-out infinite`;
            }, index * 200);
        });
    }
    
    /**
     * Utility method to check if an element is in viewport
     * @param {Element} element - Element to check
     * @returns {boolean} - Whether element is in viewport
     */
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
}

/**
 * Add CSS for animation effects
 * Dynamically injects styles for scroll-triggered animations
 */
function injectAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .stat-number {
            font-weight: 800;
            color: var(--primary-green);
        }
        
        .feature-card {
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .contact-option {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .footer-section {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hero-feature {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .social-link {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Enhanced particle effects */
        .particle {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .feature-glow {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .wave {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Smooth scrolling enhancement */
        html {
            scroll-behavior: smooth;
        }
    `;
    document.head.appendChild(style);
}

// Initialize the application when the script loads
Logger.info('Loading Green Games main script');

// Inject animation styles
injectAnimationStyles();

// Initialize the main application
const app = new GreenGamesApp();

// Expose app instance globally for debugging (development only)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.GreenGamesApp = app;
    Logger.debug('Development mode: App instance exposed globally');
}

// Handle page visibility changes for performance optimization
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        Logger.debug('Page hidden - pausing non-essential animations');
        // Pause heavy animations when page is hidden
        document.querySelectorAll('.planet, .earth, .orbit').forEach(element => {
            element.style.animationPlayState = 'paused';
        });
    } else {
        Logger.debug('Page visible - resuming animations');
        // Resume animations when page is visible
        document.querySelectorAll('.planet, .earth, .orbit').forEach(element => {
            element.style.animationPlayState = 'running';
        });
    }
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        const currentIndex = app.sections.indexOf(app.activeSection);
        const nextIndex = Math.min(currentIndex + 1, app.sections.length - 1);
        app.scrollToSection(app.sections[nextIndex]);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        const currentIndex = app.sections.indexOf(app.activeSection);
        const prevIndex = Math.max(currentIndex - 1, 0);
        app.scrollToSection(app.sections[prevIndex]);
    }
});

Logger.info('Green Games main script loaded successfully'); 