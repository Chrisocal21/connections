import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// Serve static files from the root directory (except HTML files)
app.use(express.static(__dirname, {
  index: false  // Disable automatic serving of index.html
}));

// Home page route (landing page with game selection)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Connections game route
app.get('/connections', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', 'connections.html'));
});

// Reclaimed game route
app.get('/reclaimed', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', 'reclaimed.html'));
});

// Alternative paths for Reclaimed game scripts (fallback routes)
app.get('/reclaimed/gameLogic.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, 'js', 'games', 'reclaimed', 'gameLogic.js'));
});

app.get('/reclaimed/visualizations.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, 'js', 'games', 'reclaimed', 'visualizations.js'));
});

// Sudoku game route
app.get('/sudoku', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', 'sudoku.html'));
});

// Tile Quest game route
app.get('/tile-quest', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', 'tile-quest.html'));
});

// Word Search game route
app.get('/wordsearch', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', 'wordsearchgame.html'));
});

// Explicitly serve JS files for Reclaimed
app.get('/js/games/reclaimed/gameLogic.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'js', 'games', 'reclaimed', 'gameLogic.js'));
});

app.get('/js/games/reclaimed/visualizations.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'js', 'games', 'reclaimed', 'visualizations.js'));
});

// Redirect old paths to maintain backward compatibility
app.get('/games/connections', (req, res) => {
  res.redirect('/connections');
});

app.get('/games/reclaimed', (req, res) => {
  res.redirect('/reclaimed');
});

app.get('/games/sudoku', (req, res) => {
  res.redirect('/sudoku');
});

app.get('/games/tile-quest', (req, res) => {
  res.redirect('/tile-quest');
});

app.get('/games/wordsearch', (req, res) => {
  res.redirect('/wordsearch');
});

// Add routes for future games here
// Example:
// app.get('/memory', (req, res) => {
//   res.sendFile(path.join(__dirname, 'games', 'memory.html'));
// });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
