/**
 * ===================================
 * GREEN GAMES - SETUP GUIDE
 * Interactive setup guide for new users
 * ===================================
 */

/**
 * Setup Guide System
 * Helps users understand how to add games and configure the platform
 */
class SetupGuide {
    constructor() {
        this.isVisible = false;
        this.currentStep = 0;
        this.steps = [
            {
                title: 'Welcome to Green Games!',
                content: 'This platform makes it easy to add and manage environmental games. Let\'s get you started!',
                action: 'Next'
            },
            {
                title: 'Adding Your First Game',
                content: 'To add a game, edit the <code>js/games-config.js</code> file and add your game configuration.',
                action: 'Show Me'
            },
            {
                title: 'Game Configuration',
                content: 'Each game needs: ID, title, icon, description, category, difficulty, and status.',
                action: 'Continue'
            },
            {
                title: 'Making It Live',
                content: 'Use GitHub Pages, Netlify, or Vercel to make your site live with a custom domain.',
                action: 'Finish'
            }
        ];
    }
    
    /**
     * Show the setup guide
     */
    show() {
        if (this.isVisible) return;
        
        this.createGuideModal();
        this.isVisible = true;
        this.currentStep = 0;
        this.updateStep();
    }
    
    /**
     * Hide the setup guide
     */
    hide() {
        const modal = document.getElementById('setupGuideModal');
        if (modal) {
            modal.remove();
        }
        this.isVisible = false;
    }
    
    /**
     * Create the guide modal
     */
    createGuideModal() {
        const modal = document.createElement('div');
        modal.id = 'setupGuideModal';
        modal.className = 'setup-guide-modal';
        modal.innerHTML = `
            <div class="setup-guide-content">
                <div class="setup-guide-header">
                    <h2 id="guideTitle">Setup Guide</h2>
                    <button class="close-guide" onclick="setupGuide.hide()">×</button>
                </div>
                <div class="setup-guide-body">
                    <div class="step-indicator">
                        <div class="step-progress"></div>
                    </div>
                    <div class="step-content" id="stepContent"></div>
                </div>
                <div class="setup-guide-footer">
                    <button class="guide-button secondary" onclick="setupGuide.hide()">Skip</button>
                    <button class="guide-button primary" id="guideAction" onclick="setupGuide.nextStep()">Next</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.injectGuideStyles();
    }
    
    /**
     * Update the current step
     */
    updateStep() {
        const step = this.steps[this.currentStep];
        const titleElement = document.getElementById('guideTitle');
        const contentElement = document.getElementById('stepContent');
        const actionButton = document.getElementById('guideAction');
        const progress = document.querySelector('.step-progress');
        
        if (titleElement) titleElement.textContent = step.title;
        if (contentElement) contentElement.innerHTML = step.content;
        if (actionButton) actionButton.textContent = step.action;
        
        if (progress) {
            const progressPercent = ((this.currentStep + 1) / this.steps.length) * 100;
            progress.style.width = `${progressPercent}%`;
        }
    }
    
    /**
     * Go to next step
     */
    nextStep() {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            this.updateStep();
        } else {
            this.hide();
        }
    }
    
    /**
     * Inject CSS styles for the guide
     */
    injectGuideStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Game Meta Information */
            .game-meta {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                margin: 1rem 0;
                font-size: 0.75rem;
            }
            
            .game-meta span {
                background: rgba(16, 185, 129, 0.1);
                color: var(--primary-green);
                padding: 0.25rem 0.5rem;
                border-radius: 12px;
                border: 1px solid var(--primary-green);
            }
            
            /* Coming Soon and Maintenance States */
            .game-card.coming-soon {
                opacity: 0.7;
                position: relative;
            }
            
            .game-card.coming-soon::after {
                content: 'COMING SOON';
                position: absolute;
                top: 10px;
                right: 10px;
                background: var(--primary-green);
                color: white;
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                font-size: 0.7rem;
                font-weight: bold;
            }
            
            .game-card.maintenance::after {
                content: 'MAINTENANCE';
                background: #f59e0b;
            }
            
            /* Empty State */
            .empty-state {
                text-align: center;
                padding: 4rem 2rem;
                color: var(--text-muted);
            }
            
            .empty-icon {
                font-size: 4rem;
                margin-bottom: 1rem;
            }
            
            .empty-state h3 {
                font-size: 1.5rem;
                margin-bottom: 1rem;
                color: var(--text-primary);
            }
            
            /* Notifications */
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--background-card);
                border: 1px solid var(--border-color);
                border-radius: 8px;
                padding: 1rem;
                box-shadow: var(--shadow-card);
                z-index: 1000;
                max-width: 400px;
                animation: slideInRight 0.3s ease-out;
            }
            
            .notification.info {
                border-left: 4px solid var(--primary-green);
            }
            
            .notification.error {
                border-left: 4px solid #ef4444;
            }
            
            .notification.success {
                border-left: 4px solid #22c55e;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .notification.fade-out {
                animation: fadeOut 0.3s ease-out;
            }
            
            /* Play Button States */
            .play-button.disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
            
            .play-button.disabled:hover {
                transform: none;
                background: var(--gradient-primary);
            }
            
            /* Loading and Error States */
            .game-loading {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 500px;
                background: var(--background-dark);
                color: var(--text-primary);
            }
            
            .loading-spinner {
                width: 40px;
                height: 40px;
                border: 3px solid var(--border-color);
                border-top: 3px solid var(--primary-green);
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 1rem;
            }
            
            .game-error {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 500px;
                background: var(--background-dark);
                color: var(--text-primary);
                text-align: center;
            }
            
            .error-icon {
                font-size: 3rem;
                margin-bottom: 1rem;
            }
            
            .error-title {
                font-size: 1.5rem;
                font-weight: bold;
                margin-bottom: 0.5rem;
            }
            
            .error-message {
                margin-bottom: 2rem;
                color: var(--text-muted);
            }
            
            .retry-button {
                background: var(--gradient-primary);
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                transition: var(--transition);
            }
            
            .retry-button:hover {
                transform: translateY(-2px);
                box-shadow: var(--shadow-primary);
            }
            
            /* Animations */
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            @keyframes slideInRight {
                0% {
                    transform: translateX(100%);
                    opacity: 0;
                }
                100% {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes fadeOut {
                0% {
                    opacity: 1;
                }
                100% {
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
} 