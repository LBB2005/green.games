# Green.Games - Flexible Gaming Platform

A flexible, scalable web-based gaming platform focused on environmental education and entertainment.

## 🎮 Project Overview

Green.Games is a modern web platform designed to host educational games about environmental protection, sustainability, and climate awareness. The platform features a flexible architecture that makes it easy to add new games dynamically.

## 📁 Project Structure

```
green-games-website/
├── index.html                 # Main website page
├── css/
│   └── styles.css            # Main stylesheet
├── js/
│   ├── games-config.js       # Game configuration (
│   ├── main.js               # Main website functionality
│   └── game-loader.js        # Game loading system
├── games/
│   ├── carbon-cleaner/       # Side-scrolling platformer ✅
│   │   ├── index.html        # Game interface
│   │   ├── game.js           # Game logic
│   │   └── assets/           # Game assets
│   ├── tree-tower/           # Physics-based stacking puzzle 🚧
│   │   ├── index.html        # Game interface
│   │   ├── game.js           # Game logic
│   │   └── assets/           # Game assets
│   ├── solar-surge/          # Real-time strategy puzzle 📋
│   │   ├── index.html        # Game interface
│   │   ├── game.js           # Game logic
│   │   └── assets/           # Game assets
│   ├── ocean-rescue/         # Underwater exploration 📋
│   │   ├── index.html        # Game interface
│   │   ├── game.js           # Game logic
│   │   └── assets/           # Game assets
│   └── wind-runner/          # Endless runner 📋
│       ├── index.html        # Game interface
│       ├── game.js           # Game logic
│       └── assets/           # Game assets
├── assets/
│   ├── images/               # Website images/icons
│   └── sounds/               # Website sounds
└── README.md                 # Project documentation
```

## 🎯 Game Descriptions

### 🌱 Carbon Cleaner ✅ **FULLY IMPLEMENTED**
A side-scrolling platformer where players control an eco-hero navigating through polluted environments. Collect renewable energy sources (solar, wind, hydro) while avoiding pollution obstacles.

**Features:**
- 3 increasingly difficult levels
- Multiple renewable energy collectibles
- Pollution obstacles with different effects
- Health system and scoring
- Mobile-responsive controls
- Particle effects and animations

**Controls:**
- Arrow keys or WASD for movement
- Spacebar for jump
- Touch controls for mobile

### 🌳 Tree Tower 🚧 **IN DEVELOPMENT**
A physics-based stacking puzzle where players build forest ecosystems by strategically placing different tree types. Each tree has unique properties affecting stability and biodiversity.

**Planned Features:**
- 5 different tree types with unique properties
- Physics-based stacking mechanics
- Ecosystem health scoring
- Seasonal changes affecting gameplay
- Wildlife attraction system

### ☀️ Solar Surge 📋 **PLANNED**
A real-time strategy puzzle where players position solar panels to capture maximum energy as the sun moves across the sky. Features dynamic shadows and weather effects.

**Planned Features:**
- Grid-based solar panel placement
- Real-time sun movement simulation
- Weather effects on efficiency
- Multiple solar panel types
- Energy optimization challenges

### 🌊 Ocean Rescue 📋 **PLANNED**
An underwater exploration game where players clean up ocean plastic while protecting marine life. Features stealth mechanics and oxygen management.

**Planned Features:**
- Underwater navigation with fluid physics
- Marine life interaction system
- Plastic collection mechanics
- Oxygen management
- Multiple ocean zones

### 💨 Wind Runner 📋 **PLANNED**
An endless runner through renewable energy landscapes. Players race through diverse biomes powered by clean energy sources.

**Planned Features:**
- Procedural level generation
- Multiple renewable energy biomes
- Power-up system
- Environmental storytelling
- Achievement system

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (for development)

### Installation

1. **Clone or download the project**
   ```bash
   git clone [repository-url]
   cd green-games-website
   ```

2. **Set up a local web server**
   
   **Option A: Using Python**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```

   **Option B: Using Node.js**
   ```bash
   npx http-server
   ```

   **Option C: Using PHP**
   ```bash
   php -S localhost:8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### Development Setup

1. **File Structure**
   - Ensure all files are in the correct directories as shown in the project structure
   - Check that all game folders have the required files

2. **Testing**
   - Test each game individually by navigating to `games/[game-name]/index.html`
   - Test the main website integration through `index.html`
   - Verify mobile responsiveness

3. **Browser Compatibility**
   - Test in Chrome, Firefox, Safari, and Edge
   - Verify touch controls work on mobile devices
   - Check that fullscreen mode functions properly

## 🎨 Design System

### Color Palette
- **Primary Green**: `#10b981` - Main brand color
- **Secondary Green**: `#059669` - Accent color
- **Dark Green**: `#064e3b` - Background variations
- **Light Green**: `#6ee7b7` - Highlights
- **Accent Blue**: `#3b82f6` - Interactive elements
- **Background Dark**: `#0f172a` - Main background
- **Background Card**: `#1e293b` - Card backgrounds

### Typography
- **Primary Font**: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
- **Monospace**: For code and technical elements

### Design Principles
- Dark theme for reduced eye strain
- Eco-friendly color scheme
- Modern, clean interface
- Responsive design for all devices
- Accessible color contrasts
- Smooth animations and transitions

