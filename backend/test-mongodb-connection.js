/**
 * MongoDB Connection Test Script
 * 
 * This script tests the connection to MongoDB using the connection string
 * from the .env file. It provides detailed information about the connection
 * status and any errors that occur.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const os = require('os');
const { exec } = require('child_process');

// Print environment information
console.log('=== Environment Information ===');
console.log('Node.js Version:', process.version);
console.log('Platform:', process.platform);
console.log('Architecture:', process.arch);
console.log('Total Memory:', Math.round(os.totalmem() / (1024 * 1024)) + ' MB');
console.log('Free Memory:', Math.round(os.freemem() / (1024 * 1024)) + ' MB');
console.log('Current Directory:', process.cwd());
console.log('');

// Print MongoDB connection information
console.log('=== MongoDB Connection Test ===');
console.log('MongoDB URI:', process.env.MONGODB_URI || 'Not set in .env file');

if (!process.env.MONGODB_URI) {
  console.error('ERROR: MONGODB_URI is not set in the .env file.');
  console.log('Please make sure you have a .env file with MONGODB_URI defined.');
  console.log('Example: MONGODB_URI=mongodb://localhost:27017/homegrow');
  process.exit(1);
}

// Check if MongoDB is running
console.log('\nChecking if MongoDB is running locally...');

const checkMongoDBRunning = () => {
  return new Promise((resolve) => {
    if (process.platform === 'win32') {
      // Windows
      exec('sc query MongoDB', (error, stdout) => {
        if (error) {
          console.log('MongoDB service not found or not accessible.');
          resolve(false);
          return;
        }
        
        if (stdout.includes('RUNNING')) {
          console.log('MongoDB service is running on Windows.');
          resolve(true);
        } else {
          console.log('MongoDB service is installed but not running on Windows.');
          resolve(false);
        }
      });
    } else {
      // Linux/Mac
      exec('pgrep mongod', (error, stdout) => {
        if (error || !stdout.trim()) {
          console.log('MongoDB process not found on Linux/Mac.');
          resolve(false);
          return;
        }
        
        console.log('MongoDB process is running on Linux/Mac.');
        resolve(true);
      });
    }
  });
};

// Test MongoDB connection
const testConnection = async () => {
  console.log('\nAttempting to connect to MongoDB...');
  
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout for server selection
    });
    
    console.log('\n✅ MongoDB connected successfully!');
    console.log('Connection Details:');
    console.log('- Connection State:', mongoose.connection.readyState);
    console.log('- Database Name:', mongoose.connection.name);
    console.log('- Host:', mongoose.connection.host);
    console.log('- Port:', mongoose.connection.port);
    
    // Test a simple database operation
    console.log('\nTesting database operation...');
    await mongoose.connection.db.admin().ping();
    console.log('✅ Database operation successful!');
    
    // List collections
    console.log('\nListing collections:');
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log('No collections found in the database.');
    } else {
      collections.forEach(collection => {
        console.log(`- ${collection.name}`);
      });
    }
    
    console.log('\nMongoDB connection is working correctly.');
    
    // Close the connection
    await mongoose.connection.close();
    console.log('Connection closed.');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ MongoDB connection error:', err.message);
    
    console.log('\n=== Troubleshooting Information ===');
    console.log('Error Name:', err.name);
    console.log('Error Code:', err.code || 'N/A');
    
    console.log('\nPossible solutions:');
    
    if (err.name === 'MongoNetworkError') {
      console.log('1. Make sure MongoDB is running on your machine or server.');
      console.log('2. Check if the MongoDB URI is correct in your .env file.');
      console.log('3. Verify that your network allows connections to the MongoDB server.');
      console.log('4. If using MongoDB Atlas, check if your IP is whitelisted.');
    } else if (err.name === 'MongoServerSelectionError') {
      console.log('1. MongoDB server selection timeout - the server might be down or unreachable.');
      console.log('2. Check if the MongoDB service is running.');
      console.log('3. Verify that the port in your connection string is correct.');
    } else if (err.message.includes('Authentication failed')) {
      console.log('1. Check if the username and password in your connection string are correct.');
      console.log('2. Verify that the user has access to the specified database.');
    }
    
    console.log('\nFor local MongoDB, make sure MongoDB is installed and running:');
    console.log('- Windows: Check if MongoDB service is running in Services');
    console.log('- Mac/Linux: Run `sudo systemctl status mongodb` or `sudo service mongodb status`');
    
    // Try to connect to localhost without authentication as a fallback test
    if (!process.env.MONGODB_URI.includes('localhost')) {
      console.log('\nTrying to connect to local MongoDB as a fallback test...');
      try {
        await mongoose.connect('mongodb://localhost:27017/test', {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          serverSelectionTimeoutMS: 2000,
        });
        console.log('✅ Connected to local MongoDB successfully!');
        console.log('This suggests the issue is with your connection string, not MongoDB itself.');
        await mongoose.connection.close();
      } catch (localErr) {
        console.log('❌ Could not connect to local MongoDB either:', localErr.message);
        console.log('This suggests MongoDB might not be running or accessible.');
      }
    }
    
    process.exit(1);
  }
};

// Run the tests
(async () => {
  const isMongoRunning = await checkMongoDBRunning();
  if (!isMongoRunning) {
    console.log('Warning: MongoDB does not appear to be running locally.');
    console.log('If you are using a remote MongoDB instance, you can ignore this warning.');
  }
  
  await testConnection();
})();
