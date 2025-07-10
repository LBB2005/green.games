/**
 * ===================================
 * GREEN.GAMES - MAIN JAVASCRIPT
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
 * Main application class for Green.Games website
 * Handles navigation, animations, and core functionality
 */
class GreenGamesApp {
    constructor() {
        Logger.info('Initializing Green.Games application');
        
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
            this.setupGameCards();
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
                    
                    // Special handling for stat values
                    if (entry.target.classList.contains('stat-card')) {
                        const statValue = entry.target.querySelector('.stat-value');
                        if (statValue && !statValue.hasAttribute('data-animated')) {
                            this.animateStatValue(statValue);
                            statValue.setAttribute('data-animated', 'true');
                        }
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
            '.game-card',
            '.stat-card',
            '.feature-card',
            '.contact-card',
            '.mission-block',
            '.animated-globe'
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
     * Animate stat values with counting effect
     * @param {Element} statElement - The stat value element
     */
    animateStatValue(statElement) {
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
        
        // Enhanced globe animation interaction
        const animatedGlobe = document.querySelector('.animated-globe');
        if (animatedGlobe) {
            animatedGlobe.addEventListener('mouseenter', () => {
                const globeCore = animatedGlobe.querySelector('.globe-core');
                const globeRings = animatedGlobe.querySelectorAll('.globe-ring, .globe-ring-2');
                
                if (globeCore) {
                    globeCore.style.animationDuration = '2s';
                }
                
                globeRings.forEach(ring => {
                    ring.style.animationDuration = '8s';
                });
            });
            
            animatedGlobe.addEventListener('mouseleave', () => {
                const globeCore = animatedGlobe.querySelector('.globe-core');
                const globeRings = animatedGlobe.querySelectorAll('.globe-ring, .globe-ring-2');
                
                if (globeCore) {
                    globeCore.style.animationDuration = '4s';
                }
                
                globeRings.forEach((ring, index) => {
                    ring.style.animationDuration = index === 0 ? '20s' : '30s';
                });
            });
        }
    }
    
    /**
     * Setup game cards with click handlers and interactions
     * Handles game loading and visual feedback
     */
    setupGameCards() {
        Logger.debug('Setting up game card interactions');
        
        const gameCards = document.querySelectorAll('.game-card');
        gameCards.forEach(card => {
            const playButton = card.querySelector('.play-button');
            const gameType = card.getAttribute('data-game');
            
            if (playButton && gameType) {
                playButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    Logger.info('Game button clicked', { game: gameType });
                    this.loadGame(gameType, card.querySelector('h3').textContent);
                });
                
                // Add enhanced hover effects
                card.addEventListener('mouseenter', () => {
                    card.style.transform = 'translateY(-12px)';
                });
                
                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'translateY(-8px)';
                });
            }
        });
    }
    
    /**
     * Load and display a game in the game player
     * @param {string} gameType - The type/ID of the game to load
     * @param {string} gameTitle - The display title of the game
     */
    loadGame(gameType, gameTitle) {
        Logger.info('Loading game', { gameType, gameTitle });
        
        const gamePlayer = document.getElementById('gamePlayer');
        const gameFrame = document.getElementById('gameFrame');
        const currentGameTitle = document.getElementById('currentGameTitle');
        
        if (!gamePlayer || !gameFrame || !currentGameTitle) {
            Logger.error('Game player elements not found');
            return;
        }
        
        // Set game title
        currentGameTitle.textContent = gameTitle;
        
        // Load game iframe
        const gamePath = `games/${gameType}/index.html`;
        gameFrame.innerHTML = `<iframe src="${gamePath}" frameborder="0" allowfullscreen></iframe>`;
        
        // Show game player
        gamePlayer.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        Logger.info('Game loaded successfully', { gameType, gamePath });
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
        
        /* Enhanced scroll animations */
        .reveal {
            opacity: 0;
            transform: translateY(50px);
            transition: all 0.6s ease-out;
        }
        
        .reveal.active {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Game card stagger animation */
        .game-card:nth-child(1) { transition-delay: 0.1s; }
        .game-card:nth-child(2) { transition-delay: 0.2s; }
        .game-card:nth-child(3) { transition-delay: 0.3s; }
        .game-card:nth-child(4) { transition-delay: 0.4s; }
        .game-card:nth-child(5) { transition-delay: 0.5s; }
        .game-card:nth-child(6) { transition-delay: 0.6s; }
        
        /* Feature card stagger animation */
        .feature-card:nth-child(1) { transition-delay: 0.1s; }
        .feature-card:nth-child(2) { transition-delay: 0.2s; }
        .feature-card:nth-child(3) { transition-delay: 0.3s; }
        .feature-card:nth-child(4) { transition-delay: 0.4s; }
        .feature-card:nth-child(5) { transition-delay: 0.5s; }
        
        /* Smooth scrolling enhancement */
        html {
            scroll-behavior: smooth;
        }
        
        /* Keyboard navigation feedback */
        *:focus {
            outline: 2px solid var(--primary-green);
            outline-offset: 2px;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Global navigation function for hero feature clicks
 * Provides smooth scrolling to target sections with visual feedback
 * @param {string} targetSection - The section ID to navigate to (e.g., '#games', '#about', '#features')
 */
function navigateToSection(targetSection) {
    Logger.info('Hero feature navigation triggered', { target: targetSection });
    
    // Remove the # symbol if present
    const sectionId = targetSection.replace('#', '');
    
    // Use the app's scrollToSection method for smooth navigation
    if (window.app && window.app.scrollToSection) {
        window.app.scrollToSection(sectionId);
    } else {
        // Fallback for immediate navigation if app not ready
        const targetElement = document.getElementById(sectionId);
        if (targetElement) {
            const navbarHeight = 70; // Standard navbar height
            const targetPosition = targetElement.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            Logger.debug('Fallback navigation completed', { sectionId });
        } else {
            Logger.warn('Target section not found for navigation', { sectionId });
        }
    }
}

/**
 * Global function to close the game player
 * Hides the game overlay and restores normal page scrolling
 */
function closeGame() {
    Logger.info('Closing game player');
    
    const gamePlayer = document.getElementById('gamePlayer');
    const gameFrame = document.getElementById('gameFrame');
    
    if (gamePlayer) {
        gamePlayer.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Clear the game frame after animation
        setTimeout(() => {
            if (gameFrame) {
                gameFrame.innerHTML = '';
            }
        }, 300);
        
        Logger.info('Game player closed');
    }
}

// Initialize the application when the script loads
Logger.info('Loading Green.Games main script');

// Inject animation styles
injectAnimationStyles();

// Initialize the main application
const app = new GreenGamesApp();

// Expose app globally for navigation function
window.app = app;

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

Logger.info('Green.Games main script loaded successfully'); 