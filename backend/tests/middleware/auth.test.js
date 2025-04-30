/**
 * Auth Middleware Tests
 *
 * Tests for the authentication middleware functionality including:
 * - Token verification
 * - Role-based access control
 * - Handling of invalid tokens
 */

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../src/models/User');
const { protect, authorize } = require('../../src/middleware/auth');
const dbHelper = require('../helpers/db');

// Mock Express request and response objects
const mockRequest = (headers = {}, params = {}) => {
  return {
    headers,
    params
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

describe('Auth Middleware', () => {
  describe('protect', () => {
    it('should allow access with valid token', async () => {
      // Create a user
      const user = await User.create(testUser);

      // Generate token
      const token = user.getSignedJwtToken();

      // Setup request with token
      const req = mockRequest({
        authorization: `Bearer ${token}`
      });
      const res = mockResponse();

      // Execute middleware
      await protect(req, res, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalled();
      expect(req.user).toBeDefined();
      expect(req.user._id.toString()).toBe(user._id.toString());
    });

    it('should deny access with no token', async () => {
      // Setup request with no token
      const req = mockRequest({});
      const res = mockResponse();

      // Execute middleware
      await protect(req, res, mockNext);

      // Assert
      expect(mockNext).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalled();

      const responseData = res.json.mock.calls[0][0];
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe('Not authorized to access this route');
    });

    it('should deny access with invalid token', async () => {
      // Setup request with invalid token
      const req = mockRequest({
        authorization: 'Bearer invalidtoken'
      });
      const res = mockResponse();

      // Execute middleware
      await protect(req, res, mockNext);

      // Assert
      expect(mockNext).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalled();

      const responseData = res.json.mock.calls[0][0];
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe('Not authorized to access this route');
    });

    it('should deny access with expired token', async () => {
      // Create a user
      const user = await User.create(testUser);

      // Generate expired token
      const token = jwt.sign(
        { id: user._id, roles: user.roles },
        process.env.JWT_SECRET,
        { expiresIn: '1ms' } // Expire immediately
      );

      // Wait for token to expire
      await new Promise(resolve => setTimeout(resolve, 10));

      // Setup request with expired token
      const req = mockRequest({
        authorization: `Bearer ${token}`
      });
      const res = mockResponse();

      // Execute middleware
      await protect(req, res, mockNext);

      // Assert
      expect(mockNext).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalled();

      const responseData = res.json.mock.calls[0][0];
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe('Not authorized to access this route');
    });

    // Test that the middleware denies access if the user no longer exists
    it('should deny access if user no longer exists', async () => {
      // Create a user
      const user = await User.create(testUser);

      // Generate token with a valid ID but user doesn't exist
      // Use a valid MongoDB ObjectId that doesn't correspond to any user
      const nonExistentId = new mongoose.Types.ObjectId();
      const token = jwt.sign(
        { id: nonExistentId, roles: ['user'] },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Setup request with token
      const req = mockRequest({
        authorization: `Bearer ${token}`
      });
      const res = mockResponse();

      // Execute middleware
      await protect(req, res, mockNext);

      // Assert
      expect(mockNext).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalled();

      const responseData = res.json.mock.calls[0][0];
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe('Not authorized to access this route');
    });
  });

  describe('authorize', () => {
    it('should allow access with correct role', async () => {
      // Setup
      const req = {
        user: {
          roles: ['user', 'admin']
        }
      };
      const res = mockResponse();

      // Create middleware for admin role
      const adminMiddleware = authorize('admin');

      // Execute middleware
      adminMiddleware(req, res, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalled();
    });

    it('should deny access with incorrect role', async () => {
      // Setup
      const req = {
        user: {
          roles: ['user']
        }
      };
      const res = mockResponse();

      // Create middleware for admin role
      const adminMiddleware = authorize('admin');

      // Execute middleware
      adminMiddleware(req, res, mockNext);

      // Assert
      expect(mockNext).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalled();

      const responseData = res.json.mock.calls[0][0];
      expect(responseData.success).toBe(false);
      expect(responseData.message).toContain('not authorized');
    });

    it('should allow access with any of the specified roles', async () => {
      // Setup
      const req = {
        user: {
          roles: ['user', 'editor']
        }
      };
      const res = mockResponse();

      // Create middleware for multiple roles
      const middleware = authorize('admin', 'editor', 'publisher');

      // Execute middleware
      middleware(req, res, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
