/**
 * Mock API Service for Testing
 * 
 * This service provides mock implementations of all API endpoints
 * for use in tests. It includes realistic mock data and simulated
 * delays to better mimic real-world API behavior.
 */

// Mock data
import mockCrops from './data/mockCrops.js';
import mockClimateZones from './data/mockClimateZones.js';
import mockForecasts from './data/mockForecasts.js';

// Default delay in milliseconds
const DEFAULT_DELAY = 100;

/**
 * Simulate API delay
 * @param {number} ms - Delay in milliseconds
 * @returns {Promise} - Promise that resolves after the delay
 */
const delay = (ms = DEFAULT_DELAY) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock API response
 * @param {any} data - Response data
 * @param {number} status - HTTP status code
 * @param {number} delayMs - Delay in milliseconds
 * @returns {Promise} - Promise that resolves with the response
 */
const mockResponse = async (data, status = 200, delayMs = DEFAULT_DELAY) => {
  await delay(delayMs);
  
  if (status >= 400) {
    throw {
      response: {
        status,
        data: {
          error: data.error || 'An error occurred',
          message: data.message || 'Something went wrong'
        }
      }
    };
  }
  
  return { data, status };
};

/**
 * Mock API service
 */
const mockApiService = {
  // Auth endpoints
  auth: {
    login: async (credentials) => {
      // Check credentials
      if (credentials.email === 'test@example.com' && credentials.password === 'Password123') {
        return mockResponse({
          success: true,
          token: 'mock-jwt-token',
          user: {
            id: '1',
            name: 'Test User',
            email: 'test@example.com'
          }
        });
      }
      
      return mockResponse({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      }, 401);
    },
    
    register: async (userData) => {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        return mockResponse({
          error: 'Invalid email',
          message: 'Please provide a valid email address'
        }, 400);
      }
      
      // Validate password length
      if (userData.password.length < 6) {
        return mockResponse({
          error: 'Invalid password',
          message: 'Password must be at least 6 characters long'
        }, 400);
      }
      
      // Check if passwords match
      if (userData.password !== userData.confirmPassword) {
        return mockResponse({
          error: 'Passwords do not match',
          message: 'Password and confirm password must match'
        }, 400);
      }
      
      return mockResponse({
        success: true,
        token: 'mock-jwt-token',
        user: {
          id: '1',
          name: userData.name,
          email: userData.email
        }
      });
    },
    
    logout: async () => {
      return mockResponse({
        success: true,
        message: 'Logged out successfully'
      });
    },
    
    verifyToken: async (token) => {
      if (token === 'mock-jwt-token') {
        return mockResponse({
          success: true,
          user: {
            id: '1',
            name: 'Test User',
            email: 'test@example.com'
          }
        });
      }
      
      return mockResponse({
        error: 'Invalid token',
        message: 'Token is invalid or expired'
      }, 401);
    }
  },
  
  // Forecast endpoints
  forecast: {
    getCrops: async () => {
      return mockResponse({
        success: true,
        crops: mockCrops
      });
    },
    
    getClimateZones: async () => {
      return mockResponse({
        success: true,
        climateZones: mockClimateZones
      });
    },
    
    generateForecast: async (forecastData) => {
      // Validate required fields
      if (!forecastData.cropId || !forecastData.climateZone || !forecastData.plantingDate) {
        return mockResponse({
          error: 'Missing required fields',
          message: 'Please provide all required fields'
        }, 400);
      }
      
      // Find crop
      const crop = mockCrops.find(c => c.id === forecastData.cropId);
      if (!crop) {
        return mockResponse({
          error: 'Invalid crop',
          message: 'The selected crop does not exist'
        }, 400);
      }
      
      // Find climate zone
      const climateZone = mockClimateZones.find(z => z.id === forecastData.climateZone);
      if (!climateZone) {
        return mockResponse({
          error: 'Invalid climate zone',
          message: 'The selected climate zone does not exist'
        }, 400);
      }
      
      // Generate mock forecast
      const forecast = {
        id: Math.random().toString(36).substring(2, 15),
        cropId: forecastData.cropId,
        cropName: crop.name,
        climateZone: forecastData.climateZone,
        plantingDate: forecastData.plantingDate,
        harvestDate: new Date(new Date(forecastData.plantingDate).getTime() + (crop.growthDays * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        yieldEstimate: {
          min: crop.yieldPerSquareFoot.min * forecastData.gardenArea,
          max: crop.yieldPerSquareFoot.max * forecastData.gardenArea,
          unit: crop.yieldPerSquareFoot.unit
        },
        waterNeeds: crop.waterNeeds,
        sunNeeds: crop.sunNeeds,
        soilNeeds: crop.soilNeeds,
        companionPlants: crop.companionPlants,
        avoidPlants: crop.avoidPlants,
        growthStages: [
          {
            name: 'Germination',
            startDay: 0,
            endDay: Math.floor(crop.growthDays * 0.1),
            description: 'Seeds germinate and seedlings emerge'
          },
          {
            name: 'Vegetative Growth',
            startDay: Math.floor(crop.growthDays * 0.1) + 1,
            endDay: Math.floor(crop.growthDays * 0.4),
            description: 'Plants develop leaves and stems'
          },
          {
            name: 'Flowering',
            startDay: Math.floor(crop.growthDays * 0.4) + 1,
            endDay: Math.floor(crop.growthDays * 0.6),
            description: 'Plants produce flowers'
          },
          {
            name: 'Fruit Development',
            startDay: Math.floor(crop.growthDays * 0.6) + 1,
            endDay: Math.floor(crop.growthDays * 0.9),
            description: 'Fruits or vegetables develop'
          },
          {
            name: 'Maturation',
            startDay: Math.floor(crop.growthDays * 0.9) + 1,
            endDay: crop.growthDays,
            description: 'Fruits or vegetables ripen and are ready for harvest'
          }
        ],
        createdAt: new Date().toISOString()
      };
      
      return mockResponse({
        success: true,
        forecast
      });
    },
    
    getSavedForecasts: async () => {
      return mockResponse({
        success: true,
        forecasts: mockForecasts
      });
    },
    
    saveForecast: async (forecast) => {
      // Validate forecast
      if (!forecast.cropId || !forecast.climateZone || !forecast.plantingDate) {
        return mockResponse({
          error: 'Invalid forecast',
          message: 'Please provide a valid forecast'
        }, 400);
      }
      
      // Add ID and timestamps
      const savedForecast = {
        ...forecast,
        id: Math.random().toString(36).substring(2, 15),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return mockResponse({
        success: true,
        forecast: savedForecast
      });
    },
    
    deleteForecast: async (forecastId) => {
      // Check if forecast exists
      const forecast = mockForecasts.find(f => f.id === forecastId);
      if (!forecast) {
        return mockResponse({
          error: 'Forecast not found',
          message: 'The forecast does not exist'
        }, 404);
      }
      
      return mockResponse({
        success: true,
        message: 'Forecast deleted successfully'
      });
    }
  },
  
  // Health endpoint
  health: {
    check: async () => {
      return mockResponse({
        success: true,
        server: {
          status: 'online',
          version: '1.0.0'
        },
        database: {
          status: 'connected',
          version: '5.0.0'
        }
      });
    }
  }
};

export default mockApiService;
