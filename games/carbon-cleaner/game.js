/**
 * ===================================
 * CARBON CLEANER - GAME LOGIC
 * Side-scrolling platformer with eco-friendly theme
 * ===================================
 */

/**
 * Game Logger for Carbon Cleaner
 * Tracks game events and debugging information
 */
const GameLogger = {
    info: (message, data = {}) => console.log(`[CARBON-CLEANER] ${message}`, data),
    warn: (message, data = {}) => console.warn(`[CARBON-CLEANER] ${message}`, data),
    error: (message, data = {}) => console.error(`[CARBON-CLEANER] ${message}`, data),
    debug: (message, data = {}) => console.log(`[CARBON-CLEANER DEBUG] ${message}`, data)
};

/**
 * Main Carbon Cleaner Game Class
 * Handles all game mechanics, rendering, and state management
 */
class CarbonCleanerGame {
    constructor() {
        GameLogger.info('Initializing Carbon Cleaner game');
        
        // Canvas and rendering setup
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Game state
        this.gameState = 'start'; // start, playing, paused, gameOver
        this.score = 0;
        this.level = 1;
        this.health = 3;
        this.gameTime = 0;
        
        // Player properties
        this.player = {
            x: 100,
            y: 400,
            width: 30,
            height: 40,
            velocityX: 0,
            velocityY: 0,
            speed: 5,
            jumpPower: 15,
            onGround: false,
            direction: 1, // 1 for right, -1 for left
            animationFrame: 0,
            animationTimer: 0
        };
        
        // Game objects arrays
        this.platforms = [];
        this.collectibles = [];
        this.obstacles = [];
        this.particles = [];
        this.backgrounds = [];
        
        // Game settings
        this.gravity = 0.8;
        this.friction = 0.8;
        this.scrollSpeed = 2;
        this.cameraX = 0;
        
        // Input handling
        this.keys = {};
        this.touchControls = {
            left: false,
            right: false,
            jump: false
        };
        
        // Level progression
        this.levelProgress = 0;
        this.levelLength = 3000;
        this.environmentCleanliness = 0; // 0-100%
        
        // Initialize game
        this.init();
    }
    
    /**
     * Initialize the game
     * Sets up event listeners, creates initial level, and starts game loop
     */
    init() {
        GameLogger.info('Setting up game components');
        
        try {
            this.setupEventListeners();
            this.createLevel();
            this.setupMobileControls();
            this.updateUI();
            this.gameLoop();
            
            GameLogger.info('Game initialized successfully');
        } catch (error) {
            GameLogger.error('Failed to initialize game', { error: error.message });
        }
    }
    
    /**
     * Setup keyboard and mouse event listeners
     * Handles player input and game controls
     */
    setupEventListeners() {
        GameLogger.debug('Setting up event listeners');
        
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            // Handle pause
            if (e.code === 'Escape' || e.code === 'KeyP') {
                this.togglePause();
            }
            
            // Handle restart
            if (e.code === 'KeyR' && this.gameState === 'gameOver') {
                this.restartGame();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Mouse events for mobile
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleTouchStart(e);
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.handleTouchEnd(e);
        });
        
                // Control button events
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('restartBtn').addEventListener('click', () => this.restartGame());
        document.getElementById('muteBtn').addEventListener('click', () => this.toggleMute());
        document.getElementById('fullscreenBtn').addEventListener('click', () => this.toggleFullscreen());
        document.getElementById('backBtn').addEventListener('click', () => this.backToGames());

