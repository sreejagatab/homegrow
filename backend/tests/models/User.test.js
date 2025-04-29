/**
 * User Model Tests
 * 
 * Tests for the User model functionality including:
 * - User creation
 * - Password hashing
 * - JWT token generation
 * - Password validation
 */

const mongoose = require('mongoose');
const User = require('../../src/models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dbHelper = require('../helpers/db');

// Test user data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'Password123'
};

// Connect to the in-memory database before all tests
beforeAll(async () => {
  await dbHelper.connect();
});

// Clear all test data after each test
afterEach(async () => {
  await dbHelper.clearDatabase();
});

// Close database connection after all tests
afterAll(async () => {
  await dbHelper.closeDatabase();
});

describe('User Model', () => {
  it('should create a new user successfully', async () => {
    // Create a new user
    const user = await User.create(testUser);
    
    // Check if user was created successfully
    expect(user).toBeDefined();
    expect(user._id).toBeDefined();
    expect(user.name).toBe(testUser.name);
    expect(user.email).toBe(testUser.email);
    
    // Password should be hashed, not stored as plain text
    expect(user.password).not.toBe(testUser.password);
  });
  
  it('should hash the password before saving', async () => {
    // Create a new user
    const user = await User.create(testUser);
    
    // Check if password is hashed
    expect(user.password).not.toBe(testUser.password);
    
    // Verify that the hashed password can be compared correctly
    const isMatch = await bcrypt.compare(testUser.password, user.password);
    expect(isMatch).toBe(true);
  });
  
  it('should not rehash the password if it is not modified', async () => {
    // Create a new user
    const user = await User.create(testUser);
    const originalPassword = user.password;
    
    // Update user without changing password
    user.name = 'Updated Name';
    await user.save();
    
    // Password should remain the same
    expect(user.password).toBe(originalPassword);
  });
  
  it('should generate a valid JWT token', async () => {
    // Create a new user
    const user = await User.create(testUser);
    
    // Generate token
    const token = user.getSignedJwtToken();
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if token contains correct user ID
    expect(decoded.id.toString()).toBe(user._id.toString());
    
    // Check if token contains user roles
    expect(decoded.roles).toEqual(user.roles);
  });
  
  it('should correctly match a valid password', async () => {
    // Create a new user
    const user = await User.create(testUser);
    
    // Test password matching
    const isMatch = await user.matchPassword(testUser.password);
    expect(isMatch).toBe(true);
  });
  
  it('should correctly reject an invalid password', async () => {
    // Create a new user
    const user = await User.create(testUser);
    
    // Test password matching with wrong password
    const isMatch = await user.matchPassword('wrongpassword');
    expect(isMatch).toBe(false);
  });
  
  it('should enforce email uniqueness', async () => {
    // Create a user
    await User.create(testUser);
    
    // Try to create another user with the same email
    try {
      await User.create({
        name: 'Another User',
        email: testUser.email, // Same email
        password: 'AnotherPassword123'
      });
      // If we reach here, the test should fail
      expect(true).toBe(false);
    } catch (error) {
      // Expect a duplicate key error
      expect(error).toBeDefined();
      expect(error.name).toBe('MongoServerError');
      expect(error.code).toBe(11000); // Duplicate key error code
    }
  });
  
  it('should enforce password minimum length', async () => {
    // Try to create a user with a short password
    try {
      await User.create({
        name: 'Short Password User',
        email: 'short@example.com',
        password: 'short' // Too short
      });
      // If we reach here, the test should fail
      expect(true).toBe(false);
    } catch (error) {
      // Expect a validation error
      expect(error).toBeDefined();
      expect(error.name).toBe('ValidationError');
      expect(error.errors.password).toBeDefined();
    }
  });
  
  it('should have default user role', async () => {
    // Create a new user
    const user = await User.create(testUser);
    
    // Check default role
    expect(user.roles).toBeDefined();
    expect(user.roles).toContain('user');
    expect(user.roles).not.toContain('admin');
  });
  
  it('should allow setting custom roles', async () => {
    // Create a new admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'AdminPassword123',
      roles: ['user', 'admin']
    });
    
    // Check roles
    expect(adminUser.roles).toContain('user');
    expect(adminUser.roles).toContain('admin');
  });
  
  it('should store user preferences', async () => {
    // Create a user with preferences
    const userWithPrefs = await User.create({
      name: 'Preferences User',
      email: 'prefs@example.com',
      password: 'PrefsPassword123',
      preferences: {
        defaultCountry: 'US',
        defaultRegion: 'california',
        defaultClimate: 'mediterranean',
        defaultEnvironment: 'open',
        defaultArea: 100,
        preferredCrops: ['tomatoes', 'cucumbers']
      }
    });
    
    // Check preferences
    expect(userWithPrefs.preferences).toBeDefined();
    expect(userWithPrefs.preferences.defaultCountry).toBe('US');
    expect(userWithPrefs.preferences.defaultRegion).toBe('california');
    expect(userWithPrefs.preferences.defaultClimate).toBe('mediterranean');
    expect(userWithPrefs.preferences.defaultEnvironment).toBe('open');
    expect(userWithPrefs.preferences.defaultArea).toBe(100);
    expect(userWithPrefs.preferences.preferredCrops).toContain('tomatoes');
    expect(userWithPrefs.preferences.preferredCrops).toContain('cucumbers');
  });
});
