/**
 * Fix MongoDB Connection Script
 * 
 * This script updates the .env file with the correct MongoDB connection string
 * based on whether you're using Docker or a local MongoDB installation.
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Path to .env file
const envFilePath = path.join(__dirname, '.env');

// Check if .env file exists
if (!fs.existsSync(envFilePath)) {
  console.error('.env file not found at:', envFilePath);
  process.exit(1);
}

// Read the current .env file
const envContent = fs.readFileSync(envFilePath, 'utf8');

// Check if Docker is running
console.log('Checking if Docker is running...');
exec('docker ps', (error, stdout, stderr) => {
  const isDockerRunning = !error;
  
  if (isDockerRunning) {
    console.log('Docker is running.');
    
    // Check if MongoDB container is running
    console.log('Checking if MongoDB container is running...');
    exec('docker ps --filter "name=mongo" --format "{{.Names}}"', (error, stdout, stderr) => {
      const isMongoContainerRunning = !error && stdout.trim() !== '';
      
      if (isMongoContainerRunning) {
        console.log('MongoDB container is running:', stdout.trim());
        updateEnvFile('mongodb://mongo:27017/homegrow', 'Docker MongoDB');
      } else {
        console.log('MongoDB container is not running.');
        checkLocalMongoDB();
      }
    });
  } else {
    console.log('Docker is not running or not installed.');
    checkLocalMongoDB();
  }
});

function checkLocalMongoDB() {
  console.log('Checking if local MongoDB is running...');
  
  const command = process.platform === 'win32' ? 
    'sc query MongoDB' : 
    'pgrep mongod';
  
  exec(command, (error, stdout, stderr) => {
    const isLocalMongoRunning = !error && 
      (process.platform === 'win32' ? stdout.includes('RUNNING') : stdout.trim() !== '');
    
    if (isLocalMongoRunning) {
      console.log('Local MongoDB is running.');
      updateEnvFile('mongodb://localhost:27017/homegrow', 'Local MongoDB');
    } else {
      console.log('Local MongoDB is not running.');
      console.log('Please install and start MongoDB, or use Docker.');
      console.log('For now, setting connection string to local MongoDB.');
      updateEnvFile('mongodb://localhost:27017/homegrow', 'Local MongoDB (not confirmed)');
    }
  });
}

function updateEnvFile(mongoURI, type) {
  // Update the MONGODB_URI in the .env file
  const updatedEnvContent = envContent.replace(
    /MONGODB_URI=.*/g, 
    `MONGODB_URI=${mongoURI}`
  );
  
  // Write the updated .env file
  fs.writeFileSync(envFilePath, updatedEnvContent);
  
  console.log(`\nUpdated .env file with ${type} connection string:`);
  console.log(`MONGODB_URI=${mongoURI}`);
  
  // Check if the connection string was actually changed
  if (envContent.includes(`MONGODB_URI=${mongoURI}`)) {
    console.log('The connection string was already set correctly.');
  }
  
  console.log('\nYou can now test the MongoDB connection with:');
  console.log('node test-mongodb-connection.js');
}