        // Start button event
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        
        // Canvas click to start (alternative)
        this.canvas.addEventListener('click', (e) => {
            if (this.gameState === 'start') {
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Check if click is within start button bounds
                if (this.startButton && 
                    x >= this.startButton.x && x <= this.startButton.x + this.startButton.width &&
                    y >= this.startButton.y && y <= this.startButton.y + this.startButton.height) {
                    this.startGame();
                }
            }
        });
    }
    
    /**
     * Setup mobile control buttons
     * Handles touch controls for mobile devices
     */
    setupMobileControls() {
        const leftBtn = document.getElementById('leftBtn');
        const rightBtn = document.getElementById('rightBtn');
        const jumpBtn = document.getElementById('jumpBtn');
        
        // Left button
        leftBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.touchControls.left = true;
        });
        
        leftBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.touchControls.left = false;
        });
        
        // Right button
        rightBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.touchControls.right = true;
        });
        
        rightBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.touchControls.right = false;
        });
        
        // Jump button
        jumpBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.touchControls.jump = true;
            if (this.player.onGround) {
                this.player.velocityY = -this.player.jumpPower;
                this.player.onGround = false;
                this.createParticles(this.player.x + this.player.width/2, this.player.y + this.player.height, 'jump');
            }
        });
        
        jumpBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.touchControls.jump = false;
        });
    }
    
    /**
     * Create the initial game level
     * Generates platforms, collectibles, and obstacles
     */
    createLevel() {
        GameLogger.debug('Creating game level', { level: this.level });
        
        // Clear existing objects
        this.platforms = [];
        this.collectibles = [];
        this.obstacles = [];
        this.particles = [];
        this.backgrounds = [];
        
        // Create ground platform
        this.platforms.push({
            x: 0,
            y: 450,
            width: 800,
            height: 50,
            type: 'ground'
        });
        
        // Generate platforms based on level
        const platformCount = 8 + this.level * 2;
        for (let i = 0; i < platformCount; i++) {
            const x = 200 + i * 300 + Math.random() * 200;
            const y = 300 + Math.random() * 150;
            const width = 100 + Math.random() * 100;
            
            this.platforms.push({
                x: x,
                y: y,
                width: width,
                height: 20,
                type: 'platform'
            });
        }
        
        // Generate collectibles (renewable energy sources)
        const collectibleCount = 15 + this.level * 3;
        for (let i = 0; i < collectibleCount; i++) {
            const x = 150 + i * 200 + Math.random() * 150;
            const y = 100 + Math.random() * 300;
            
            const types = ['solar', 'wind', 'hydro'];
            const type = types[Math.floor(Math.random() * types.length)];
            
            this.collectibles.push({
                x: x,
                y: y,
                width: 25,
                height: 25,
                type: type,
                collected: false,
                animationFrame: 0,
                value: type === 'solar' ? 10 : type === 'wind' ? 15 : 20
            });
        }
        
        // Generate obstacles (pollution)
        const obstacleCount = 5 + this.level * 2;
        for (let i = 0; i < obstacleCount; i++) {
            const x = 300 + i * 400 + Math.random() * 200;
            const y = 350 + Math.random() * 100;
            
            const types = ['coal', 'oil', 'smog'];
            const type = types[Math.floor(Math.random() * types.length)];
            
            this.obstacles.push({
                x: x,
                y: y,
                width: 30,
                height: 30,
                type: type,
                damage: type === 'coal' ? 1 : type === 'oil' ? 1 : 0,
                effect: type === 'oil' ? 'slow' : type === 'smog' ? 'blind' : 'none'
            });
        }
        
        // Create parallax backgrounds
        this.createBackgrounds();
    }
    
    /**
     * Create parallax background layers
     * Adds depth and visual appeal to the game
     */
    createBackgrounds() {
        // Far background (mountains)
        this.backgrounds.push({
            x: 0,
            y: 200,
            width: 1600,
            height: 200,
            speed: 0.2,
            type: 'mountains'
        });
        
        // Mid background (buildings)
        this.backgrounds.push({
            x: 0,
            y: 300,
            width: 1200,
            height: 150,
            speed: 0.5,
            type: 'buildings'
        });
        
        // Near background (trees)
        this.backgrounds.push({
            x: 0,
            y: 350,
            width: 800,
            height: 100,
            speed: 0.8,
            type: 'trees'
        });
    }
    
    /**
     * Main game loop
     * Handles game updates and rendering at 60fps
     */
    gameLoop() {
        // Always update time for animations
        this.gameTime++;
        
        if (this.gameState === 'playing') {
            this.update();
        }
        this.render();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    /**
     * Update game state
     * Handles physics, collisions, and game logic
     */
    update() {
        // Handle player input
        this.handleInput();
        
        // Update player physics
        this.updatePlayer();
        
        // Update game objects
        this.updateCollectibles();
        this.updateObstacles();
        this.updateParticles();
        
        // Check collisions
        this.checkCollisions();
        
        // Update camera and scrolling
        this.updateCamera();
        
        // Update level progress
        this.updateLevelProgress();
        
        // Check win/lose conditions
        this.checkGameConditions();
    }
    
    /**
     * Handle player input from keyboard and touch
     * Updates player movement based on input
     */
    handleInput() {
        // Check for start game input
        if (this.gameState === 'start' && this.keys['Space']) {
            this.startGame();
            return;
        }
        
        // Only handle game controls if playing
        if (this.gameState !== 'playing') return;
        
        // Keyboard input
        if (this.keys['ArrowLeft'] || this.keys['KeyA'] || this.touchControls.left) {
            this.player.velocityX = -this.player.speed;
            this.player.direction = -1;
        } else if (this.keys['ArrowRight'] || this.keys['KeyD'] || this.touchControls.right) {
            this.player.velocityX = this.player.speed;
            this.player.direction = 1;
        } else {
            this.player.velocityX *= this.friction;
        }
        
        // Jump input
        if ((this.keys['Space'] || this.keys['ArrowUp'] || this.keys['KeyW'] || this.touchControls.jump) && this.player.onGround) {
            this.player.velocityY = -this.player.jumpPower;
            this.player.onGround = false;
            this.createParticles(this.player.x + this.player.width/2, this.player.y + this.player.height, 'jump');
        }
    }
    
    /**
     * Update player physics and animation
     * Handles gravity, movement, and animation frames
     */
    updatePlayer() {
        // Apply gravity
        this.player.velocityY += this.gravity;
        
        // Update position
        this.player.x += this.player.velocityX;
        this.player.y += this.player.velocityY;
        
        // Keep player in bounds
        if (this.player.x < 0) this.player.x = 0;
        if (this.player.x + this.player.width > this.canvas.width) {
            this.player.x = this.canvas.width - this.player.width;
        }
        
        // Check if player fell off screen
        if (this.player.y > this.canvas.height + 100) {
            this.takeDamage(1);
            this.player.x = 100;
            this.player.y = 400;
            this.player.velocityX = 0;
            this.player.velocityY = 0;
        }
        
        // Update animation
        if (Math.abs(this.player.velocityX) > 0.5) {
            this.player.animationTimer++;
            if (this.player.animationTimer > 8) {
                this.player.animationFrame = (this.player.animationFrame + 1) % 4;
                this.player.animationTimer = 0;
            }
        }
        
        // Reset on-ground status
        this.player.onGround = false;
    }
    
    /**
     * Update collectibles animation and effects
     * Handles floating animation and collection effects
     */
    updateCollectibles() {
        this.collectibles.forEach(collectible => {
            if (!collectible.collected) {
                // Floating animation
                collectible.y += Math.sin(this.gameTime * 0.05) * 0.5;
                collectible.animationFrame = (this.gameTime / 10) % 8;
            }
        });
    }
    
    /**
     * Update obstacles and their effects
     * Handles obstacle movement and effects
     */
    updateObstacles() {
        this.obstacles.forEach(obstacle => {
            // Move obstacles based on type
            if (obstacle.type === 'smog') {
                obstacle.x += Math.sin(this.gameTime * 0.02) * 0.5;
            }
        });
    }
    
    /**
     * Update particle effects
     * Handles particle physics and lifecycle
     */
    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.velocityX;
            particle.y += particle.velocityY;
            particle.velocityY += 0.1; // gravity
            particle.life--;
            
            return particle.life > 0;
        });
    }
    
    /**
     * Check all collision types
     * Handles player collisions with platforms, collectibles, and obstacles
     */
    checkCollisions() {
        // Platform collisions
        this.platforms.forEach(platform => {
            if (this.checkCollision(this.player, platform)) {
                if (this.player.velocityY > 0 && this.player.y < platform.y) {
                    // Landing on platform
                    this.player.y = platform.y - this.player.height;
                    this.player.velocityY = 0;
                    this.player.onGround = true;
                }
            }
        });
        
        // Collectible collisions
        this.collectibles.forEach(collectible => {
            if (!collectible.collected && this.checkCollision(this.player, collectible)) {
                this.collectItem(collectible);
            }
        });
        
        // Obstacle collisions
        this.obstacles.forEach(obstacle => {
            if (this.checkCollision(this.player, obstacle)) {
                this.handleObstacleCollision(obstacle);
            }
        });
    }
    
    /**
     * Check collision between two objects
     * @param {Object} obj1 - First object with x, y, width, height
     * @param {Object} obj2 - Second object with x, y, width, height
     * @returns {boolean} - Whether objects are colliding
     */
    checkCollision(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }
    
    /**
     * Handle collecting renewable energy items
     * @param {Object} collectible - The collectible being collected
     */
    collectItem(collectible) {
        GameLogger.debug('Collecting item', { type: collectible.type, value: collectible.value });
        
        collectible.collected = true;
        this.score += collectible.value;
        this.environmentCleanliness += 2;
        
        // Create collection effect
        this.createParticles(collectible.x + collectible.width/2, collectible.y + collectible.height/2, 'collect');
        
        // Play collection sound effect (placeholder)
        this.playSound('collect');
        
        this.updateUI();
    }
    
    /**
     * Handle collision with pollution obstacles
     * @param {Object} obstacle - The obstacle being collided with
     */
    handleObstacleCollision(obstacle) {
        GameLogger.debug('Obstacle collision', { type: obstacle.type });
        
        if (obstacle.damage > 0) {
            this.takeDamage(obstacle.damage);
        }
        
        // Apply obstacle effects
        if (obstacle.effect === 'slow') {
            this.player.speed = Math.max(2, this.player.speed - 1);
            setTimeout(() => this.player.speed = 5, 3000);
        }
        
        // Create collision effect
        this.createParticles(this.player.x + this.player.width/2, this.player.y + this.player.height/2, 'collision');
        
        // Play collision sound effect (placeholder)
        this.playSound('collision');
    }
    
    /**
     * Handle player taking damage
     * @param {number} damage - Amount of damage to take
     */
    takeDamage(damage) {
        GameLogger.debug('Player taking damage', { damage, currentHealth: this.health });
        
        this.health -= damage;
        this.updateUI();
        
        if (this.health <= 0) {
            this.gameOver();
        }
    }
    
    /**
     * Create particle effects
     * @param {number} x - X position for particles
     * @param {number} y - Y position for particles
     * @param {string} type - Type of particle effect
     */
    createParticles(x, y, type) {
        const particleCount = type === 'jump' ? 5 : type === 'collect' ? 8 : 6;
        const colors = {
            jump: ['#6ee7b7', '#10b981'],
            collect: ['#fbbf24', '#f59e0b'],
            collision: ['#ef4444', '#dc2626']
        };
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: x,
                y: y,
                velocityX: (Math.random() - 0.5) * 4,
                velocityY: (Math.random() - 0.5) * 4 - 2,
                life: 30 + Math.random() * 20,
                color: colors[type][Math.floor(Math.random() * colors[type].length)],
                size: 2 + Math.random() * 3
            });
        }
    }
    
    /**
     * Update camera position for scrolling
     * Creates side-scrolling effect
     */
    updateCamera() {
        const targetX = this.player.x - this.canvas.width / 3;
        this.cameraX += (targetX - this.cameraX) * 0.1;
        
        // Keep camera within bounds
        this.cameraX = Math.max(0, this.cameraX);
    }
    
    /**
     * Update level progress and check for level completion
     */
    updateLevelProgress() {
        this.levelProgress = (this.player.x / this.levelLength) * 100;
        
        if (this.levelProgress >= 100) {
            this.completeLevel();
        }
    }
    
    /**
     * Complete current level and advance to next
     */
    completeLevel() {
        GameLogger.info('Level completed', { level: this.level, score: this.score });
        
        this.level++;
        this.levelProgress = 0;
        this.environmentCleanliness = Math.min(100, this.environmentCleanliness + 10);
        
        // Increase difficulty
        this.scrollSpeed += 0.5;
        this.levelLength += 500;
        
        this.createLevel();
        this.updateUI();
        
        // Show level complete message
        this.showMessage(`Level ${this.level - 1} Complete!`, 'Great job cleaning the environment!');
    }
    
    /**
     * Check win/lose conditions
     */
    checkGameConditions() {
        // Win condition: reach 100% environment cleanliness
        if (this.environmentCleanliness >= 100) {
            this.gameWin();
        }
    }
    
    /**
     * Handle game over
     */
    gameOver() {
        GameLogger.info('Game over', { finalScore: this.score, level: this.level });
        
        this.gameState = 'gameOver';
        this.showOverlay('Game Over', 'You ran out of health!', this.score);
    }
    
    /**
     * Handle game win
     */
    gameWin() {
        GameLogger.info('Game won', { finalScore: this.score, level: this.level });
        
        this.gameState = 'gameOver';
        this.showOverlay('Victory!', 'You cleaned the environment!', this.score);
    }
    
    /**
     * Render all game elements
     * Handles drawing of backgrounds, objects, and UI
     */
    render() {
        // Clear canvas with gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#1e3a8a'); // Dark blue sky
        gradient.addColorStop(0.6, '#7c3aed'); // Purple
        gradient.addColorStop(1, '#0f172a'); // Dark bottom
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Add atmospheric particles
        this.renderAtmosphere();
        
        if (this.gameState === 'start') {
            // Render start screen
            this.renderStartScreen();
        } else {
            // Save context for camera transform
            this.ctx.save();
            this.ctx.translate(-this.cameraX, 0);
            
            // Render backgrounds with depth
            this.renderBackgrounds();
            
            // Render platforms with textures
            this.renderPlatforms();
            
            // Render collectibles with glow effects
            this.renderCollectibles();
            
            // Render obstacles with shadows
            this.renderObstacles();
            
            // Render particle effects
            this.renderParticles();
            
            // Render player with animation
            this.renderPlayer();
            
            // Restore context
            this.ctx.restore();
            
            // Render UI elements with modern design
            this.renderUI();
        }
        
        // Add screen effects
        this.renderScreenEffects();
    }
    
    /**
     * Render parallax backgrounds with realistic effects
     */
    renderBackgrounds() {
        this.backgrounds.forEach(bg => {
            const x = bg.x - this.cameraX * bg.speed;
            
            if (bg.type === 'mountains') {
                // Mountain silhouettes with gradient
                const gradient = this.ctx.createLinearGradient(0, bg.y, 0, bg.y + bg.height);
                gradient.addColorStop(0, '#374151');
                gradient.addColorStop(1, '#1f2937');
                this.ctx.fillStyle = gradient;
                
                // Draw jagged mountain shapes
                this.ctx.beginPath();
                this.ctx.moveTo(x, bg.y + bg.height);
                for (let i = 0; i < bg.width; i += 40) {
                    const peakHeight = Math.sin(i * 0.01) * 30 + 20;
                    this.ctx.lineTo(x + i, bg.y + peakHeight);
                }
                this.ctx.lineTo(x + bg.width, bg.y + bg.height);
                this.ctx.closePath();
                this.ctx.fill();
                
            } else if (bg.type === 'buildings') {
                // Industrial cityscape
                const gradient = this.ctx.createLinearGradient(0, bg.y, 0, bg.y + bg.height);
                gradient.addColorStop(0, '#6b7280');
                gradient.addColorStop(0.7, '#4b5563');
                gradient.addColorStop(1, '#374151');
                this.ctx.fillStyle = gradient;
                
                // Draw building rectangles with windows
                for (let i = 0; i < bg.width; i += 60) {
                    const buildingHeight = Math.random() * 100 + 80;
                    this.ctx.fillRect(x + i, bg.y + bg.height - buildingHeight, 50, buildingHeight);
                    
                    // Add windows
                    this.ctx.fillStyle = '#fbbf24';
                    for (let w = 0; w < 40; w += 12) {
                        for (let h = 10; h < buildingHeight - 10; h += 20) {
                            if (Math.random() > 0.3) {
                                this.ctx.fillRect(x + i + w + 5, bg.y + bg.height - buildingHeight + h, 8, 8);
                            }
                        }
                    }
                    this.ctx.fillStyle = gradient;
                }
                
            } else if (bg.type === 'trees') {
                // Cleaner forest areas
                const treeGradient = this.ctx.createRadialGradient(x + bg.width/2, bg.y, 0, x + bg.width/2, bg.y, bg.width);
                treeGradient.addColorStop(0, '#22c55e');
                treeGradient.addColorStop(0.6, '#16a34a');
                treeGradient.addColorStop(1, '#15803d');
                this.ctx.fillStyle = treeGradient;
                
                // Draw tree shapes
                for (let i = 0; i < bg.width; i += 30) {
                    const treeHeight = Math.random() * 40 + 50;
                    // Tree trunk
                    this.ctx.fillStyle = '#92400e';
                    this.ctx.fillRect(x + i + 12, bg.y + bg.height - 20, 6, 20);
                    // Tree crown
                    this.ctx.fillStyle = treeGradient;
                    this.ctx.beginPath();
                    this.ctx.arc(x + i + 15, bg.y + bg.height - treeHeight, 15, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
        });
    }
    
    /**
     * Render platforms with realistic textures and details
     */
    renderPlatforms() {
        this.platforms.forEach(platform => {
            const x = platform.x;
            const y = platform.y;
            const width = platform.width;
            const height = platform.height;
            
            if (platform.type === 'ground') {
                // Polluted earth/concrete texture
                const groundGradient = this.ctx.createLinearGradient(x, y, x, y + height);
                groundGradient.addColorStop(0, '#a16207');
                groundGradient.addColorStop(0.3, '#92400e');
                groundGradient.addColorStop(1, '#78350f');
                this.ctx.fillStyle = groundGradient;
                this.ctx.fillRect(x, y, width, height);
                
                // Add surface texture lines
                this.ctx.strokeStyle = '#451a03';
                this.ctx.lineWidth = 1;
                for (let i = 0; i < width; i += 15) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(x + i, y);
                    this.ctx.lineTo(x + i + Math.random() * 10, y + 5);
                    this.ctx.stroke();
                }
                
                // Add pollution spots
                this.ctx.fillStyle = '#374151';
                for (let i = 0; i < width; i += 30) {
                    if (Math.random() > 0.7) {
                        this.ctx.beginPath();
                        this.ctx.arc(x + i + Math.random() * 20, y + 2, 2 + Math.random() * 3, 0, Math.PI * 2);
                        this.ctx.fill();
                    }
                }
                
            } else {
                // Clean eco-platform
                const ecoGradient = this.ctx.createLinearGradient(x, y, x, y + height);
                ecoGradient.addColorStop(0, '#22c55e');
                ecoGradient.addColorStop(0.5, '#16a34a');
                ecoGradient.addColorStop(1, '#15803d');
                this.ctx.fillStyle = ecoGradient;
                this.ctx.fillRect(x, y, width, height);
                
                // Add grass/plant details on top
                this.ctx.fillStyle = '#4ade80';
                for (let i = 0; i < width; i += 8) {
                    if (Math.random() > 0.4) {
                        // Small grass blades
                        this.ctx.fillRect(x + i, y - 2, 1, 4);
                        this.ctx.fillRect(x + i + 2, y - 3, 1, 5);
                    }
                }
                
                // Add bio-luminescent edge
                this.ctx.shadowColor = '#22c55e';
                this.ctx.shadowBlur = 8;
                this.ctx.strokeStyle = '#4ade80';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.moveTo(x, y);
                this.ctx.lineTo(x + width, y);
                this.ctx.stroke();
                this.ctx.shadowBlur = 0;
            }
        });
    }
    
    /**
     * Render collectibles with advanced visual effects
     */
    renderCollectibles() {
        this.collectibles.forEach(collectible => {
            if (!collectible.collected) {
                const x = collectible.x;
                const y = collectible.y + Math.sin(this.gameTime * 0.005 + collectible.x * 0.01) * 3; // Floating animation
                const centerX = x + collectible.width / 2;
                const centerY = y + collectible.height / 2;
                
                // Set up glow effect
                this.ctx.save();
                this.ctx.shadowBlur = 20;
                this.ctx.shadowColor = collectible.type === 'solar' ? '#fbbf24' : 
                                     collectible.type === 'wind' ? '#3b82f6' : '#06b6d4';
                
                // Draw collectible based on type with realistic icons
                if (collectible.type === 'solar') {
                    // Solar panel design
                    const gradient = this.ctx.createLinearGradient(x, y, x + collectible.width, y + collectible.height);
                    gradient.addColorStop(0, '#fbbf24');
                    gradient.addColorStop(0.5, '#f59e0b');
                    gradient.addColorStop(1, '#d97706');
                    this.ctx.fillStyle = gradient;
                    this.ctx.fillRect(x + 2, y + 2, collectible.width - 4, collectible.height - 4);
                    
                    // Solar panel grid lines
                    this.ctx.strokeStyle = '#92400e';
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(x + collectible.width/2, y + 2);
                    this.ctx.lineTo(x + collectible.width/2, y + collectible.height - 2);
                    this.ctx.moveTo(x + 2, y + collectible.height/2);
                    this.ctx.lineTo(x + collectible.width - 2, y + collectible.height/2);
                    this.ctx.stroke();
                    
                } else if (collectible.type === 'wind') {
                    // Wind turbine design
                    this.ctx.fillStyle = '#f8fafc';
                    this.ctx.fillRect(centerX - 1, y + 5, 2, collectible.height - 10); // Tower
                    
                    // Rotating blades
                    const rotation = this.gameTime * 0.1;
                    this.ctx.save();
                    this.ctx.translate(centerX, y + 8);
                    this.ctx.rotate(rotation);
                    
                    // Three blades
                    for (let i = 0; i < 3; i++) {
                        this.ctx.save();
                        this.ctx.rotate((i * Math.PI * 2) / 3);
                        this.ctx.fillStyle = '#e5e7eb';
                        this.ctx.fillRect(-1, -8, 2, 8);
                        this.ctx.restore();
                    }
                    
                    this.ctx.restore();
                    
                } else if (collectible.type === 'hydro') {
                    // Water drop design
                    this.ctx.fillStyle = '#06b6d4';
                    this.ctx.beginPath();
                    this.ctx.moveTo(centerX, y + 2);
                    this.ctx.quadraticCurveTo(x + 2, centerY, centerX, y + collectible.height - 2);
                    this.ctx.quadraticCurveTo(x + collectible.width - 2, centerY, centerX, y + 2);
                    this.ctx.fill();
                    
                    // Inner highlight
                    this.ctx.fillStyle = '#67e8f9';
                    this.ctx.beginPath();
                    this.ctx.arc(centerX - 3, y + 8, 3, 0, Math.PI * 2);
                    this.ctx.fill();
                }
                
                // Pulsing energy effect
                const pulseAlpha = 0.3 + Math.sin(this.gameTime * 0.01) * 0.2;
                this.ctx.globalAlpha = pulseAlpha;
                this.ctx.shadowBlur = 30;
                this.ctx.fillStyle = this.ctx.shadowColor;
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, collectible.width, 0, Math.PI * 2);
                this.ctx.fill();
                
                this.ctx.restore();
            }
        });
    }
    
    /**
     * Render obstacles
     */
    renderObstacles() {
        this.obstacles.forEach(obstacle => {
            const x = obstacle.x;
            const y = obstacle.y;
            
            if (obstacle.type === 'coal') {
                this.ctx.fillStyle = '#374151';
                this.ctx.fillRect(x, y, obstacle.width, obstacle.height);
            } else if (obstacle.type === 'oil') {
                this.ctx.fillStyle = '#92400e';
                this.ctx.fillRect(x, y, obstacle.width, obstacle.height);
            } else if (obstacle.type === 'smog') {
                this.ctx.fillStyle = '#6b7280';
                this.ctx.fillRect(x, y, obstacle.width, obstacle.height);
            }
        });
    }
    
    /**
     * Render particle effects
     */
    renderParticles() {
        this.particles.forEach(particle => {
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.life / 50;
            this.ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
        });
        this.ctx.globalAlpha = 1;
    }
    
    /**
     * Render player character with detailed animation
     */
    renderPlayer() {
        const x = this.player.x;
        const y = this.player.y;
        const centerX = x + this.player.width / 2;
        const centerY = y + this.player.height / 2;
        
        this.ctx.save();
        
        // Scale player based on direction
        if (this.player.direction === -1) {
            this.ctx.scale(-1, 1);
            this.ctx.translate(-x - this.player.width, 0);
        }
        
        // Player body gradient (eco-suit)
        const bodyGradient = this.ctx.createLinearGradient(x, y, x, y + this.player.height);
        bodyGradient.addColorStop(0, '#22c55e');
        bodyGradient.addColorStop(0.5, '#16a34a');
        bodyGradient.addColorStop(1, '#15803d');
        this.ctx.fillStyle = bodyGradient;
        
        // Main body (rounded rectangle)
        this.ctx.beginPath();
        this.ctx.roundRect(x + 3, y + 5, this.player.width - 6, this.player.height - 15, 5);
        this.ctx.fill();
        
        // Helmet/head
        const headGradient = this.ctx.createRadialGradient(centerX, y + 8, 2, centerX, y + 8, 12);
        headGradient.addColorStop(0, '#f8fafc');
        headGradient.addColorStop(0.7, '#e2e8f0');
        headGradient.addColorStop(1, '#cbd5e1');
        this.ctx.fillStyle = headGradient;
        this.ctx.beginPath();
        this.ctx.arc(centerX, y + 8, 12, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Visor
        this.ctx.fillStyle = '#1e40af';
        this.ctx.beginPath();
        this.ctx.arc(centerX, y + 8, 8, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Visor reflection
        this.ctx.fillStyle = '#93c5fd';
        this.ctx.beginPath();
        this.ctx.arc(centerX - 2, y + 6, 3, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Arms
        this.ctx.fillStyle = '#16a34a';
        // Left arm
        this.ctx.fillRect(x - 2, y + 12, 5, 15);
        // Right arm
        this.ctx.fillRect(x + this.player.width - 3, y + 12, 5, 15);
        
        // Legs with walking animation
        const walkCycle = Math.sin(this.gameTime * 0.2) * 3;
        this.ctx.fillStyle = '#15803d';
        // Left leg
        this.ctx.fillRect(x + 5, y + this.player.height - 10, 8, 10 + Math.abs(walkCycle));
        // Right leg
        this.ctx.fillRect(x + 17, y + this.player.height - 10, 8, 10 + Math.abs(-walkCycle));
        
        // Eco-badge (chest logo)
        this.ctx.fillStyle = '#fbbf24';
        this.ctx.beginPath();
        this.ctx.arc(centerX, y + 18, 4, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Leaf symbol on badge
        this.ctx.fillStyle = '#22c55e';
        this.ctx.beginPath();
        this.ctx.ellipse(centerX, y + 18, 2, 3, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Energy backpack
        this.ctx.fillStyle = '#374151';
        this.ctx.fillRect(x + this.player.width - 8, y + 8, 6, 20);
        
        // Energy indicator on backpack
        this.ctx.fillStyle = '#10b981';
        const energyHeight = (this.score / 50) * 15; // Energy based on score
        this.ctx.fillRect(x + this.player.width - 7, y + 25 - energyHeight, 4, energyHeight);
        
        // Jetpack flames when jumping
        if (this.player.velocityY < 0) {
            this.ctx.fillStyle = '#f97316';
            this.ctx.beginPath();
            this.ctx.ellipse(centerX, y + this.player.height, 3, 8, 0, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.fillStyle = '#fbbf24';
            this.ctx.beginPath();
            this.ctx.ellipse(centerX, y + this.player.height, 2, 5, 0, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.ctx.restore();
    }
    
    /**
     * Render atmospheric particles in background
     */
    renderAtmosphere() {
        // Add floating dust particles and pollution effects
        for (let i = 0; i < 20; i++) {
            const x = (this.gameTime + i * 123) % this.canvas.width;
            const y = (Math.sin(this.gameTime * 0.001 + i) * 50) + 100 + i * 10;
            const alpha = 0.1 + Math.sin(this.gameTime * 0.002 + i) * 0.05;
            
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = '#6b7280';
            this.ctx.beginPath();
            this.ctx.arc(x, y, 1 + Math.sin(i) * 0.5, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.globalAlpha = 1;
    }

    /**
     * Render start screen with game title and start button
     */
    renderStartScreen() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Game title
        this.ctx.save();
        this.ctx.shadowColor = '#10b981';
        this.ctx.shadowBlur = 30;
        this.ctx.fillStyle = '#f8fafc';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🌱 CARBON CLEANER', centerX, centerY - 100);
        
        // Subtitle
        this.ctx.shadowBlur = 10;
        this.ctx.font = '20px Arial';
        this.ctx.fillStyle = '#cbd5e1';
        this.ctx.fillText('Clean the environment • Collect renewable energy', centerX, centerY - 60);
        
        // Start button background
        const buttonWidth = 300;
        const buttonHeight = 60;
        const buttonX = centerX - buttonWidth / 2;
        const buttonY = centerY - 20;
        
        // Animated button background
        const buttonGradient = this.ctx.createLinearGradient(buttonX, buttonY, buttonX, buttonY + buttonHeight);
        buttonGradient.addColorStop(0, '#22c55e');
        buttonGradient.addColorStop(0.5, '#16a34a');
        buttonGradient.addColorStop(1, '#15803d');
        
        this.ctx.shadowColor = '#10b981';
        this.ctx.shadowBlur = 20;
        this.ctx.fillStyle = buttonGradient;
        this.ctx.beginPath();
        this.ctx.roundRect(buttonX, buttonY, buttonWidth, buttonHeight, 15);
        this.ctx.fill();
        
        // Button text
        this.ctx.shadowBlur = 5;
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillText('🎮 START GAME', centerX, buttonY + 38);
        
        // Instructions
        this.ctx.shadowBlur = 0;
        this.ctx.font = '16px Arial';
        this.ctx.fillStyle = '#94a3b8';
        this.ctx.fillText('Click here or press SPACE to begin', centerX, centerY + 70);
        
        // Controls info
        this.ctx.font = '14px Arial';
        this.ctx.fillStyle = '#6b7280';
        this.ctx.fillText('Controls: Arrow Keys / WASD to move • SPACE to jump', centerX, centerY + 120);
        
        // Game features
        const features = [
            '🌞 Collect Solar Energy (+10 pts)',
            '💨 Gather Wind Power (+15 pts)', 
            '💧 Harvest Water Energy (+20 pts)'
        ];
        
        this.ctx.font = '12px Arial';
        this.ctx.fillStyle = '#84cc16';
        features.forEach((feature, index) => {
            this.ctx.fillText(feature, centerX, centerY + 160 + (index * 20));
        });
        
        this.ctx.restore();
        
        // Store button bounds for click detection
        this.startButton = {
            x: buttonX,
            y: buttonY,
            width: buttonWidth,
            height: buttonHeight
        };
    }

    /**
     * Render screen effects and overlays
     */
    renderScreenEffects() {
        // Subtle vignette effect
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height / 2, 0,
            this.canvas.width / 2, this.canvas.height / 2, this.canvas.width / 2
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(0.8, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Render modern UI elements with glass morphism
     */
    renderUI() {
        const padding = 20;
        const topY = 20;
        
        // Modern HUD background
        this.ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
        this.ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.roundRect(padding, topY, this.canvas.width - padding * 2, 80, 15);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Score display with glow
        this.ctx.save();
        this.ctx.shadowColor = '#10b981';
        this.ctx.shadowBlur = 10;
        this.ctx.fillStyle = '#f8fafc';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillText(`Score: ${this.score}`, padding + 20, topY + 35);
        this.ctx.restore();
        
        // Level indicator
        this.ctx.fillStyle = '#cbd5e1';
        this.ctx.font = '16px Arial';
        this.ctx.fillText(`Level ${this.level}`, padding + 20, topY + 60);
        
        // Health bar (modern design)
        const healthBarX = this.canvas.width - 200;
        const healthBarY = topY + 25;
        
        for (let i = 0; i < 3; i++) {
            const heartX = healthBarX + i * 35;
            const isActive = i < this.health;
            
            // Heart shape
            this.ctx.fillStyle = isActive ? '#ef4444' : '#374151';
            this.ctx.beginPath();
            this.ctx.arc(heartX, heartBarY, 8, Math.PI, 0);
            this.ctx.arc(heartX + 8, heartBarY, 8, Math.PI, 0);
            this.ctx.lineTo(heartX + 8, heartBarY + 12);
            this.ctx.lineTo(heartX, heartBarY + 20);
            this.ctx.lineTo(heartX - 8, heartBarY + 12);
            this.ctx.closePath();
            this.ctx.fill();
            
            if (isActive) {
                // Heart glow
                this.ctx.shadowColor = '#ef4444';
                this.ctx.shadowBlur = 5;
                this.ctx.fill();
                this.ctx.shadowBlur = 0;
            }
        }
        
        // Environment cleanliness indicator (circular progress)
        const progressCenterX = this.canvas.width / 2;
        const progressCenterY = topY + 40;
        const progressRadius = 25;
        
        // Background circle
        this.ctx.strokeStyle = '#374151';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.arc(progressCenterX, progressCenterY, progressRadius, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Progress arc
        const progressAngle = (this.environmentCleanliness / 100) * Math.PI * 2 - Math.PI / 2;
        this.ctx.strokeStyle = '#10b981';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.arc(progressCenterX, progressCenterY, progressRadius, -Math.PI / 2, progressAngle);
        this.ctx.stroke();
        
        // Progress percentage text
        this.ctx.fillStyle = '#f8fafc';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`${Math.round(this.environmentCleanliness)}%`, progressCenterX, progressCenterY + 4);
        this.ctx.textAlign = 'left';
        
        // Progress label
        this.ctx.fillStyle = '#cbd5e1';
        this.ctx.font = '10px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Clean Air', progressCenterX, progressCenterY + 45);
        this.ctx.textAlign = 'left';
        
        // Mini-map (bottom right)
        const miniMapWidth = 150;
        const miniMapHeight = 60;
        const miniMapX = this.canvas.width - miniMapWidth - 20;
        const miniMapY = this.canvas.height - miniMapHeight - 20;
        
        // Mini-map background
        this.ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        this.ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.roundRect(miniMapX, miniMapY, miniMapWidth, miniMapHeight, 8);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Level progress in mini-map
        const progressWidth = (this.levelProgress / this.levelLength) * (miniMapWidth - 10);
        this.ctx.fillStyle = '#10b981';
        this.ctx.fillRect(miniMapX + 5, miniMapY + miniMapHeight - 15, progressWidth, 8);
        
        // Player position indicator
        const playerMapX = miniMapX + (this.player.x / this.levelLength) * miniMapWidth;
        this.ctx.fillStyle = '#fbbf24';
        this.ctx.beginPath();
        this.ctx.arc(playerMapX, miniMapY + miniMapHeight / 2, 3, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Mini-map label
        this.ctx.fillStyle = '#cbd5e1';
        this.ctx.font = '10px Arial';
        this.ctx.fillText('Progress', miniMapX + 5, miniMapY + 15);
    }
    
    /**
     * Update UI elements
     */
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        
        // Update health bar
        const healthBar = document.getElementById('healthBar');
        const segments = healthBar.querySelectorAll('.health-segment');
        
        segments.forEach((segment, index) => {
            if (index < this.health) {
                segment.classList.remove('lost');
            } else {
                segment.classList.add('lost');
            }
        });
    }
    
    /**
     * Show overlay with custom message
     * @param {string} title - Overlay title
     * @param {string} message - Overlay message
     * @param {number} score - Score to display
     */
    showOverlay(title, message, score) {
        document.getElementById('overlayTitle').textContent = title;
        document.getElementById('overlayMessage').textContent = message;
        document.getElementById('overlayScore').textContent = `Score: ${score}`;
        document.getElementById('gameOverlay').style.display = 'flex';
    }
    
    /**
     * Hide overlay
     */
    hideOverlay() {
        document.getElementById('gameOverlay').style.display = 'none';
    }
    
    /**
     * Show temporary message
     * @param {string} title - Message title
     * @param {string} message - Message content
     */
    showMessage(title, message) {
        // Implementation for temporary messages
        console.log(`${title}: ${message}`);
    }
    
    /**
     * Start the game from the start screen
     */
    startGame() {
        GameLogger.info('Starting game');
        this.gameState = 'playing';
        this.hideOverlay();
        
        // Reset game state
        this.score = 0;
        this.level = 1;
        this.health = 3;
        this.gameTime = 0;
        this.player.x = 100;
        this.player.y = 400;
        this.player.velocityX = 0;
        this.player.velocityY = 0;
        this.cameraX = 0;
        this.levelProgress = 0;
        this.environmentCleanliness = 0;
        
        // Recreate level
        this.createLevel();
        this.updateUI();
    }

    /**
     * Toggle game pause state
     */
    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            this.showOverlay('Game Paused', 'Press any key to continue', this.score);
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            this.hideOverlay();
        }
    }
    
    /**
     * Restart the game
     */
    restartGame() {
        GameLogger.info('Restarting game');
        
        this.score = 0;
        this.level = 1;
        this.health = 3;
        this.gameTime = 0;
        this.levelProgress = 0;
        this.environmentCleanliness = 0;
        this.scrollSpeed = 2;
        this.levelLength = 3000;
        
        this.player.x = 100;
        this.player.y = 400;
        this.player.velocityX = 0;
        this.player.velocityY = 0;
        
        this.gameState = 'playing';
        this.hideOverlay();
        this.createLevel();
        this.updateUI();
    }
    
    /**
     * Toggle sound mute (placeholder)
     */
    toggleMute() {
        // Placeholder for sound toggle
        console.log('Sound toggled');
    }
    
    /**
     * Toggle fullscreen mode
     */
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.canvas.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
    
    /**
     * Return to main games page
     */
    backToGames() {
        GameLogger.info('Returning to main games page');
        
        if (window.parent && window.parent !== window) {
            // Try multiple methods to communicate with parent
            if (window.parent.closeGame) {
                window.parent.closeGame();
            } else if (window.parent.gameLoader && window.parent.gameLoader.closeGame) {
                window.parent.gameLoader.closeGame();
            } else {
                // Fallback: send message to parent
                window.parent.postMessage({ action: 'closeGame' }, '*');
            }
        } else {
            // If not in iframe, redirect to main page
            window.location.href = '../../index.html';
        }
    }
    
    /**
     * Play sound effect (placeholder)
     * @param {string} soundType - Type of sound to play
     */
    playSound(soundType) {
        // Placeholder for sound effects
        console.log(`Playing sound: ${soundType}`);
    }
    
    /**
     * Handle touch start events
     * @param {TouchEvent} e - Touch event
     */
    handleTouchStart(e) {
        // Touch handling for mobile
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        // Simple touch controls
        if (x < this.canvas.width / 3) {
            this.touchControls.left = true;
        } else if (x > (this.canvas.width / 3) * 2) {
            this.touchControls.right = true;
        } else {
            this.touchControls.jump = true;
            if (this.player.onGround) {
                this.player.velocityY = -this.player.jumpPower;
                this.player.onGround = false;
            }
        }
    }
    
    /**
     * Handle touch end events
     * @param {TouchEvent} e - Touch event
     */
    handleTouchEnd(e) {
        this.touchControls.left = false;
        this.touchControls.right = false;
        this.touchControls.jump = false;
    }
}

// Initialize the game when the page loads
GameLogger.info('Loading Carbon Cleaner game');

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.game = new CarbonCleanerGame();
    });
} else {
    window.game = new CarbonCleanerGame();
}

GameLogger.info('Carbon Cleaner game loaded successfully'); 