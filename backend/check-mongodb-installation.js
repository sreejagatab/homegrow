const { exec } = require('child_process');
const os = require('os');

console.log('Checking MongoDB installation...');

// Function to check if MongoDB is installed
const checkMongoDBInstallation = () => {
  return new Promise((resolve) => {
    const command = process.platform === 'win32' ? 
      'where mongod' : 
      'which mongod';
    
    exec(command, (error, stdout) => {
      if (error || !stdout.trim()) {
        console.log('MongoDB is not installed or not in PATH.');
        resolve(false);
      } else {
        console.log('MongoDB is installed at:', stdout.trim());
        resolve(true);
      }
    });
  });
};

// Function to check if MongoDB service is running
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

// Function to provide installation instructions
const provideInstallationInstructions = () => {
  console.log('\n=== MongoDB Installation Instructions ===');
  
  if (process.platform === 'win32') {
    // Windows instructions
    console.log('Windows Installation:');
    console.log('1. Download the MongoDB Community Server from: https://www.mongodb.com/try/download/community');
    console.log('2. Run the installer and follow the installation wizard');
    console.log('3. Make sure to select "Install MongoDB as a Service" during installation');
    console.log('4. After installation, start the MongoDB service:');
    console.log('   - Open Command Prompt as Administrator');
    console.log('   - Run: net start MongoDB');
  } else if (process.platform === 'darwin') {
    // macOS instructions
    console.log('macOS Installation:');
    console.log('1. Install Homebrew if not already installed: /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"');
    console.log('2. Install MongoDB: brew tap mongodb/brew && brew install mongodb-community');
    console.log('3. Start MongoDB: brew services start mongodb-community');
  } else {
    // Linux instructions
    console.log('Linux Installation (Ubuntu/Debian):');
    console.log('1. Import the MongoDB public GPG key:');
    console.log('   wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -');
    console.log('2. Create a list file for MongoDB:');
    console.log('   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list');
    console.log('3. Update package database: sudo apt-get update');
    console.log('4. Install MongoDB: sudo apt-get install -y mongodb-org');
    console.log('5. Start MongoDB: sudo systemctl start mongod');
    console.log('6. Enable MongoDB to start on boot: sudo systemctl enable mongod');
  }
  
  console.log('\nAlternative: Use MongoDB Atlas (Cloud Database):');
  console.log('1. Create a free account at: https://www.mongodb.com/cloud/atlas/register');
  console.log('2. Create a new cluster');
  console.log('3. Configure network access (whitelist your IP)');
  console.log('4. Create a database user');
  console.log('5. Get your connection string and update it in your .env file');
  console.log('   Example: MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/homegrow?retryWrites=true&w=majority');
};

// Run the checks
(async () => {
  console.log('System Information:');
  console.log('- Platform:', process.platform);
  console.log('- Architecture:', process.arch);
  console.log('- Node.js Version:', process.version);
  console.log('- Current Directory:', process.cwd());
  
  const isInstalled = await checkMongoDBInstallation();
  
  if (isInstalled) {
    const isRunning = await checkMongoDBRunning();
    
    if (!isRunning) {
      console.log('\nMongoDB is installed but not running.');
      console.log('Please start the MongoDB service:');
      
      if (process.platform === 'win32') {
        console.log('- Open Command Prompt as Administrator');
        console.log('- Run: net start MongoDB');
      } else if (process.platform === 'darwin') {
        console.log('- Run: brew services start mongodb-community');
      } else {
        console.log('- Run: sudo systemctl start mongod');
      }
    }
  } else {
    provideInstallationInstructions();
  }
  
  console.log('\nAfter installing and starting MongoDB, update your .env file with the correct connection string:');
  console.log('MONGODB_URI=mongodb://localhost:27017/homegrow');
})();
