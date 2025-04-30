/**
 * Auth Routes Tests
 *
 * Tests for the authentication API routes including:
 * - User registration
 * - User login
 * - Protected routes
 * - User preferences
 */

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/server');
const User = require('../../src/models/User');
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
  await mongoose.connection.close();
  await dbHelper.closeDatabase();
});

describe('Auth Routes', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.name).toBe(testUser.name);
      expect(response.body.user.email).toBe(testUser.email);

      // Verify user was created in the database
      const user = await User.findOne({ email: testUser.email });
      expect(user).toBeDefined();
      expect(user.name).toBe(testUser.name);
    });

    it('should not register a user with an existing email', async () => {
      // Create a user first
      await User.create(testUser);

      // Try to register with the same email
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Email already in use');
    });

    it('should validate registration input', async () => {
      // Missing name
      const response1 = await request(app)
        .post('/api/auth/register')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(response1.status).toBe(400);
      expect(response1.body.success).toBe(false);

      // Missing email
      const response2 = await request(app)
        .post('/api/auth/register')
        .send({
          name: testUser.name,
          password: testUser.password
        });

      expect(response2.status).toBe(400);
      expect(response2.body.success).toBe(false);

      // Missing password
      const response3 = await request(app)
        .post('/api/auth/register')
        .send({
          name: testUser.name,
          email: testUser.email
        });

      expect(response3.status).toBe(400);
      expect(response3.body.success).toBe(false);

      // Invalid email
      const response4 = await request(app)
        .post('/api/auth/register')
        .send({
          name: testUser.name,
          email: 'invalid-email',
          password: testUser.password
        });

      expect(response4.status).toBe(400);
      expect(response4.body.success).toBe(false);

      // Short password
      const response5 = await request(app)
        .post('/api/auth/register')
        .send({
          name: testUser.name,
          email: testUser.email,
          password: 'short'
        });

      expect(response5.status).toBe(400);
      expect(response5.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login a user with valid credentials', async () => {
      // Create a user first
      await User.create(testUser);

      // Login
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(testUser.email);
    });

    it('should not login with invalid email', async () => {
      // Create a user first
      await User.create(testUser);

      // Login with wrong email
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          password: testUser.password
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should not login with invalid password', async () => {
      // Create a user first
      await User.create(testUser);

      // Login with wrong password
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });

    // Test login input validation
    it('should validate login input', async () => {
      // Missing email
      const response1 = await request(app)
        .post('/api/auth/login')
        .send({
          password: testUser.password
        });

      expect(response1.status).toBe(400);
      expect(response1.body.success).toBe(false);

      // Missing password
      const response2 = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email
        });

      expect(response2.status).toBe(400);
      expect(response2.body.success).toBe(false);

      // Invalid email
      const response3 = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: testUser.password
        });

      expect(response3.status).toBe(400);
      expect(response3.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    // Test getting current user with valid token
    it('should get current user with valid token', async () => {
      // Create a user
      const user = await User.create(testUser);

      // Login to get token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      const token = loginResponse.body.token;

      // Get current user
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.email).toBe(testUser.email);
    });

    it('should not allow access without token', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Not authorized to access this route');
    });

    it('should not allow access with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalidtoken');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Not authorized to access this route');
    });
  });

  describe('PUT /api/auth/preferences', () => {
    // Test updating user preferences with valid token
    it('should update user preferences with valid token', async () => {
      // Create a user
      const user = await User.create(testUser);

      // Login to get token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      const token = loginResponse.body.token;

      // Update preferences
      const preferences = {
        defaultCountry: 'US',
        defaultRegion: 'california',
        defaultClimate: 'mediterranean',
        defaultEnvironment: 'open',
        defaultArea: 100,
        preferredCrops: ['tomatoes', 'cucumbers']
      };

      const response = await request(app)
        .put('/api/auth/preferences')
        .set('Authorization', `Bearer ${token}`)
        .send(preferences);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.preferences).toBeDefined();
      expect(response.body.data.preferences.defaultCountry).toBe(preferences.defaultCountry);
      expect(response.body.data.preferences.defaultRegion).toBe(preferences.defaultRegion);
      expect(response.body.data.preferences.defaultClimate).toBe(preferences.defaultClimate);
      expect(response.body.data.preferences.defaultEnvironment).toBe(preferences.defaultEnvironment);
      expect(response.body.data.preferences.defaultArea).toBe(preferences.defaultArea);
      expect(response.body.data.preferences.preferredCrops).toEqual(preferences.preferredCrops);

      // Verify preferences were updated in the database
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.preferences.defaultCountry).toBe(preferences.defaultCountry);
    });

    it('should not allow updating preferences without token', async () => {
      const response = await request(app)
        .put('/api/auth/preferences')
        .send({
          defaultCountry: 'US'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Not authorized to access this route');
    });

    // Test preferences input validation
    it('should validate preferences input', async () => {
      // Create a user
      const user = await User.create(testUser);

      // Login to get token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      const token = loginResponse.body.token;

      // Invalid area (negative)
      const response = await request(app)
        .put('/api/auth/preferences')
        .set('Authorization', `Bearer ${token}`)
        .send({
          defaultArea: -100
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.defaultArea).toBeDefined();
    });
  });
});
