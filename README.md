<<<<<<< HEAD
# Connections Game

A word-connection puzzle game where players find groups of 4 related words.

## Project Structure

```
connections/
├── data/
│   └── wordBank.js      # Contains all word categories and difficulties
├── js/
│   └── gameLogic.js     # Game logic and level management
├── index.html           # Main game interface
├── server.js           # Simple Express server
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

3. Access the game at `http://localhost:3000`

## Key Features

- 50 progressive difficulty levels
- Multiple word categories
- Dark/Light theme toggle
- Responsive design
- Mobile-friendly interface
- Lives system (4 tries per level)
- Progress tracking
- Animated feedback

## Game Structure

### Main Components:
- 4x4 grid of word buttons
- Level progress indicator
- Lives counter
- Submit button
- Next level button
- Theme toggle
- Success/Error messages

### Difficulty Progression:
- Levels 1-10: Easy (difficulty 1-2)
- Levels 11-25: Medium (difficulty 1-3)
- Levels 26-40: Hard (difficulty 2-3)
- Levels 41-50: Expert (difficulty 2-4)

## Technical Details

### Dependencies
- Express.js (for local server)
- ES6 Modules
- CSS Variables for theming
- Responsive CSS Grid layout

### Features to Implement
1. Main game grid (4x4)
2. Word selection system
3. Category matching logic
4. Level progression
5. Score tracking
6. Theme switching
7. Responsive design
8. Animation effects

## Core Files Structure

1. `index.html`: Contains game UI and style definitions
2. `gameLogic.js`: Handles game mechanics and state
3. `wordBank.js`: Database of categorized words
4. `server.js`: Basic Express server configuration

## Important CSS Variables

```css
:root {
  --bg-color
  --container-bg
  --text-color
  --button-bg
  --button-border
  --button-selected
  --button-selected-border
  --submit-btn-bg
  --submit-btn-hover
}
```

## Game Logic Overview

1. Word Selection:
   - Maximum 4 words
   - Visual feedback on selection
   - Submit button enables with 4 selections

2. Category Matching:
   - All 4 words must be from same category
   - Success removes matched words
   - Failure reduces lives

3. Level Progression:
   - Complete when all words matched
   - Difficulty increases with levels
   - Lives reset each level

4. Theme System:
   - Light/Dark modes
   - System preference detection
   - Smooth transitions

## Using with App Koder

1. Create new project
2. Set up file structure as shown above
3. Copy each file's contents
4. Install Express dependency
5. Update paths if needed
6. Test functionality

Remember to test touch interactions and responsive layout when implementing on mobile devices.
=======
# connections
>>>>>>> 590663d249b0bc4708e494d2333b5476dd5fe19d
