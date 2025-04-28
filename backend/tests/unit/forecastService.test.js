const forecastService = require('../../src/services/forecastService');
const mockData = require('../mock-data');

// Mock file system functions
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn()
  }
}));

describe('Forecast Service Tests', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Setup mock file reads
    require('fs').promises.readFile.mockImplementation((path) => {
      if (path.includes('crops.json')) {
        return Promise.resolve(JSON.stringify(mockData.crops));
      }
      if (path.includes('climates.json')) {
        return Promise.resolve(JSON.stringify(mockData.climates));
      }
      if (path.includes('yieldFactors.json')) {
        return Promise.resolve(JSON.stringify(mockData.yieldFactors));
      }
      return Promise.reject(new Error('File not found'));
    });
  });
  
  describe('calculateForecast', () => {
    it('should calculate forecast for tomatoes correctly', async () => {
      // Arrange
      const params = {
        crop: 'tomatoes',
        climate: 'mediterranean',
        environment: 'protected',
        area: 10,
        experience: 'intermediate'
      };
      
      // Act
      const result = await forecastService.calculateForecast(params);
      
      // Assert
      expect(result).toBeDefined();
      expect(result.cropProfile).toBeDefined();
      expect(result.cropProfile.name).toBe('Tomatoes');
      expect(result.plantingCalendar).toBeDefined();
      expect(result.productionMetrics).toBeDefined();
      expect(result.productionMetrics.totalYield).toBeDefined();
      expect(result.riskFactors).toBeDefined();
      expect(result.recommendations).toBeDefined();
    });
    
    it('should adjust yields based on climate and environment', async () => {
      // Arrange
      const baseParams = {
        crop: 'tomatoes',
        area: 10,
        experience: 'intermediate'
      };
      
      // Act
      const mediterraneanProtected = await forecastService.calculateForecast({
        ...baseParams,
        climate: 'mediterranean',
        environment: 'protected'
      });
      
      const continentalOpen = await forecastService.calculateForecast({
        ...baseParams,
        climate: 'continental',
        environment: 'open'
      });
      
      // Assert - Mediterranean protected should have higher yields than Continental open
      expect(mediterraneanProtected.productionMetrics.totalYield.min)
        .toBeGreaterThan(continentalOpen.productionMetrics.totalYield.min);
      
      expect(mediterraneanProtected.productionMetrics.totalYield.max)
        .toBeGreaterThan(continentalOpen.productionMetrics.totalYield.max);
    });
    
    it('should throw error for invalid crop', async () => {
      // Arrange
      const params = {
        crop: 'invalidCrop',
        climate: 'mediterranean',
        environment: 'protected',
        area: 10
      };
      
      // Act & Assert
      await expect(forecastService.calculateForecast(params))
        .rejects.toThrow('Crop data not found');
    });
    
    it('should throw error for invalid climate', async () => {
      // Arrange
      const params = {
        crop: 'tomatoes',
        climate: 'invalidClimate',
        environment: 'protected',
        area: 10
      };
      
      // Act & Assert
      await expect(forecastService.calculateForecast(params))
        .rejects.toThrow('Climate data not found');
    });
  });
  
  describe('getAvailableCrops', () => {
    it('should return all available crops', async () => {
      // Act
      const result = await forecastService.getAvailableCrops();
      
      // Assert
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
    });
  });
  
  describe('getClimateZones', () => {
    it('should return all climate zones', async () => {
      // Act
      const result = await forecastService.getClimateZones();
      
      // Assert
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('description');
    });
  });
});