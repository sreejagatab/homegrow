const mongoose = require('mongoose');

// Maximum number of connection retries
const MAX_RETRIES = 5;
let retryCount = 0;

/**
 * Connect to MongoDB with retry logic
 */
const connectDB = async () => {
  console.log('MongoDB connection attempt #', retryCount + 1);

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Longer timeout for initial connection
      socketTimeoutMS: 45000, // Longer socket timeout
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);

    // Reset retry count on successful connection
    retryCount = 0;

    return conn;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);

    // Increment retry count
    retryCount += 1;

    if (retryCount < MAX_RETRIES) {
      // Wait longer between each retry
      const retryDelay = retryCount * 3000;
      console.log(`Retrying in ${retryDelay / 1000} seconds...`);

      return new Promise(resolve => {
        setTimeout(() => resolve(connectDB()), retryDelay);
      });
    } else {
      console.error('Max retries reached. Could not connect to MongoDB');
      process.exit(1); // Exit with error
    }
  }
};

// Set up mongoose connection event handlers
const setupMongooseEvents = () => {
  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
  });

  mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from MongoDB');
  });

  // Handle application termination
  process.on('SIGINT', async () => {
    try {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to application termination');
      process.exit(0);
    } catch (err) {
      console.error('Error closing MongoDB connection:', err);
      process.exit(1);
    }
  });
};

// Enable mongoose debug mode in development
if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

module.exports = {
  connectDB,
  setupMongooseEvents
};
