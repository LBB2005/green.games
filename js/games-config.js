/**
 * ===================================
 * GREEN.GAMES - GAMES CONFIGURATION
 * Easy-to-modify configuration for adding new games
 * ===================================
 */

/**
 * GAMES CONFIGURATION
 * Add new games here - super easy!
 */

// List of games - ADD YOUR DAD'S GAMES HERE
const GAMES = [
    {
        id: 'thrift-shop-hero',
        title: 'Thrift Shop Hero',
        description: 'Battle fast fashion villains by building a sustainable outfit! Shop for thrifted clothes and defeat greedy corporations.',
        icon: '🧥',
        url: 'games/thrift-shop-hero/index.html'
    },
    {
        id: 'footprint-fighters',
        title: 'Footprint Fighters',
        description: 'Save the planet as an eco-warrior! Move around, collect environmental files, and avoid pollution enemies.',
        icon: '🌱',
        url: 'games/footprint-fighters/index.html'
    },
    {
        id: 'greenwash-hunters-pro',
        title: 'Greenwash Hunters Pro',
        description: 'Professional eco-detective experience! Investigate corporate sustainability fraud and expose greenwashing tactics.',
        icon: '🕵️',
        url: 'games/greenwash-hunters-pro/index.html'
    },
    {
        id: 'compost-clash',
        title: 'Compost Clash',
        description: 'Epic composting battle game! Choose your decomposer team and fight for the ultimate compost dominance.',
        icon: '🦠',
        url: 'games/compost-clash/index.html'
    },
    {
        id: 'carbon-detective',
        title: 'Carbon Detective',
        description: 'Discover the hidden carbon footprints in everyday choices through this interactive quiz game!',
        icon: '🕵️',
        url: 'games/carbon-detective/index.html'
    },
    {
        id: 'ready-or-not',
        title: 'Ready or Not?',
        description: 'Test your AI readiness knowledge with this engaging quiz about brand availability, depth, and clarity!',
        icon: '🐱',
        url: 'games/ready-or-not/index.html'
    },
    {
        id: 'ev-road-race',
        title: 'EV Road Race',
        description: 'Drive your electric vehicle through traffic while managing battery life and collecting charging stations!',
        icon: '⚡',
        url: 'games/ev-road-race/index.html'
    },
    {
        id: 'climate-trivia',
        title: 'EcoTrivia Challenge',
        description: 'Test your knowledge about climate science, renewable energy, and sustainability in this comprehensive quiz!',
        icon: '🌍',
        url: 'games/climate-trivia/index.html'
    },
    {
        id: 'greenwash-detective',
        title: 'Greenwash Detective',
        description: 'Become a sustainability detective! Investigate corporate environmental claims and uncover greenwashing tactics.',
        icon: '🕵️',
        url: 'games/greenwash-detective/index.html'
    },
    {
        id: 'regen-rangers',
        title: 'Regen Rangers',
        description: 'Restore degraded land through regenerative practices. Plant seeds, improve soil health, and rebuild ecosystems.',
        icon: '🌱',
        url: 'games/regen-rangers/index.html'
    },
    {
        id: 'compost-quest',
        title: 'Compost Quest',
        description: 'Master the art of composting! Mix organic materials in perfect ratios to create nutrient-rich soil.',
        icon: '🍂',
        url: 'games/compost-quest/index.html'
    },
    {
        id: 'carbon-clash',
        title: 'Carbon Clash',
        description: 'Strategic card game where you compete to reduce your city\'s carbon footprint using technology, policy, and lifestyle changes.',
        icon: '⚡',
        url: 'games/carbon-clash/index.html'
    },
    {
        id: 'carbon-cleaner',
        title: 'Carbon Cleaner',
        description: 'Clean up the atmosphere by removing carbon dioxide! Use advanced technology to capture and store carbon emissions.',
        icon: '🌫️',
        url: 'games/carbon-cleaner/index.html'
    },
    {
        id: 'ocean-rescue',
        title: 'Ocean Rescue',
        description: 'Save marine life by cleaning up ocean pollution! Remove plastic waste and protect endangered species.',
        icon: '🌊',
        url: 'games/ocean-rescue/index.html'
    },
    {
        id: 'solar-surge',
        title: 'Solar Surge',
        description: 'Harness the power of the sun! Build solar panel arrays and manage renewable energy distribution.',
        icon: '☀️',
        url: 'games/solar-surge/index.html'
    },
    {
        id: 'tree-tower',
        title: 'Tree Tower',
        description: 'Grow towering forests and create thriving ecosystems! Plant trees, manage resources, and fight deforestation.',
        icon: '🌳',
        url: 'games/tree-tower/index.html'
    },
    {
        id: 'wind-runner',
        title: 'Wind Runner',
        description: 'Race through wind farms while learning about renewable energy! Collect wind power and avoid fossil fuel obstacles.',
        icon: '🌪️',
        url: 'games/wind-runner/index.html'
    }
    // Example of how to add more games:
    // {
    //     id: 'my-awesome-game',
    //     title: 'My Awesome Game',
    //     description: 'This is an amazing eco-friendly game!',
    //     icon: '🌱',
    //     url: 'https://yourname.github.io/my-awesome-game'
    // }
];