## 🔧 Technical Implementation

### Core Technologies
- **HTML5**: Semantic markup and canvas elements
- **CSS3**: Modern styling with CSS Grid, Flexbox, and custom properties
- **JavaScript (ES6+)**: Game logic, animations, and interactivity
- **Canvas API**: 2D graphics rendering for games
- **Web APIs**: Fullscreen, touch events, local storage

### Performance Optimizations
- 60fps game loops using `requestAnimationFrame`
- Efficient collision detection algorithms
- Optimized rendering with canvas
- Responsive image loading
- Minimal DOM manipulation

### Browser Support
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎮 Game Development Guidelines

### Code Standards
- Use JSDoc comments for all functions and classes
- Follow consistent naming conventions
- Implement comprehensive error handling
- Use modular architecture for maintainability
- Include logging for debugging

### Game Architecture
Each game follows a consistent structure:

```javascript
class GameName {
    constructor() {
        // Initialize game state
        this.gameState = 'playing';
        this.score = 0;
        this.level = 1;
        
        // Setup canvas and context
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Initialize game objects
        this.player = {};
        this.gameObjects = [];
        
        // Start game loop
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.createLevel();
        this.gameLoop();
    }
    
    gameLoop() {
        if (this.gameState === 'playing') {
            this.update();
        }
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        // Update game logic
    }
    
    render() {
        // Render game elements
    }
}
```

### Asset Guidelines
- **Images**: Use WebP format when possible, provide PNG fallbacks
- **Audio**: Use MP3 for music, WAV for sound effects
- **File Sizes**: Keep individual assets under 100KB
- **Naming**: Use descriptive, lowercase names with hyphens

## 🌍 Environmental Impact

### Educational Goals
- Teach players about renewable energy sources
- Highlight environmental challenges and solutions
- Promote sustainable practices
- Raise awareness about climate change
- Encourage eco-friendly behaviors

### Game Mechanics Integration
- **Carbon Cleaner**: Shows the transition from pollution to clean energy
- **Tree Tower**: Demonstrates ecosystem balance and biodiversity
- **Solar Surge**: Educates about solar energy optimization
- **Ocean Rescue**: Highlights ocean conservation and plastic pollution
- **Wind Runner**: Showcases various renewable energy landscapes

## 🤝 Contributing

### Development Process
1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/new-game
   ```
3. **Implement your changes**
4. **Test thoroughly**
5. **Submit a pull request**

### Adding New Games
1. Create a new folder in `games/`
2. Implement `index.html` with game interface
3. Create `game.js` with game logic
4. Add game metadata to `js/game-loader.js`
5. Update this README with game information

### Code Review Checklist
- [ ] Code follows project standards
- [ ] All functions have JSDoc comments
- [ ] Error handling is implemented
- [ ] Mobile responsiveness is tested
- [ ] Performance is optimized
- [ ] Accessibility features are included

## 📱 Mobile Support

### Touch Controls
- Virtual buttons for mobile devices
- Gesture recognition for complex interactions
- Responsive design for all screen sizes
- Optimized performance for mobile hardware

### Responsive Design
- Flexible layouts using CSS Grid and Flexbox
- Mobile-first approach
- Touch-friendly interface elements
- Optimized font sizes and spacing

## 🔒 Security Considerations

### Content Security
- No external dependencies without integrity checks
- Sanitized user inputs
- Secure iframe loading for games
- HTTPS recommended for production

### Privacy
- No user data collection
- Local storage only for game preferences
- No tracking or analytics
- GDPR compliant by design

## 🚀 Deployment

### Production Setup
1. **Optimize assets**
   - Compress images and audio files
   - Minify CSS and JavaScript
   - Enable gzip compression

2. **Configure web server**
   - Set proper MIME types
   - Enable caching headers
   - Configure HTTPS

3. **Test thoroughly**
   - Cross-browser testing
   - Mobile device testing
   - Performance testing

### Hosting Options
- **GitHub Pages**: Free hosting for static sites
- **Netlify**: Easy deployment with CI/CD
- **Vercel**: Fast global CDN
- **AWS S3**: Scalable cloud hosting

## 📊 Analytics and Monitoring

### Performance Metrics
- Game load times
- Frame rate consistency
- Memory usage
- User engagement metrics

### Error Tracking
- JavaScript error logging
- Game state monitoring
- User interaction tracking
- Performance bottlenecks

## 🎯 Future Enhancements

### Planned Features
- **Multiplayer Support**: Cooperative gameplay modes
- **Leaderboards**: Global and local high scores
- **Achievement System**: Unlockable environmental milestones
- **Educational Content**: In-game facts and tips
- **Social Sharing**: Share environmental impact scores

### Technical Improvements
- **WebGL Rendering**: Enhanced graphics performance
- **Web Audio API**: Improved sound system
- **Service Workers**: Offline gameplay support
- **Progressive Web App**: Installable game experience

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Environmental Organizations**: For educational content and inspiration
- **Open Source Community**: For tools and libraries used in development
- **Game Development Community**: For technical guidance and best practices
- **Climate Scientists**: For accurate environmental information

## 📞 Support

For questions, suggestions, or contributions:
- Create an issue on GitHub
- Submit a pull request
- Contact the development team

---

**Made with 🌱 for a greener future**

*Play games. Learn about the planet. Make a difference.* 