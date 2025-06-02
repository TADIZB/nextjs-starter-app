const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;  // Using port 8000 as specified

// Middleware
app.use(cors());
app.use(express.json());

// In-memory alerts storage
let alerts = [
  {
    id: 1,
    title: "Welcome",
    message: "Welcome to the Alert App!",
    timestamp: new Date().toISOString()
  }
];
let nextId = 2; // Start from 2 since we have one initial alert

// GET all alerts
app.get('/api/alerts', (req, res) => {
  res.json(alerts);
});

// POST new alert
app.post('/api/alerts', (req, res) => {
  const { title, message } = req.body;
  
  if (!title || !message) {
    return res.status(400).json({ error: 'Title and message are required' });
  }

  const newAlert = {
    id: nextId++,
    title,
    message,
    timestamp: new Date().toISOString()
  };

  alerts.unshift(newAlert); // Add to beginning of array
  res.status(201).json(newAlert);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
