/**
 * Database helper functions for testing
 */

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

/**
 * Connect to the in-memory database.
 */
const connect = async () => {
  try {
    // Use MongoDB Memory Server for tests
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    
    const mongooseOpts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    // Connect to the in-memory database
    await mongoose.connect(uri, mongooseOpts);
    
    console.log(`MongoDB successfully connected to ${uri}`);
  } catch (err) {
    console.error('Error connecting to the in-memory database', err);
    throw err;
  }
};

/**
 * Drop database, close the connection and stop mongod.
 */
const closeDatabase = async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if (mongoServer) {
      await mongoServer.stop();
    }
    console.log('MongoDB connection closed');
  } catch (err) {
    console.error('Error closing the database connection', err);
    throw err;
  }
};

/**
 * Remove all data from collections.
 */
const clearDatabase = async () => {
  try {
    const collections = mongoose.connection.collections;
    
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
    console.log('Database cleared');
  } catch (err) {
    console.error('Error clearing the database', err);
    throw err;
  }
};

/**
 * Seed the database with test data.
 * @param {Object} data - The data to seed
 */
const seedDatabase = async (data) => {
  try {
    if (data.users) {
      const User = mongoose.model('User');
      await User.insertMany(data.users);
    }
    
    // Add more collections as needed
    
    console.log('Database seeded with test data');
  } catch (err) {
    console.error('Error seeding the database', err);
    throw err;
  }
};

module.exports = {
  connect,
  closeDatabase,
  clearDatabase,
  seedDatabase
};
