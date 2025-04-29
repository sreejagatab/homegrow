/**
 * API Service Tests
 * 
 * Tests for the API service functionality including:
 * - API requests
 * - Authentication token handling
 * - Error handling
 */

import axios from 'axios';
import * as api from '../api';

// Mock axios
jest.mock('axios');

describe('API Service', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    
    // Reset axios interceptors
    axios.interceptors.request.use.mockClear();
    axios.interceptors.response.use.mockClear();
    
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn()
      },
      writable: true
    });
  });
  
  describe('API Configuration', () => {
    it('should create axios instance with correct base URL', () => {
      // Check if axios.create was called with correct config
      expect(axios.create).toHaveBeenCalledWith({
        baseURL: expect.any(String),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    });
    
    it('should set up request interceptor for auth token', () => {
      // Check if interceptors were set up
      expect(axios.interceptors.request.use).toHaveBeenCalled();
    });
    
    it('should set up response interceptor for error handling', () => {
      // Check if interceptors were set up
      expect(axios.interceptors.response.use).toHaveBeenCalled();
    });
  });
  
  describe('Authentication Functions', () => {
    describe('setAuthToken', () => {
      it('should store token in localStorage when provided', () => {
        const token = 'test-token';
        api.setAuthToken(token);
        
        expect(localStorage.setItem).toHaveBeenCalledWith('token', token);
      });
      
      it('should remove token from localStorage when not provided', () => {
        api.setAuthToken(null);
        
        expect(localStorage.removeItem).toHaveBeenCalledWith('token');
      });
    });
    
    describe('registerUser', () => {
      it('should make POST request to register endpoint', async () => {
        // Mock successful response
        axios.post.mockResolvedValueOnce({ data: { success: true } });
        
        const userData = {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        };
        
        await api.registerUser(userData);
        
        expect(axios.post).toHaveBeenCalledWith('/auth/register', userData);
      });
      
      it('should handle registration errors', async () => {
        // Mock error response
        const error = new Error('Registration failed');
        axios.post.mockRejectedValueOnce(error);
        
        const userData = {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        };
        
        await expect(api.registerUser(userData)).rejects.toThrow();
        
        expect(axios.post).toHaveBeenCalledWith('/auth/register', userData);
      });
    });
    
    describe('loginUser', () => {
      it('should make POST request to login endpoint', async () => {
        // Mock successful response
        axios.post.mockResolvedValueOnce({ data: { success: true } });
        
        const credentials = {
          email: 'test@example.com',
          password: 'password123'
        };
        
        await api.loginUser(credentials);
        
        expect(axios.post).toHaveBeenCalledWith('/auth/login', credentials);
      });
      
      it('should handle login errors', async () => {
        // Mock error response
        const error = new Error('Login failed');
        axios.post.mockRejectedValueOnce(error);
        
        const credentials = {
          email: 'test@example.com',
          password: 'password123'
        };
        
        await expect(api.loginUser(credentials)).rejects.toThrow();
        
        expect(axios.post).toHaveBeenCalledWith('/auth/login', credentials);
      });
    });
    
    describe('getCurrentUser', () => {
      it('should make GET request to current user endpoint', async () => {
        // Mock successful response
        axios.get.mockResolvedValueOnce({ data: { success: true } });
        
        await api.getCurrentUser();
        
        expect(axios.get).toHaveBeenCalledWith('/auth/me');
      });
      
      it('should handle errors', async () => {
        // Mock error response
        const error = new Error('Failed to get current user');
        axios.get.mockRejectedValueOnce(error);
        
        await expect(api.getCurrentUser()).rejects.toThrow();
        
        expect(axios.get).toHaveBeenCalledWith('/auth/me');
      });
    });
    
    describe('logoutUser', () => {
      it('should clear auth token', () => {
        api.logoutUser();
        
        expect(localStorage.removeItem).toHaveBeenCalledWith('token');
      });
    });
  });
  
  describe('Forecast Functions', () => {
    describe('getAvailableCrops', () => {
      it('should make GET request to crops endpoint', async () => {
        // Mock successful response
        axios.get.mockResolvedValueOnce({ data: { success: true, data: [] } });
        
        await api.getAvailableCrops();
        
        expect(axios.get).toHaveBeenCalledWith('/forecast/crops');
      });
      
      it('should handle errors', async () => {
        // Mock error response
        const error = new Error('Failed to get crops');
        axios.get.mockRejectedValueOnce(error);
        
        await expect(api.getAvailableCrops()).rejects.toThrow();
        
        expect(axios.get).toHaveBeenCalledWith('/forecast/crops');
      });
    });
    
    describe('getClimateZones', () => {
      it('should make GET request to climate zones endpoint', async () => {
        // Mock successful response
        axios.get.mockResolvedValueOnce({ data: { success: true, data: [] } });
        
        await api.getClimateZones();
        
        expect(axios.get).toHaveBeenCalledWith('/forecast/climate-zones');
      });
      
      it('should handle errors', async () => {
        // Mock error response
        const error = new Error('Failed to get climate zones');
        axios.get.mockRejectedValueOnce(error);
        
        await expect(api.getClimateZones()).rejects.toThrow();
        
        expect(axios.get).toHaveBeenCalledWith('/forecast/climate-zones');
      });
    });
    
    describe('generateForecast', () => {
      it('should make POST request to forecast endpoint', async () => {
        // Mock successful response
        axios.post.mockResolvedValueOnce({ data: { success: true, data: {} } });
        
        const forecastParams = {
          climate: 'mediterranean',
          environment: 'open',
          area: 100,
          crops: ['tomatoes']
        };
        
        await api.generateForecast(forecastParams);
        
        expect(axios.post).toHaveBeenCalledWith('/forecast', forecastParams);
      });
      
      it('should handle errors', async () => {
        // Mock error response
        const error = new Error('Failed to generate forecast');
        axios.post.mockRejectedValueOnce(error);
        
        const forecastParams = {
          climate: 'mediterranean',
          environment: 'open',
          area: 100,
          crops: ['tomatoes']
        };
        
        await expect(api.generateForecast(forecastParams)).rejects.toThrow();
        
        expect(axios.post).toHaveBeenCalledWith('/forecast', forecastParams);
      });
    });
    
    describe('saveForecast', () => {
      it('should make POST request to save forecast endpoint', async () => {
        // Mock successful response
        axios.post.mockResolvedValueOnce({ data: { success: true, data: {} } });
        
        const userId = 'user123';
        const forecastData = {
          params: { climate: 'mediterranean' },
          results: { tomatoes: {} }
        };
        
        await api.saveForecast(userId, forecastData);
        
        expect(axios.post).toHaveBeenCalledWith(`/forecast/save/${userId}`, forecastData);
      });
      
      it('should handle errors', async () => {
        // Mock error response
        const error = new Error('Failed to save forecast');
        axios.post.mockRejectedValueOnce(error);
        
        const userId = 'user123';
        const forecastData = {
          params: { climate: 'mediterranean' },
          results: { tomatoes: {} }
        };
        
        await expect(api.saveForecast(userId, forecastData)).rejects.toThrow();
        
        expect(axios.post).toHaveBeenCalledWith(`/forecast/save/${userId}`, forecastData);
      });
    });
  });
});
