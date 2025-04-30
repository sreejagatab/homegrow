/**
 * Simplified Forecast Service Tests
 */

const forecastService = require('../../src/services/forecastService');

// Mock the file system
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn()
  }
}));

// Get the mocked fs module
const fs = require('fs');

// Test data
const mockCropData = [
  {
    id: 'tomatoes',
    name: 'Tomatoes',
    scientificName: 'Solanum lycopersicum',
    lifeCycle: 'Annual',
    growthPattern: 'Vine',
    baseYield: { min: 3, max: 7 },
    timeToHarvest: { min: 60, max: 85 },
    harvestDuration: { min: 30, max: 60 },
    maintenanceLevel: 'Medium',
    keyRequirements: ['Full sun', 'Regular watering', 'Support for vines'],
    plantingMonths: {
      mediterranean: { start: 3, end: 6 },
      continental: { start: 4, end: 6 },
      tropical: { start: 2, end: 10 }
    },
    spacing: { min: 45, max: 60 },
    seedStartWeeks: 6,
    protectedExtensionWeeks: 4,
    recommendedVarieties: {
      mediterranean: ['Roma', 'San Marzano', 'Brandywine'],
      continental: ['Early Girl', 'Celebrity', 'Better Boy'],
      tropical: ['Heat Master', 'Solar Fire', 'Florida 91']
    },
    beginnerTips: 'Start with cherry tomatoes for an easier growing experience.',
    advancedTips: 'Try grafting tomatoes for increased disease resistance and yield.',
    risks: [
      {
        category: 'Disease',
        name: 'Late Blight',
        likelihood: {
          mediterranean: 'Medium',
          continental: 'High',
          tropical: 'Very High'
        },
        impact: 'Severe',
        mitigation: 'Use resistant varieties and ensure good air circulation.'
      }
    ],
    image: '/images/crops/tomato.jpg'
  }
];

const mockClimateData = [
  {
    id: 'mediterranean',
    name: 'Mediterranean',
    description: 'Hot, dry summers and mild, rainy winters',
    growingSeasons: {
      spring: { start: 3, end: 5 },
      summer: { start: 6, end: 8 },
      fall: { start: 9, end: 11 },
      winter: { start: 12, end: 2 }
    },
    averageTemperatures: {
      spring: { min: 10, max: 22 },
      summer: { min: 18, max: 32 },
      fall: { min: 12, max: 25 },
      winter: { min: 5, max: 15 }
    },
    rainfall: {
      spring: 'Moderate',
      summer: 'Low',
      fall: 'Moderate',
      winter: 'High'
    },
    extremeWeatherEvents: ['Drought', 'Heat waves']
  }
];

const mockYieldFactors = {
  climate: {
    mediterranean: {
      tomatoes: 1.2
    }
  },
  environment: {
    open: 1.0,
    protected: 1.3
  },
  experience: {
    beginner: 0.8,
    intermediate: 1.0,
    advanced: 1.2
  }
};

describe('Forecast Service', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup default mock responses
    fs.promises.readFile.mockImplementation((filePath) => {
      if (filePath.includes('crops.json')) {
        return Promise.resolve(JSON.stringify(mockCropData));
      } else if (filePath.includes('climates.json')) {
        return Promise.resolve(JSON.stringify(mockClimateData));
      } else if (filePath.includes('yieldFactors.json')) {
        return Promise.resolve(JSON.stringify(mockYieldFactors));
      } else if (filePath.includes('regions.json')) {
        return Promise.resolve(JSON.stringify([]));
      }
      return Promise.reject(new Error('File not found'));
    });
  });
  
  describe('getAvailableCrops', () => {
    it('should return a list of available crops', async () => {
      // Execute
      const crops = await forecastService.getAvailableCrops();
      
      // Assert
      expect(crops).toBeDefined();
      expect(Array.isArray(crops)).toBe(true);
      expect(crops.length).toBeGreaterThan(0);
      expect(crops[0]).toHaveProperty('id');
      expect(crops[0]).toHaveProperty('name');
    });
    
    it('should handle file read errors', async () => {
      // Setup - mock a file read error
      fs.promises.readFile.mockRejectedValueOnce(new Error('File read error'));
      
      // Execute
      const crops = await forecastService.getAvailableCrops();
      
      // Assert
      expect(crops).toBeDefined();
      expect(Array.isArray(crops)).toBe(true);
      expect(crops.length).toBeGreaterThan(0);
    });
  });
  
  describe('getUserForecastHistory', () => {
    it('should return mock forecast history for a user', async () => {
      // Execute
      const history = await forecastService.getUserForecastHistory('user123');
      
      // Assert
      expect(history).toBeDefined();
      expect(Array.isArray(history)).toBe(true);
      expect(history.length).toBe(2); // Two mock forecasts
    });
  });
  
  describe('saveForecastToHistory', () => {
    it('should save a forecast to user history', async () => {
      // Setup
      const userId = 'user123';
      const forecastData = {
        params: {
          climate: 'mediterranean',
          environment: 'open',
          area: 100,
          crops: ['tomatoes']
        },
        results: {
          tomatoes: {
            cropProfile: { name: 'Tomatoes' },
            productionMetrics: { totalYield: { min: 300, max: 700 } }
          }
        }
      };
      
      // Execute
      const savedForecast = await forecastService.saveForecastToHistory(userId, forecastData);
      
      // Assert
      expect(savedForecast).toBeDefined();
      expect(savedForecast.id).toBeDefined();
      expect(savedForecast.userId).toBe(userId);
    });
  });
});
