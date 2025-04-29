/**
 * API Connection Test Utility Tests
 * 
 * Tests for the API connection test utility including:
 * - API health testing
 * - API endpoint testing
 * - Error handling
 * - Result formatting
 */

import axios from 'axios';
import * as testApiConnection from '../testApiConnection';

// Mock axios
jest.mock('axios');

describe('API Connection Test Utility', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock performance.now
    if (!window.performance) {
      window.performance = { now: jest.fn() };
    }
    window.performance.now = jest.fn()
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(100);
  });
  
  describe('testApiHealth', () => {
    it('should test API health endpoint successfully', async () => {
      // Mock successful response
      axios.get.mockResolvedValueOnce({
        status: 200,
        data: {
          success: true,
          server: { status: 'online' },
          database: { status: 'connected' }
        }
      });
      
      // Execute test
      const result = await testApiConnection.testApiHealth();
      
      // Assert
      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
      expect(result.data).toBeDefined();
      expect(result.data.server.status).toBe('online');
      expect(result.data.database.status).toBe('connected');
      expect(result.responseTime).toBe(100);
      expect(result.timestamp).toBeDefined();
      
      // Check that axios.get was called with correct URL
      expect(axios.get).toHaveBeenCalledWith('/api/health', { timeout: 5000 });
    });
    
    it('should handle API health endpoint errors', async () => {
      // Mock error response
      const error = new Error('Network Error');
      error.response = { status: 500, data: { success: false } };
      axios.get.mockRejectedValueOnce(error);
      
      // Execute test
      const result = await testApiConnection.testApiHealth();
      
      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Network Error');
      expect(result.status).toBe(500);
      expect(result.data).toEqual({ success: false });
      expect(result.timestamp).toBeDefined();
      
      // Check that axios.get was called with correct URL
      expect(axios.get).toHaveBeenCalledWith('/api/health', { timeout: 5000 });
    });
  });
  
  describe('testApiTest', () => {
    it('should test API test endpoint successfully', async () => {
      // Mock successful response
      axios.get.mockResolvedValueOnce({
        status: 200,
        data: { success: true, message: 'API is working' }
      });
      
      // Execute test
      const result = await testApiConnection.testApiTest();
      
      // Assert
      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
      expect(result.data).toBeDefined();
      expect(result.data.message).toBe('API is working');
      expect(result.timestamp).toBeDefined();
      
      // Check that axios.get was called with correct URL
      expect(axios.get).toHaveBeenCalledWith('/api/test', { timeout: 5000 });
    });
    
    it('should handle API test endpoint errors', async () => {
      // Mock error response
      const error = new Error('Network Error');
      axios.get.mockRejectedValueOnce(error);
      
      // Execute test
      const result = await testApiConnection.testApiTest();
      
      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Network Error');
      expect(result.timestamp).toBeDefined();
      
      // Check that axios.get was called with correct URL
      expect(axios.get).toHaveBeenCalledWith('/api/test', { timeout: 5000 });
    });
  });
  
  describe('testCropsApi', () => {
    it('should test crops API endpoint successfully', async () => {
      // Mock successful response
      axios.get.mockResolvedValueOnce({
        status: 200,
        data: {
          success: true,
          data: [
            { id: 'tomatoes', name: 'Tomatoes' },
            { id: 'cucumbers', name: 'Cucumbers' }
          ]
        }
      });
      
      // Execute test
      const result = await testApiConnection.testCropsApi();
      
      // Assert
      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
      expect(result.data).toBeDefined();
      expect(result.itemCount).toBe(2);
      expect(result.timestamp).toBeDefined();
      
      // Check that axios.get was called with correct URL
      expect(axios.get).toHaveBeenCalledWith('/api/forecast/crops', { timeout: 5000 });
    });
    
    it('should handle crops API endpoint errors', async () => {
      // Mock error response
      const error = new Error('Network Error');
      axios.get.mockRejectedValueOnce(error);
      
      // Execute test
      const result = await testApiConnection.testCropsApi();
      
      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Network Error');
      expect(result.timestamp).toBeDefined();
      
      // Check that axios.get was called with correct URL
      expect(axios.get).toHaveBeenCalledWith('/api/forecast/crops', { timeout: 5000 });
    });
  });
  
  describe('testClimateZonesApi', () => {
    it('should test climate zones API endpoint successfully', async () => {
      // Mock successful response
      axios.get.mockResolvedValueOnce({
        status: 200,
        data: {
          success: true,
          data: [
            { id: 'mediterranean', name: 'Mediterranean' },
            { id: 'continental', name: 'Continental' },
            { id: 'tropical', name: 'Tropical' }
          ]
        }
      });
      
      // Execute test
      const result = await testApiConnection.testClimateZonesApi();
      
      // Assert
      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
      expect(result.data).toBeDefined();
      expect(result.itemCount).toBe(3);
      expect(result.timestamp).toBeDefined();
      
      // Check that axios.get was called with correct URL
      expect(axios.get).toHaveBeenCalledWith('/api/forecast/climate-zones', { timeout: 5000 });
    });
    
    it('should handle climate zones API endpoint errors', async () => {
      // Mock error response
      const error = new Error('Network Error');
      axios.get.mockRejectedValueOnce(error);
      
      // Execute test
      const result = await testApiConnection.testClimateZonesApi();
      
      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Network Error');
      expect(result.timestamp).toBeDefined();
      
      // Check that axios.get was called with correct URL
      expect(axios.get).toHaveBeenCalledWith('/api/forecast/climate-zones', { timeout: 5000 });
    });
  });
  
  describe('testAuthApi', () => {
    it('should test auth API endpoint successfully', async () => {
      // Mock successful response
      axios.options.mockResolvedValueOnce({
        status: 200
      });
      
      // Execute test
      const result = await testApiConnection.testAuthApi();
      
      // Assert
      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
      expect(result.timestamp).toBeDefined();
      
      // Check that axios.options was called with correct URL
      expect(axios.options).toHaveBeenCalledWith('/api/auth/login');
    });
    
    it('should handle auth API endpoint with 401 status as success', async () => {
      // Mock 401 response (which is actually good for auth endpoints)
      const error = new Error('Unauthorized');
      error.response = { status: 401 };
      axios.options.mockRejectedValueOnce(error);
      
      // Execute test
      const result = await testApiConnection.testAuthApi();
      
      // Assert
      expect(result.success).toBe(true);
      expect(result.status).toBe(401);
      expect(result.message).toBe('Auth endpoint exists');
      expect(result.timestamp).toBeDefined();
      
      // Check that axios.options was called with correct URL
      expect(axios.options).toHaveBeenCalledWith('/api/auth/login');
    });
    
    it('should handle auth API endpoint with 405 status as success', async () => {
      // Mock 405 response (which is actually good for auth endpoints)
      const error = new Error('Method Not Allowed');
      error.response = { status: 405 };
      axios.options.mockRejectedValueOnce(error);
      
      // Execute test
      const result = await testApiConnection.testAuthApi();
      
      // Assert
      expect(result.success).toBe(true);
      expect(result.status).toBe(405);
      expect(result.message).toBe('Auth endpoint exists');
      expect(result.timestamp).toBeDefined();
      
      // Check that axios.options was called with correct URL
      expect(axios.options).toHaveBeenCalledWith('/api/auth/login');
    });
    
    it('should handle auth API endpoint errors', async () => {
      // Mock error response
      const error = new Error('Network Error');
      axios.options.mockRejectedValueOnce(error);
      
      // Execute test
      const result = await testApiConnection.testAuthApi();
      
      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Network Error');
      expect(result.timestamp).toBeDefined();
      
      // Check that axios.options was called with correct URL
      expect(axios.options).toHaveBeenCalledWith('/api/auth/login');
    });
  });
  
  describe('runAllApiTests', () => {
    it('should run all API tests and return combined results', async () => {
      // Mock individual test functions
      const mockHealthResult = { success: true, status: 200 };
      const mockTestResult = { success: true, status: 200 };
      const mockCropsResult = { success: true, status: 200, itemCount: 5 };
      const mockClimateZonesResult = { success: true, status: 200, itemCount: 3 };
      const mockAuthResult = { success: true, status: 200 };
      
      jest.spyOn(testApiConnection, 'testApiHealth').mockResolvedValue(mockHealthResult);
      jest.spyOn(testApiConnection, 'testApiTest').mockResolvedValue(mockTestResult);
      jest.spyOn(testApiConnection, 'testCropsApi').mockResolvedValue(mockCropsResult);
      jest.spyOn(testApiConnection, 'testClimateZonesApi').mockResolvedValue(mockClimateZonesResult);
      jest.spyOn(testApiConnection, 'testAuthApi').mockResolvedValue(mockAuthResult);
      
      // Execute test
      const results = await testApiConnection.runAllApiTests();
      
      // Assert
      expect(results.health).toEqual(mockHealthResult);
      expect(results.test).toEqual(mockTestResult);
      expect(results.crops).toEqual(mockCropsResult);
      expect(results.climateZones).toEqual(mockClimateZonesResult);
      expect(results.auth).toEqual(mockAuthResult);
      expect(results.timestamp).toBeDefined();
      expect(results.overallSuccess).toBe(true);
      
      // Check that all test functions were called
      expect(testApiConnection.testApiHealth).toHaveBeenCalled();
      expect(testApiConnection.testApiTest).toHaveBeenCalled();
      expect(testApiConnection.testCropsApi).toHaveBeenCalled();
      expect(testApiConnection.testClimateZonesApi).toHaveBeenCalled();
      expect(testApiConnection.testAuthApi).toHaveBeenCalled();
    });
    
    it('should set overallSuccess to false if any test fails', async () => {
      // Mock individual test functions with one failure
      const mockHealthResult = { success: true, status: 200 };
      const mockTestResult = { success: true, status: 200 };
      const mockCropsResult = { success: false, status: 500, error: 'Server Error' };
      const mockClimateZonesResult = { success: true, status: 200, itemCount: 3 };
      const mockAuthResult = { success: true, status: 200 };
      
      jest.spyOn(testApiConnection, 'testApiHealth').mockResolvedValue(mockHealthResult);
      jest.spyOn(testApiConnection, 'testApiTest').mockResolvedValue(mockTestResult);
      jest.spyOn(testApiConnection, 'testCropsApi').mockResolvedValue(mockCropsResult);
      jest.spyOn(testApiConnection, 'testClimateZonesApi').mockResolvedValue(mockClimateZonesResult);
      jest.spyOn(testApiConnection, 'testAuthApi').mockResolvedValue(mockAuthResult);
      
      // Execute test
      const results = await testApiConnection.runAllApiTests();
      
      // Assert
      expect(results.overallSuccess).toBe(false);
    });
  });
  
  describe('formatApiTestResults', () => {
    it('should format test results as a string', () => {
      // Mock test results
      const mockResults = {
        overallSuccess: true,
        timestamp: '2023-08-01T12:00:00.000Z',
        health: { success: true, status: 200, responseTime: 50 },
        test: { success: true, status: 200 },
        crops: { success: true, status: 200, itemCount: 5 },
        climateZones: { success: true, status: 200, itemCount: 3 },
        auth: { success: true, status: 200 }
      };
      
      // Execute test
      const formattedResults = testApiConnection.formatApiTestResults(mockResults);
      
      // Assert
      expect(formattedResults).toContain('API Connection Test Results');
      expect(formattedResults).toContain('Timestamp:');
      expect(formattedResults).toContain('Overall Status: SUCCESS');
      expect(formattedResults).toContain('HEALTH API: SUCCESS');
      expect(formattedResults).toContain('Response Time: 50ms');
      expect(formattedResults).toContain('CROPS API: SUCCESS');
      expect(formattedResults).toContain('Items: 5');
    });
    
    it('should include error information in formatted results', () => {
      // Mock test results with an error
      const mockResults = {
        overallSuccess: false,
        timestamp: '2023-08-01T12:00:00.000Z',
        health: { success: true, status: 200 },
        test: { success: true, status: 200 },
        crops: { success: false, status: 500, error: 'Internal Server Error' },
        climateZones: { success: true, status: 200 },
        auth: { success: true, status: 200 }
      };
      
      // Execute test
      const formattedResults = testApiConnection.formatApiTestResults(mockResults);
      
      // Assert
      expect(formattedResults).toContain('Overall Status: FAILURE');
      expect(formattedResults).toContain('CROPS API: FAILURE');
      expect(formattedResults).toContain('Error: Internal Server Error');
    });
    
    it('should handle null or undefined results', () => {
      // Execute test with null
      const formattedResultsNull = testApiConnection.formatApiTestResults(null);
      
      // Assert
      expect(formattedResultsNull).toBe('No test results available');
      
      // Execute test with undefined
      const formattedResultsUndefined = testApiConnection.formatApiTestResults(undefined);
      
      // Assert
      expect(formattedResultsUndefined).toBe('No test results available');
    });
  });
});
