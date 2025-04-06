import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// Serve static files from the root directory
app.use(express.static(__dirname));

// Home page route (landing page with game selection)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

// Connections game route
app.get('/games/connections', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', 'connections.html'));
});

// Keep the old route for backward compatibility
app.get('/index.html', (req, res) => {
  res.redirect('/games/connections');
});

// Add routes for future games here
// Example:
// app.get('/games/memory', (req, res) => {
//   res.sendFile(path.join(__dirname, 'games', 'memory.html'));
// });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
