const axios = require('axios');
const os = require('os');

// Print environment information
console.log('=== Environment Information ===');
console.log('Node.js version:', process.version);
console.log('OS:', os.type(), os.release());
console.log('Hostname:', os.hostname());
console.log('CPU architecture:', os.arch());
console.log('Memory:', Math.round(os.totalmem() / (1024 * 1024)), 'MB');
console.log('Free memory:', Math.round(os.freemem() / (1024 * 1024)), 'MB');
console.log('Current directory:', process.cwd());
console.log('Environment variables:', Object.keys(process.env).join(', '));
console.log('==============================');

// Base URL for API
// In Docker, we need to use localhost since the server is running in the same container
// For external Docker access, we would use the service name (backend-test)
const API_URL = process.env.API_URL || 'http://localhost:5000/api';
console.log('Using API URL:', API_URL);

// Test user data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123'
};

// Function to register a user
async function registerUser() {
  try {
    console.log('Attempting to register user...');
    const response = await axios.post(`${API_URL}/auth/register`, testUser);
    console.log('Registration successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    return response.data.token;
  } catch (error) {
    console.error('Registration failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
    return null;
  }
}

// Function to login a user
async function loginUser() {
  try {
    console.log('Attempting to login user...');
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('Login successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    return response.data.token;
  } catch (error) {
    console.error('Login failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
    return null;
  }
}

// Function to get current user
async function getCurrentUser(token) {
  try {
    console.log('Attempting to get current user...');
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Get current user successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Get current user failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Function to check if server is available
async function checkServerAvailability() {
  try {
    console.log('Checking server availability...');
    const response = await axios.get(`${API_URL}/test`, { timeout: 5000 });
    console.log('Server is available!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.error('Server is not available:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
      return true; // Server responded, but with an error
    } else {
      console.error('Error:', error.message);
      return false; // Server did not respond
    }
  }
}

// Main function to run tests
async function runTests() {
  console.log('Starting authentication tests...');

  // First check if server is available
  const serverAvailable = await checkServerAvailability();
  if (!serverAvailable) {
    console.error('Cannot proceed with tests as server is not available.');
    process.exit(1);
    return;
  }

  // Start with login (in case user already exists)
  let token = await loginUser();

  // If login fails, try to register
  if (!token) {
    console.log('Login failed, trying to register...');
    token = await registerUser();
  }

  // If we have a token, test getting current user
  if (token) {
    await getCurrentUser(token);
  }

  console.log('Authentication tests completed.');
}

// Run the tests
runTests();
