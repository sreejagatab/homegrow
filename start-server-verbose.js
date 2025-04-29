const { spawn } = require('child_process');

console.log('Starting server with verbose output...');

// Start the server process
const server = spawn('node', ['src/server.js'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    DEBUG: 'express:*,mongoose:*'
  }
});

// Handle process events
server.on('error', (err) => {
  console.error('Failed to start server:', err);
});

server.on('exit', (code, signal) => {
  console.log(`Server process exited with code ${code} and signal ${signal}`);
});
