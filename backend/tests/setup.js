/**
 * Jest setup file
 * 
 * This file runs before each test file and sets up the test environment.
 */

// Load environment variables from .env.test file if it exists
require('dotenv').config({ path: '.env.test' });

// Set default environment variables for testing if not already set
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.PORT = process.env.PORT || 5001;
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/homegrow_test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_key';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

// Global setup
beforeAll(async () => {
  // Add any global setup here
  console.log('Starting tests with environment:', process.env.NODE_ENV);
  console.log('Using test database:', process.env.MONGODB_URI);
});

// Global teardown
afterAll(async () => {
  // Add any global teardown here
  console.log('All tests completed');
});

// Increase timeout for all tests
jest.setTimeout(30000);
