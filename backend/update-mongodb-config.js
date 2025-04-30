const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Path to .env file
const envFilePath = path.join(__dirname, '.env');

// Check if .env file exists
if (!fs.existsSync(envFilePath)) {
  console.error('.env file not found at:', envFilePath);
  process.exit(1);
}

// Read the current .env file
const envContent = fs.readFileSync(envFilePath, 'utf8');

// Parse the .env file
const envLines = envContent.split('\n');
const envVars = {};

envLines.forEach(line => {
  // Skip comments and empty lines
  if (line.trim().startsWith('#') || line.trim() === '') {
    return;
  }
  
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim();
    envVars[key] = value;
  }
});

// Create a readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Current MongoDB Configuration:');
console.log('MONGODB_URI =', envVars.MONGODB_URI || 'Not set');
console.log('\nSelect MongoDB connection type:');
console.log('1. Local MongoDB (mongodb://localhost:27017/homegrow)');
console.log('2. Docker MongoDB (mongodb://mongo:27017/homegrow)');
console.log('3. Custom MongoDB URI');

rl.question('\nEnter your choice (1-3): ', (choice) => {
  let newMongoURI;
  
  switch (choice) {
    case '1':
      newMongoURI = 'mongodb://localhost:27017/homegrow';
      break;
    case '2':
      newMongoURI = 'mongodb://mongo:27017/homegrow';
      break;
    case '3':
      rl.question('Enter your custom MongoDB URI: ', (customURI) => {
        updateEnvFile(customURI);
        rl.close();
      });
      return;
    default:
      console.log('Invalid choice. Exiting without changes.');
      rl.close();
      return;
  }
  
  updateEnvFile(newMongoURI);
  rl.close();
});

function updateEnvFile(mongoURI) {
  // Update the MONGODB_URI in the parsed env vars
  envVars.MONGODB_URI = mongoURI;
  
  // Create the new .env content
  let newEnvContent = '';
  let foundMongoURI = false;
  
  envLines.forEach(line => {
    if (line.trim().startsWith('MONGODB_URI=')) {
      newEnvContent += `MONGODB_URI=${mongoURI}\n`;
      foundMongoURI = true;
    } else {
      newEnvContent += line + '\n';
    }
  });
  
  // If MONGODB_URI wasn't in the file, add it
  if (!foundMongoURI) {
    newEnvContent += `MONGODB_URI=${mongoURI}\n`;
  }
  
  // Write the updated .env file
  fs.writeFileSync(envFilePath, newEnvContent);
  
  console.log(`\nUpdated .env file with MONGODB_URI=${mongoURI}`);
  console.log('You can now test the MongoDB connection with:');
  console.log('node test-mongodb-connection.js');
}
