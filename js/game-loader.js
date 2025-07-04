/**
 * ===================================
 * GREEN GAMES - FLEXIBLE GAME LOADER
 * Enhanced game loading system with dynamic configuration
 * ===================================
 */

/**
 * GameLoader class for managing game loading and display
 * Now works with the flexible games configuration system
 */
class GameLoader {
    constructor() {
        Logger.info('Initializing Flexible Game Loader system');
        
        this.currentGame = null;
        this.gamePlayer = null;
        this.gameFrame = null;
        this.gameTitle = null;
        this.gamesGrid = null;
        this.emptyState = null;
        this.isLoading = false;
        this.loadTimeout = null;
        
        this.init();
    }
    
    /**
     * Initialize the game loader system
     * Sets up DOM references and loads games from configuration
     */
    init() {
        Logger.info('Setting up Flexible Game Loader components');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupGameLoader());
        } else {
            this.setupGameLoader();
        }
    }
    
    /**
     * Setup game loader after DOM is ready
     * Initializes DOM references and loads games from configuration
     */
    setupGameLoader() {
        Logger.debug('Setting up game loader DOM references');
        
        try {
            // Get DOM references
            this.gamePlayer = document.getElementById('gamePlayer');
            this.gameFrame = document.getElementById('gameFrame');
            this.gameTitle = document.getElementById('currentGameTitle');
            this.gamesGrid = document.getElementById('gamesGrid');
            this.emptyState = document.getElementById('emptyState');
            
            if (!this.gamePlayer || !this.gameFrame || !this.gameTitle || !this.gamesGrid) {
                throw new Error('Required game loader elements not found in DOM');
            }
            
            // Setup components
            this.setupKeyboardControls();
            this.setupMessageListener();
            this.createLoadingIndicator();
            this.loadGamesFromConfig();
            
            Logger.info('Flexible Game Loader initialized successfully');
        } catch (error) {
            Logger.error('Failed to initialize Flexible Game Loader', { error: error.message });
        }
    }
    
    /**
     * Load games from configuration and create game cards
     * Dynamically creates game cards based on GAMES_CONFIG
     */
    loadGamesFromConfig() {
        Logger.info('Loading games from configuration');
        
        const games = Object.values(GAMES_CONFIG);
        
        if (games.length === 0) {
            this.showEmptyState();
            return;
        }
        
        // Clear existing games
        this.gamesGrid.innerHTML = '';
        this.emptyState.style.display = 'none';
        
        // Create game cards
        games.forEach(game => {
            const gameCard = this.createGameCard(game);
            this.gamesGrid.appendChild(gameCard);
        });
        
        Logger.info(`Loaded ${games.length} games from configuration`);
    }
    
    /**
     * Create a game card element
     * @param {Object} game - Game configuration object
     * @returns {HTMLElement} Game card element
     */
    createGameCard(game) {
        const card = document.createElement('div');
        card.className = 'game-card';
        
        // Add status-specific styling
        if (game.status === 'coming-soon') {
            card.classList.add('coming-soon');
        } else if (game.status === 'maintenance') {
            card.classList.add('maintenance');
        }
        
        // Create card content
        card.innerHTML = `
            <div class="game-icon">${game.icon}</div>
            <h3>${game.title}</h3>
            <p>${game.description}</p>
            <div class="game-meta">
                <span class="game-category">${game.category}</span>
                <span class="game-difficulty">${game.difficulty}</span>
                <span class="game-time">${game.estimatedTime}</span>
            </div>
            <button class="play-button ${game.status !== 'available' ? 'disabled' : ''}">
                ${this.getButtonText(game.status)}
            </button>
        `;
        
        // Add click handler
        if (game.status === 'available') {
            card.onclick = () => this.loadGame(game.id);
        } else {
            card.onclick = () => this.showGameStatusMessage(game);
        }
        
        return card;
    }
    
    /**
     * Get button text based on game status
     * @param {string} status - Game status
     * @returns {string} Button text
     */
    getButtonText(status) {
        switch (status) {
            case 'available':
                return 'Play Now';
            case 'coming-soon':
                return 'Coming Soon';
            case 'maintenance':
                return 'Maintenance';
            default:
                return 'Unavailable';
        }
    }
    
    /**
     * Show message for games that aren't available
     * @param {Object} game - Game configuration object
     */
    showGameStatusMessage(game) {
        let message = '';
        
        switch (game.status) {
            case 'coming-soon':
                message = `${game.title} is coming soon! Check back later for this exciting ${game.category.toLowerCase()} game.`;
                break;
            case 'maintenance':
                message = `${game.title} is currently under maintenance. Please try again later.`;
                break;
            default:
                message = `${game.title} is currently unavailable.`;
        }
        
        this.showNotification(message, 'info');
    }
    
    /**
     * Show a notification message
     * @param {string} message - Message to display
     * @param {string} type - Notification type ('info', 'error', 'success')
     */
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    /**
     * Get icon for notification type
     * @param {string} type - Notification type
     * @returns {string} Icon emoji
     */
    getNotificationIcon(type) {
        switch (type) {
            case 'info':
                return 'ℹ️';
            case 'error':
                return '❌';
            case 'success':
                return '✅';
            default:
                return '📢';
        }
    }
    
    /**
     * Show empty state when no games are available
     */
    showEmptyState() {
        this.gamesGrid.innerHTML = '';
        this.emptyState.style.display = 'block';
        Logger.info('Showing empty state - no games configured');
    }
    
    /**
     * Setup keyboard controls for game player
     */
    setupKeyboardControls() {
        Logger.debug('Setting up keyboard controls for game player');
        
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.currentGame) {
                this.closeGame();
                Logger.debug('Game closed via Escape key');
            }
        });
    }
    
    /**
     * Setup message listener for iframe communication
     */
    setupMessageListener() {
        Logger.debug('Setting up message listener for iframe communication');
        
        window.addEventListener('message', (event) => {
            if (event.data && event.data.action === 'closeGame') {
                Logger.debug('Received close game message from iframe');
                this.closeGame();
            }
        });
    }
    
    /**
     * Create loading indicator
     */
    createLoadingIndicator() {
        // Add loading styles
        this.injectStyles();
        Logger.debug('Loading indicator created');
    }
    
    /**
     * Load a specific game
     * @param {string} gameId - ID of the game to load
     */
    loadGame(gameId) {
        Logger.info('Loading game', { gameId });
        
        const game = GamesConfigUtils.getGame(gameId);
        if (!game) {
            Logger.error('Game not found in configuration', { gameId });
            this.showNotification('Game not found', 'error');
            return;
        }
        
        if (game.status !== 'available') {
            this.showGameStatusMessage(game);
            return;
        }
        
        this.currentGame = gameId;
        this.updateGameInfo(game);
        this.showGamePlayer();
        this.showLoading();
        
        // Set loading timeout
        this.loadTimeout = setTimeout(() => {
            this.onGameError('Game loading timed out');
        }, SITE_CONFIG.gameSettings.loadTimeout);
        
        // Load the game
        this.createGameIframe(gameId, game);
    }
    
    /**
     * Create iframe for game
     * @param {string} gameId - Game ID
     * @param {Object} game - Game configuration
     */
    createGameIframe(gameId, game) {
        const gamePath = GamesConfigUtils.getGamePath(gameId);
        
        const iframe = document.createElement('iframe');
        iframe.src = gamePath;
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.frameBorder = '0';
        iframe.allow = 'fullscreen';
        
        iframe.onload = () => {
            this.onGameLoaded();
        };
        
        iframe.onerror = () => {
            this.onGameError('Failed to load game');
        };
        
        // Clear loading and add iframe
        this.hideLoading();
        this.gameFrame.appendChild(iframe);
        
        Logger.debug('Game iframe created', { gameId, gamePath });
    }
    
    /**
     * Update game information display
     * @param {Object} game - Game configuration
     */
    updateGameInfo(game) {
        this.gameTitle.textContent = game.title;
    }
    
    /**
     * Show game player interface
     */
    showGamePlayer() {
        Logger.debug('Showing game player interface');
        
        this.gamePlayer.classList.add('active');
        
        setTimeout(() => {
            this.gamePlayer.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }, 100);
    }
    
    /**
     * Close current game
     */
    closeGame() {
        Logger.info('Closing current game', { gameId: this.currentGame });
        
        this.clearLoadingTimeout();
        this.isLoading = false;
        this.currentGame = null;
        
        // Clear game frame
        this.gameFrame.innerHTML = '';
        
        // Hide game player
        this.gamePlayer.classList.remove('active');
        
        // Scroll back to games
        document.getElementById('games').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
    
    /**
     * Handle successful game loading
     */
    onGameLoaded() {
        Logger.debug('Game loaded successfully');
        this.isLoading = false;
        this.clearLoadingTimeout();
        this.hideLoading();
    }
    
    /**
     * Handle game loading errors
     * @param {string} errorMessage - Error message
     */
    onGameError(errorMessage) {
        Logger.error('Game loading error', { error: errorMessage });
        this.isLoading = false;
        this.clearLoadingTimeout();
        this.showError('Game Loading Error', errorMessage);
    }
    
    /**
     * Show loading indicator
     */
    showLoading() {
        const loadingHTML = `
            <div class="game-loading">
                <div class="loading-spinner">
                    <div class="spinner-ring"></div>
                </div>
                <div class="loading-text">
                    <h3>Loading Game...</h3>
                    <p>Preparing your eco-adventure</p>
                </div>
            </div>
        `;
        this.gameFrame.innerHTML = loadingHTML;
    }
    
    /**
     * Hide loading indicator
     */
    hideLoading() {
        const loadingElement = this.gameFrame.querySelector('.game-loading');
        if (loadingElement) {
            loadingElement.remove();
        }
    }
    
    /**
     * Show error message
     * @param {string} title - Error title
     * @param {string} message - Error message
     */
    showError(title, message) {
        const errorHTML = `
            <div class="game-error">
                <div class="error-icon">⚠️</div>
                <div class="error-title">${title}</div>
                <div class="error-message">${message}</div>
                <button class="retry-button" onclick="gameLoader.retryCurrentGame()">
                    Try Again
                </button>
            </div>
        `;
        this.gameFrame.innerHTML = errorHTML;
    }
    
    /**
     * Retry loading current game
     */
    retryCurrentGame() {
        if (this.currentGame) {
            const gameId = this.currentGame;
            this.currentGame = null;
            this.loadGame(gameId);
        }
    }
    
    /**
     * Clear loading timeout
     */
    clearLoadingTimeout() {
        if (this.loadTimeout) {
            clearTimeout(this.loadTimeout);
            this.loadTimeout = null;
        }
    }
    
    /**
     * Inject CSS styles for game loader
     */
    injectStyles() {
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
    
    /**
     * Refresh games from configuration
     * Useful for dynamically adding games
     */
    refreshGames() {
        Logger.info('Refreshing games from configuration');
        this.loadGamesFromConfig();
    }
}

// Global functions for backwards compatibility
function playGame(gameId) {
    if (window.gameLoader) {
        window.gameLoader.loadGame(gameId);
    }
}

function closeGame() {
    if (window.gameLoader) {
        window.gameLoader.closeGame();
    }
}

// Initialize game loader
window.gameLoader = new GameLoader(); 