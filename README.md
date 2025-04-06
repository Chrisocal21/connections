# Games Collection

A collection of web-based games, including the Connections word puzzle game.

## Project Structure

```
games-collection/
├── data/
│   └── wordBank.js      # Contains word categories for Connections game
├── games/
│   └── connections.html # Connections game interface
├── js/
│   └── gameLogic.js     # Connections game logic and level management
├── home.html           # Main landing page with game selection
├── index.html          # (Legacy) Redirects to Connections game
├── server.js           # Express server with multi-game routing
└── package.json        # Project dependencies
```

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Access the game collection at `http://localhost:3000`

## Games Available

### Connections
A word-connection puzzle game where players find groups of 4 related words.

**Key Features**:
- 50 progressive difficulty levels
- Multiple word categories
- Dark/Light theme toggle
- Responsive design
- Mobile-friendly interface
- Lives system (4 tries per level)
- Progress tracking
- Animated feedback
- Restart functionality
- Highscore leaderboard with player initials

## Technical Details

### Dependencies
- Express.js (for local server)
- ES6 Modules
- CSS Variables for theming
- Responsive CSS Grid layout
- Local Storage for saving highscores

### Adding New Games
To add a new game to the collection:

1. Create a new HTML file in the `games/` directory
2. Add a route in `server.js` for the new game
3. Add a game card to the home page in `home.html`

## Developer Notes

### Shared Assets
- CSS Variables for consistent theming
- Home button included on all game pages
- Theme toggle across all pages

### Feature Roadmap
1. Add more games to the collection
2. Create shared stylesheets
3. Implement user accounts for cross-game progress
4. Add global leaderboards
