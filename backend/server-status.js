/**
 * Server Status Script
 * 
 * This script provides detailed information about the server environment,
 * including Node.js version, system resources, and environment variables.
 * It helps diagnose server startup issues by checking for common problems.
 */

require('dotenv').config();
const os = require('os');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Print header
console.log('='.repeat(50));
console.log('HomeGrow Forecast Tool - Server Status Check');
console.log('='.repeat(50));
console.log('');

// System information
console.log('=== System Information ===');
console.log('Node.js Version:', process.version);
console.log('Platform:', process.platform);
console.log('Architecture:', process.arch);
console.log('Total Memory:', Math.round(os.totalmem() / (1024 * 1024)) + ' MB');
console.log('Free Memory:', Math.round(os.freemem() / (1024 * 1024)) + ' MB');
console.log('CPU Cores:', os.cpus().length);
console.log('Hostname:', os.hostname());
console.log('User:', os.userInfo().username);
console.log('');

// Environment variables
console.log('=== Environment Variables ===');
console.log('NODE_ENV:', process.env.NODE_ENV || 'Not set');
console.log('PORT:', process.env.PORT || 'Not set');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set (hidden for security)' : 'Not set');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set (hidden for security)' : 'Not set');
console.log('CORS_ORIGIN:', process.env.CORS_ORIGIN || 'Not set');
console.log('');

// File system checks
console.log('=== File System Checks ===');
const requiredFiles = [
  'package.json',
  'src/server.js',
  'src/config/db.js',
  '.env'
];

requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  try {
    fs.accessSync(filePath, fs.constants.R_OK);
    console.log(`✅ ${file} exists and is readable`);
  } catch (err) {
    console.log(`❌ ${file} is missing or not readable`);
  }
});
console.log('');

// Check if MongoDB is installed
console.log('=== MongoDB Status ===');
try {
  if (process.platform === 'win32') {
    try {
      execSync('sc query MongoDB', { stdio: 'pipe' });
      console.log('✅ MongoDB service is installed on Windows');
    } catch (err) {
      console.log('❌ MongoDB service is not installed or not running on Windows');
    }
  } else {
    try {
      execSync('which mongod', { stdio: 'pipe' });
      console.log('✅ MongoDB is installed');
      
      try {
        if (process.platform === 'darwin') {
          // macOS
          execSync('pgrep mongod', { stdio: 'pipe' });
        } else {
          // Linux
          execSync('systemctl status mongodb || systemctl status mongod', { stdio: 'pipe' });
        }
        console.log('✅ MongoDB service appears to be running');
      } catch (err) {
        console.log('❌ MongoDB service does not appear to be running');
      }
    } catch (err) {
      console.log('❌ MongoDB is not installed or not in PATH');
    }
  }
} catch (err) {
  console.log('Could not determine MongoDB status');
}
console.log('');

// Check network ports
console.log('=== Network Status ===');
const port = process.env.PORT || 5001;
try {
  const netstat = process.platform === 'win32' 
    ? execSync(`netstat -ano | findstr :${port}`, { stdio: 'pipe' }).toString()
    : execSync(`netstat -tuln | grep :${port}`, { stdio: 'pipe' }).toString();
  
  if (netstat.trim()) {
    console.log(`❌ Port ${port} is already in use by another process`);
    console.log('This might prevent the server from starting');
    console.log('Process using the port:');
    console.log(netstat);
  } else {
    console.log(`✅ Port ${port} is available`);
  }
} catch (err) {
  console.log(`✅ Port ${port} appears to be available`);
}
console.log('');

// Check npm dependencies
console.log('=== NPM Dependencies ===');
try {
  const packageJson = require('./package.json');
  console.log('Required dependencies:');
  Object.keys(packageJson.dependencies).forEach(dep => {
    try {
      require.resolve(dep);
      console.log(`✅ ${dep} is installed`);
    } catch (err) {
      console.log(`❌ ${dep} is not installed correctly`);
    }
  });
} catch (err) {
  console.log('Could not check dependencies:', err.message);
}
console.log('');

// Summary and recommendations
console.log('=== Summary ===');
console.log('This report provides information about your server environment.');
console.log('If you are experiencing issues starting the server, check for:');
console.log('1. Missing or incorrect environment variables in .env file');
console.log('2. MongoDB not running or connection issues');
console.log('3. Port conflicts with other applications');
console.log('4. Missing or incorrectly installed dependencies');
console.log('');
console.log('To start the server, run:');
console.log('npm run server:start');
console.log('');
console.log('For more detailed MongoDB connection testing, run:');
console.log('node test-mongodb.js');
console.log('');
