console.log('Basic test script running');
console.log('Environment:', process.env.NODE_ENV);
console.log('Current directory:', __dirname);
console.log('Node version:', process.version);
console.log('Process ID:', process.pid);

// Try to load some modules
try {
  const fs = require('fs');
  console.log('Successfully loaded fs module');

  // List files in current directory
  const files = fs.readdirSync('.');
  console.log('Files in current directory:', files);
} catch (err) {
  console.error('Error loading fs module:', err);
}

try {
  const express = require('express');
  console.log('Successfully loaded express module');
} catch (err) {
  console.error('Error loading express module:', err);
}

try {
  const mongoose = require('mongoose');
  console.log('Successfully loaded mongoose module');
} catch (err) {
  console.error('Error loading mongoose module:', err);
}

console.log('Test script completed');
