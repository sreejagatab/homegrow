const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const path = require('path');
const os = require('os');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

// Import database connection
const { connectDB, setupMongooseEvents } = require('./config/db');

// Import API routes
const authRoutes = require('./routes/auth');
const forecastRoutes = require('./routes/forecast');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // Request logging
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Route logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Test route
app.get('/api/test', (req, res) => {
  console.log('Test route accessed');
  res.json({ success: true, message: 'API is working!' });
});

// Health check route with detailed status
app.get('/api/health', async (req, res) => {
  console.log('Health check route accessed');

  // Check MongoDB connection
  let dbStatus = 'disconnected';
  let dbError = null;

  if (mongoose.connection.readyState === 1) {
    dbStatus = 'connected';
  } else if (mongoose.connection.readyState === 2) {
    dbStatus = 'connecting';
  } else {
    try {
      // Try to ping the database
      await mongoose.connection.db.admin().ping();
      dbStatus = 'connected';
    } catch (error) {
      dbStatus = 'error';
      dbError = error.message;
    }
  }

  // Get system info
  const systemInfo = {
    nodeVersion: process.version,
    platform: process.platform,
    memory: {
      total: Math.round(os.totalmem() / (1024 * 1024)) + ' MB',
      free: Math.round(os.freemem() / (1024 * 1024)) + ' MB',
      usage: Math.round((os.totalmem() - os.freemem()) / os.totalmem() * 100) + '%'
    },
    uptime: Math.round(process.uptime()) + ' seconds'
  };

  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    server: {
      status: 'online',
      port: PORT,
      environment: process.env.NODE_ENV || 'development'
    },
    database: {
      status: dbStatus,
      error: dbError,
      name: mongoose.connection.name || 'unknown'
    },
    system: systemInfo
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/forecast', forecastRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('ERROR OCCURRED:');
  console.error('Error Message:', err.message);
  console.error('Error Stack:', err.stack);
  console.error('Request URL:', req.originalUrl);
  console.error('Request Method:', req.method);
  console.error('Request Body:', JSON.stringify(req.body, null, 2));

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    errors: err.errors || []
  });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../../frontend/build')));

  // Any route not handled by API routes will serve the React app
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../frontend/build', 'index.html'));
  });
}

// Set up mongoose connection event handlers
setupMongooseEvents();

// Start server with database connection
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

// Start the server
startServer();

module.exports = app; // For testing
