/**
 * Forecast Service Tests
 *
 * Tests for the forecast service functionality including:
 * - Forecast calculation
 * - Planting calendar generation
 * - Risk assessment
 * - Recommendation generation
 */

const forecastService = require('../../src/services/forecastService');
const dbHelper = require('../helpers/db');

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
      },
      {
        category: 'Pest',
        name: 'Tomato Hornworm',
        likelihood: {
          mediterranean: 'Medium',
          continental: 'High',
          tropical: 'Medium'
        },
        impact: 'Moderate',
        mitigation: 'Inspect plants regularly and remove hornworms by hand.'
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
      tomatoes: 1.2,
      cucumbers: 1.1,
      bellPeppers: 1.3,
      eggplant: 1.4,
      hotPeppers: 1.2
    },
    continental: {
      tomatoes: 1.0,
      cucumbers: 1.0,
      bellPeppers: 0.9,
      eggplant: 0.8,
      hotPeppers: 0.9
    },
    tropical: {
      tomatoes: 0.9,
      cucumbers: 1.2,
      bellPeppers: 1.0,
      eggplant: 1.2,
      hotPeppers: 1.3
    }
  },
  environment: {
    open: 1.0,
    protected: 1.3,
    cooled: 1.5
  },
  experience: {
    beginner: 0.8,
    intermediate: 1.0,
    advanced: 1.2
  }
};

// Setup mocks before all tests
beforeAll(async () => {
  // Mock file system responses
  fs.promises.readFile.mockImplementation((filePath, encoding) => {
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

  await dbHelper.connect();
});

// Clear mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Close database connection after all tests
afterAll(async () => {
  await dbHelper.closeDatabase();
});

describe('Forecast Service', () => {
  describe('calculateForecast', () => {
    it('should calculate a forecast for tomatoes', async () => {
      // Setup
      const params = {
        crop: 'tomatoes',
        climate: 'mediterranean',
        environment: 'open',
        area: 100,
        experience: 'intermediate'
      };

      // Execute
      const forecast = await forecastService.calculateForecast(params);

      // Assert
      expect(forecast).toBeDefined();
      expect(forecast.cropProfile).toBeDefined();
      expect(forecast.cropProfile.name).toBe('Tomatoes');
      expect(forecast.plantingCalendar).toBeDefined();
      expect(forecast.productionMetrics).toBeDefined();
      expect(forecast.productionMetrics.totalYield).toBeDefined();
      expect(forecast.riskFactors).toBeDefined();
      expect(forecast.recommendations).toBeDefined();
    });

    it('should throw an error for invalid crop', async () => {
      // Setup
      const params = {
        crop: 'invalidCrop',
        climate: 'mediterranean',
        environment: 'open',
        area: 100,
        experience: 'intermediate'
      };

      // Execute and Assert
      await expect(forecastService.calculateForecast(params)).rejects.toThrow();
    });

    it('should throw an error for invalid climate', async () => {
      // Setup
      const params = {
        crop: 'tomatoes',
        climate: 'invalidClimate',
        environment: 'open',
        area: 100,
        experience: 'intermediate'
      };

      // Execute and Assert
      await expect(forecastService.calculateForecast(params)).rejects.toThrow();
    });

    it('should calculate different yields based on environment', async () => {
      // Setup for open environment
      const paramsOpen = {
        crop: 'tomatoes',
        climate: 'mediterranean',
        environment: 'open',
        area: 100,
        experience: 'intermediate'
      };

      // Setup for protected environment
      const paramsProtected = {
        crop: 'tomatoes',
        climate: 'mediterranean',
        environment: 'protected',
        area: 100,
        experience: 'intermediate'
      };

      // Execute
      const forecastOpen = await forecastService.calculateForecast(paramsOpen);
      const forecastProtected = await forecastService.calculateForecast(paramsProtected);

      // Assert
      expect(forecastOpen.productionMetrics.totalYield.min).toBeLessThan(forecastProtected.productionMetrics.totalYield.min);
      expect(forecastOpen.productionMetrics.totalYield.max).toBeLessThan(forecastProtected.productionMetrics.totalYield.max);
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
    });

    it('should handle file read errors', async () => {
      // Setup - mock a file read error
      fs.promises.readFile.mockRejectedValueOnce(new Error('File read error'));

      // Execute
      const crops = await forecastService.getAvailableCrops();

      // Assert
      expect(crops).toBeDefined();
      expect(Array.isArray(crops)).toBe(true);
      // The default crops array should be returned (length may vary)
      expect(crops.length).toBeGreaterThan(0);
    });
  });

  describe('getClimateZones', () => {
    it('should return a list of climate zones', async () => {
      // Execute
      const climateZones = await forecastService.getClimateZones();

      // Assert
      expect(climateZones).toBeDefined();
      expect(Array.isArray(climateZones)).toBe(true);
      expect(climateZones.length).toBeGreaterThan(0);
    });

    it('should throw an error if climate data cannot be read', async () => {
      // Setup - mock a file read error that specifically targets the climate zones file
      const originalReadFile = fs.promises.readFile;
      fs.promises.readFile = jest.fn((filePath, encoding) => {
        if (filePath.includes('climates.json')) {
          return Promise.reject(new Error('File read error'));
        }
        return originalReadFile(filePath, encoding);
      });

      // Execute and Assert
      await expect(forecastService.getClimateZones()).rejects.toThrow();

      // Restore the original mock
      fs.promises.readFile = originalReadFile;
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
