/**
 * Server Management Script
 * 
 * This script provides commands to start, stop, and check the status of the server.
 * 
 * Usage:
 *   node server-manager.js start    - Start the server
 *   node server-manager.js stop     - Stop the server
 *   node server-manager.js restart  - Restart the server
 *   node server-manager.js status   - Check server status
 */

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

// Configuration
const PID_FILE = path.join(__dirname, '.server.pid');
const SERVER_FILE = path.join(__dirname, 'src/server.js');
const PORT = process.env.PORT || 5001;

// Helper functions
function isRunning(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (e) {
    return false;
  }
}

function checkServerStatus(callback) {
  http.get(`http://localhost:${PORT}/api/health`, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        callback(null, response);
      } catch (e) {
        callback(e, null);
      }
    });
  }).on('error', (err) => {
    callback(err, null);
  });
}

// Command handlers
function startServer() {
  console.log('Starting server...');
  
  // Check if server is already running
  if (fs.existsSync(PID_FILE)) {
    const pid = parseInt(fs.readFileSync(PID_FILE, 'utf8'));
    if (isRunning(pid)) {
      console.log(`Server is already running with PID ${pid}`);
      return;
    } else {
      console.log('Removing stale PID file');
      fs.unlinkSync(PID_FILE);
    }
  }
  
  // Start the server
  const server = spawn('node', [SERVER_FILE], {
    detached: true,
    stdio: ['ignore', 
      fs.openSync(path.join(__dirname, 'server.log'), 'a'),
      fs.openSync(path.join(__dirname, 'server-error.log'), 'a')
    ]
  });
  
  // Write PID to file
  fs.writeFileSync(PID_FILE, server.pid.toString());
  
  console.log(`Server started with PID ${server.pid}`);
  server.unref();
  
  // Check if server is responding
  setTimeout(() => {
    checkServerStatus((err, data) => {
      if (err) {
        console.log('Server started but not responding to health check');
        console.log('Check server logs for details');
      } else {
        console.log('Server is running and responding to health check');
        console.log(`Server environment: ${data.server.environment}`);
        console.log(`Database status: ${data.database.status}`);
      }
    });
  }, 2000);
}

function stopServer() {
  console.log('Stopping server...');
  
  if (!fs.existsSync(PID_FILE)) {
    console.log('No PID file found. Server may not be running.');
    return;
  }
  
  const pid = parseInt(fs.readFileSync(PID_FILE, 'utf8'));
  
  if (!isRunning(pid)) {
    console.log('Server is not running');
    fs.unlinkSync(PID_FILE);
    return;
  }
  
  try {
    process.kill(pid);
    console.log(`Server with PID ${pid} stopped`);
    fs.unlinkSync(PID_FILE);
  } catch (e) {
    console.error(`Failed to stop server: ${e.message}`);
  }
}

function restartServer() {
  stopServer();
  setTimeout(() => {
    startServer();
  }, 2000);
}

function checkStatus() {
  console.log('Checking server status...');
  
  if (!fs.existsSync(PID_FILE)) {
    console.log('No PID file found. Server is not running.');
    return;
  }
  
  const pid = parseInt(fs.readFileSync(PID_FILE, 'utf8'));
  
  if (!isRunning(pid)) {
    console.log('Server is not running (stale PID file)');
    fs.unlinkSync(PID_FILE);
    return;
  }
  
  console.log(`Server process is running with PID ${pid}`);
  
  // Check if server is responding
  checkServerStatus((err, data) => {
    if (err) {
      console.log('Server process is running but not responding to health check');
      console.log(`Error: ${err.message}`);
    } else {
      console.log('Server is running and responding to health check');
      console.log(`Server environment: ${data.server.environment}`);
      console.log(`Database status: ${data.database.status}`);
      console.log(`Server uptime: ${data.system.uptime}`);
      console.log(`Memory usage: ${data.system.memory.usage}`);
    }
  });
}

// Main
const command = process.argv[2];

switch (command) {
  case 'start':
    startServer();
    break;
  case 'stop':
    stopServer();
    break;
  case 'restart':
    restartServer();
    break;
  case 'status':
    checkStatus();
    break;
  default:
    console.log('Usage: node server-manager.js [start|stop|restart|status]');
}