// Don't change this part - it loads the games
function loadGames() {
    const gamesGrid = document.getElementById('gamesGrid');
    const comingSoonMessage = document.getElementById('comingSoonMessage');
    
    if (GAMES.length === 0) {
        // Show coming soon message
        comingSoonMessage.style.display = 'block';
        gamesGrid.style.display = 'none';
        return;
    }
    
    // Hide coming soon and show games
    comingSoonMessage.style.display = 'none';
    gamesGrid.style.display = 'grid';
    
    // Clear existing games
    gamesGrid.innerHTML = '';
    
    // Create game cards compatible with main.js game player system
    GAMES.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.setAttribute('data-game', game.id); // Required for main.js compatibility
        
        gameCard.innerHTML = `
            <div class="game-icon">${game.icon}</div>
            <h3>${game.title}</h3>
            <p>${game.description}</p>
            <button class="play-button">Play Now</button>
        `;
        
        gamesGrid.appendChild(gameCard);
    });
    
    // Set up game card interactions after creating them
    setupGameCardInteractions();
}

// Setup game card interactions to work with the existing game player system
function setupGameCardInteractions() {
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        const playButton = card.querySelector('.play-button');
        const gameId = card.getAttribute('data-game');
        const gameTitle = card.querySelector('h3').textContent;
        
        if (playButton && gameId) {
            playButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Find the game configuration
                const game = GAMES.find(g => g.id === gameId);
                if (game) {
                    playGame(game.url, gameTitle);
                }
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

// Load games when page loads
document.addEventListener('DOMContentLoaded', loadGames);

function playGame(gameUrl, gameTitle) {
    console.log('Loading game:', gameUrl, gameTitle);
    
    // Get game player elements
    const gamePlayer = document.getElementById('gamePlayer');
    const gameFrame = document.getElementById('gameFrame');
    const currentGameTitle = document.getElementById('currentGameTitle');
    
    if (!gamePlayer || !gameFrame || !currentGameTitle) {
        console.error('Game player elements not found');
        // Fallback to direct navigation
        window.location.href = gameUrl;
        return;
    }
    
    // Set game title
    currentGameTitle.textContent = gameTitle || 'Loading Game...';
    
    // Load game in iframe
    gameFrame.innerHTML = `<iframe src="${gameUrl}" frameborder="0" allowfullscreen style="width: 100%; height: 100%; border: none;"></iframe>`;
    
    // Show game player
    gamePlayer.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Scroll to game player
    gamePlayer.scrollIntoView({ behavior: 'smooth' });
    
    console.log('Game loaded successfully:', gameUrl);
}

function closeGame() {
    console.log('Closing game player');
    
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
        
        // Scroll back to games section
        document.getElementById('games').scrollIntoView({ behavior: 'smooth' });
        
        console.log('Game player closed');
    }
}

/**
 * Games Configuration
 * Add new games by adding entries to this object
 * Each game should have:
 * - id: unique identifier (used in URL and file paths)
 * - title: display name
 * - icon: emoji or icon for the game card
 * - description: brief description of the game
 * - category: game category (e.g., 'Platformer', 'Puzzle', 'Strategy')
 * - difficulty: 
 */ 