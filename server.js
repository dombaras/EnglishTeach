const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.html file for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Add this new route for the story-intro page
app.get('/story-intro', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'story-intro.html'));
});

app.get('/story', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'story-summary.html'));
});

app.get('/read-story', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'read-story.html'));
});

app.get('/story-summary', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'story-summary.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
