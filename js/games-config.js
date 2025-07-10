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
    
    // Create game cards
    GAMES.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.innerHTML = `
            <div class="game-icon">${game.icon}</div>
            <h3>${game.title}</h3>
            <p>${game.description}</p>
            <button class="play-button" onclick="playGame('${game.url}')">Play Now</button>
        `;
        gamesGrid.appendChild(gameCard);
    });
}

// Load games when page loads
document.addEventListener('DOMContentLoaded', loadGames);

function playGame(gameUrl) {
    // Check if it's a local game (starts with 'games/') or external URL
    if (gameUrl.startsWith('games/')) {
        // For local games, navigate directly to the game page
        window.location.href = gameUrl;
    } else {
        // For external games, use the iframe player
        const gamePlayer = document.getElementById('gamePlayer');
        const gameFrame = document.getElementById('gameFrame');
        const gameTitle = document.getElementById('currentGameTitle');
        
        // Show game player
        gamePlayer.classList.add('active');
        gamePlayer.scrollIntoView({ behavior: 'smooth' });
        
        // Load game in iframe
        gameFrame.innerHTML = `<iframe src="${gameUrl}" width="100%" height="100%" frameborder="0"></iframe>`;
        gameTitle.textContent = 'Loading Game...';
    }
}

function closeGame() {
    const gamePlayer = document.getElementById('gamePlayer');
    const gameFrame = document.getElementById('gameFrame');
    
    gamePlayer.classList.remove('active');
    gameFrame.innerHTML = '';
    
    // Scroll back to games
    document.getElementById('games').scrollIntoView({ behavior: 'smooth' });
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