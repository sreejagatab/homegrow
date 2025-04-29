const express = require('express');

// Initialize Express app
const app = express();
const PORT = 5001;

// Basic middleware
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  console.log('Root route accessed');
  res.send('Simple Express server is working!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Simple Express server running on port ${PORT}`);
});
