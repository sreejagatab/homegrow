const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  console.log('Test route accessed');
  res.json({ success: true, message: 'Minimal server is working!' });
});

// MongoDB connection
const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('Connection string:', process.env.MONGODB_URI);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    return false;
  }
};

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    const dbConnected = await connectDB();
    
    if (dbConnected) {
      // Start Express server
      app.listen(PORT, () => {
        console.log(`Minimal server running on port ${PORT}`);
      });
    } else {
      console.error('Failed to start server due to database connection issues');
    }
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

// Start the server
startServer();
