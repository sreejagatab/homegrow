/**
 * Auth Controller Tests
 * 
 * Tests for the authentication controller functionality including:
 * - User registration
 * - User login
 * - Getting current user
 * - Updating user preferences
 */

const mongoose = require('mongoose');
const User = require('../../src/models/User');
const authController = require('../../src/controllers/authController');
const dbHelper = require('../helpers/db');

// Mock Express request and response objects
const mockRequest = (body = {}, params = {}, user = null) => {
  return {
    body,
    params,
    user
  };
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

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
  jest.clearAllMocks();
});

// Close database connection after all tests
afterAll(async () => {
  await dbHelper.closeDatabase();
});

describe('Auth Controller', () => {
  describe('register', () => {
    it('should register a new user successfully', async () => {
      // Setup
      const req = mockRequest(testUser);
      const res = mockResponse();
      
      // Execute
      await authController.register(req, res, mockNext);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
      
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.success).toBe(true);
      expect(responseData.token).toBeDefined();
      expect(responseData.user).toBeDefined();
      expect(responseData.user.name).toBe(testUser.name);
      expect(responseData.user.email).toBe(testUser.email);
      
      // Verify user was created in the database
      const user = await User.findOne({ email: testUser.email });
      expect(user).toBeDefined();
      expect(user.name).toBe(testUser.name);
    });
    
    it('should not register a user with an existing email', async () => {
      // Create a user first
      await User.create(testUser);
      
      // Setup
      const req = mockRequest(testUser);
      const res = mockResponse();
      
      // Execute
      await authController.register(req, res, mockNext);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
      
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe('Email already in use');
    });
    
    it('should handle errors during registration', async () => {
      // Setup - create an invalid request
      const req = mockRequest({ name: 'Test User' }); // Missing email and password
      const res = mockResponse();
      
      // Execute
      await authController.register(req, res, mockNext);
      
      // Assert
      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0];
      expect(error).toBeDefined();
    });
  });
  
  describe('login', () => {
    it('should login a user with valid credentials', async () => {
      // Create a user first
      await User.create(testUser);
      
      // Setup
      const req = mockRequest({
        email: testUser.email,
        password: testUser.password
      });
      const res = mockResponse();
      
      // Execute
      await authController.login(req, res, mockNext);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
      
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.success).toBe(true);
      expect(responseData.token).toBeDefined();
      expect(responseData.user).toBeDefined();
      expect(responseData.user.email).toBe(testUser.email);
    });
    
    it('should not login with invalid email', async () => {
      // Create a user first
      await User.create(testUser);
      
      // Setup
      const req = mockRequest({
        email: 'wrong@example.com',
        password: testUser.password
      });
      const res = mockResponse();
      
      // Execute
      await authController.login(req, res, mockNext);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalled();
      
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe('Invalid credentials');
    });
    
    it('should not login with invalid password', async () => {
      // Create a user first
      await User.create(testUser);
      
      // Setup
      const req = mockRequest({
        email: testUser.email,
        password: 'wrongpassword'
      });
      const res = mockResponse();
      
      // Execute
      await authController.login(req, res, mockNext);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalled();
      
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe('Invalid credentials');
    });
    
    it('should require both email and password', async () => {
      // Setup
      const req = mockRequest({
        email: testUser.email
        // Missing password
      });
      const res = mockResponse();
      
      // Execute
      await authController.login(req, res, mockNext);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
      
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe('Please provide an email and password');
    });
  });
  
  describe('getMe', () => {
    it('should return the current user', async () => {
      // Create a user first
      const user = await User.create(testUser);
      
      // Setup
      const req = mockRequest({}, {}, user);
      const res = mockResponse();
      
      // Execute
      await authController.getMe(req, res, mockNext);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
      
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.success).toBe(true);
      expect(responseData.data).toBeDefined();
      expect(responseData.data._id.toString()).toBe(user._id.toString());
      expect(responseData.data.email).toBe(user.email);
    });
    
    it('should handle errors when getting current user', async () => {
      // Setup with invalid user ID
      const req = mockRequest({}, {}, { id: 'invalid-id' });
      const res = mockResponse();
      
      // Execute
      await authController.getMe(req, res, mockNext);
      
      // Assert
      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0];
      expect(error).toBeDefined();
    });
  });
  
  describe('updatePreferences', () => {
    it('should update user preferences', async () => {
      // Create a user first
      const user = await User.create(testUser);
      
      // Setup
      const preferences = {
        defaultCountry: 'US',
        defaultRegion: 'california',
        defaultClimate: 'mediterranean',
        defaultEnvironment: 'open',
        defaultArea: 100,
        preferredCrops: ['tomatoes', 'cucumbers']
      };
      
      const req = mockRequest(preferences, {}, user);
      const res = mockResponse();
      
      // Execute
      await authController.updatePreferences(req, res, mockNext);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
      
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.success).toBe(true);
      expect(responseData.data).toBeDefined();
      expect(responseData.data.preferences).toBeDefined();
      expect(responseData.data.preferences.defaultCountry).toBe(preferences.defaultCountry);
      expect(responseData.data.preferences.defaultRegion).toBe(preferences.defaultRegion);
      expect(responseData.data.preferences.defaultClimate).toBe(preferences.defaultClimate);
      expect(responseData.data.preferences.defaultEnvironment).toBe(preferences.defaultEnvironment);
      expect(responseData.data.preferences.defaultArea).toBe(preferences.defaultArea);
      expect(responseData.data.preferences.preferredCrops).toEqual(preferences.preferredCrops);
      
      // Verify preferences were updated in the database
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.preferences.defaultCountry).toBe(preferences.defaultCountry);
    });
    
    it('should handle errors when updating preferences', async () => {
      // Setup with invalid user ID
      const req = mockRequest({
        defaultCountry: 'US'
      }, {}, { id: 'invalid-id' });
      const res = mockResponse();
      
      // Execute
      await authController.updatePreferences(req, res, mockNext);
      
      // Assert
      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0];
      expect(error).toBeDefined();
    });
  });
});
