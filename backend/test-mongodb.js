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

// Test MongoDB connection
console.log('\nAttempting to connect to MongoDB...');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // 5 seconds timeout for server selection
})
.then(() => {
  console.log('\n✅ MongoDB connected successfully!');
  console.log('Connection Details:');
  console.log('- Connection State:', mongoose.connection.readyState);
  console.log('- Database Name:', mongoose.connection.name);
  console.log('- Host:', mongoose.connection.host);
  console.log('- Port:', mongoose.connection.port);
  
  // Test a simple database operation
  console.log('\nTesting database operation...');
  return mongoose.connection.db.admin().ping();
})
.then(() => {
  console.log('✅ Database operation successful!');
  console.log('\nMongoDB connection is working correctly.');
  
  // Close the connection
  return mongoose.connection.close();
})
.then(() => {
  console.log('Connection closed.');
  process.exit(0);
})
.catch(err => {
  console.error('\n❌ MongoDB connection error:');
  console.error(err);
  
  // Provide troubleshooting information based on the error
  console.log('\n=== Troubleshooting Tips ===');
  
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
    console.log('1. The username or password in your connection string is incorrect.');
    console.log('2. Make sure the user has the necessary permissions to access the database.');
  } else if (err.message.includes('ECONNREFUSED')) {
    console.log('1. Connection refused - the MongoDB server is not running or not accepting connections.');
    console.log('2. Check if MongoDB is installed and running on the specified host and port.');
    console.log('3. Verify that there are no firewall rules blocking the connection.');
  }
  
  console.log('\nFor local MongoDB, make sure MongoDB is installed and running:');
  console.log('- Windows: Check if MongoDB service is running in Services');
  console.log('- Mac/Linux: Run `sudo systemctl status mongodb` or `sudo service mongodb status`');
  
  process.exit(1);
});

// Handle process termination
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
