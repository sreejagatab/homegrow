/**
 * Docker MongoDB Connection Test Script
 * 
 * This script tests the connection to MongoDB running in Docker
 * using the connection string from the docker-compose.yml file.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { exec } = require('child_process');

console.log('=== Docker MongoDB Connection Test ===');

// Check if Docker is running
console.log('Checking if Docker is running...');
exec('docker ps', (error, stdout, stderr) => {
  if (error) {
    console.error('Error checking Docker:', error.message);
    console.log('Make sure Docker is installed and running.');
    process.exit(1);
  }
  
  console.log('Docker is running.');
  
  // Check if MongoDB container is running
  console.log('\nChecking if MongoDB container is running...');
  exec('docker ps --filter "name=mongo" --format "{{.Names}}"', (error, stdout, stderr) => {
    if (error) {
      console.error('Error checking MongoDB container:', error.message);
      process.exit(1);
    }
    
    if (!stdout.trim()) {
      console.log('MongoDB container is not running.');
      console.log('Starting Docker containers with docker-compose...');
      
      exec('docker-compose up -d mongo', (error, stdout, stderr) => {
        if (error) {
          console.error('Error starting MongoDB container:', error.message);
          console.log('Try running "docker-compose up -d" manually.');
          process.exit(1);
        }
        
        console.log('MongoDB container started.');
        testMongoConnection();
      });
    } else {
      console.log('MongoDB container is running:', stdout.trim());
      testMongoConnection();
    }
  });
});

function testMongoConnection() {
  console.log('\nTesting connection to MongoDB in Docker...');
  
  // Use the Docker MongoDB connection string
  const mongoURI = 'mongodb://mongo:27017/homegrow';
  
  console.log('Connection string:', mongoURI);
  
  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log('\n✅ Connected to MongoDB in Docker successfully!');
    console.log('Connection details:');
    console.log('- Host:', mongoose.connection.host);
    console.log('- Database:', mongoose.connection.name);
    
    // Test a simple database operation
    return mongoose.connection.db.admin().ping();
  })
  .then(() => {
    console.log('✅ Database operation successful!');
    
    // Update .env file with Docker MongoDB connection string
    console.log('\nUpdating .env file with Docker MongoDB connection string...');
    
    exec(`node -e "
      const fs = require('fs');
      const path = require('path');
      const envPath = path.join(__dirname, '.env');
      let envContent = fs.readFileSync(envPath, 'utf8');
      envContent = envContent.replace(/MONGODB_URI=.*/g, 'MONGODB_URI=mongodb://mongo:27017/homegrow');
      fs.writeFileSync(envPath, envContent);
      console.log('Updated .env file with Docker MongoDB connection string.');
    "`, (error, stdout, stderr) => {
      if (error) {
        console.error('Error updating .env file:', error.message);
      } else {
        console.log(stdout);
      }
      
      // Close MongoDB connection
      mongoose.connection.close()
        .then(() => {
          console.log('MongoDB connection closed.');
          console.log('\nYou can now start the backend server with:');
          console.log('npm run server:start');
          process.exit(0);
        });
    });
  })
  .catch(err => {
    console.error('\n❌ Error connecting to MongoDB in Docker:', err.message);
    
    console.log('\nPossible solutions:');
    console.log('1. Make sure Docker is running.');
    console.log('2. Make sure the MongoDB container is running.');
    console.log('3. Try restarting the MongoDB container:');
    console.log('   docker-compose restart mongo');
    
    process.exit(1);
  });
}
