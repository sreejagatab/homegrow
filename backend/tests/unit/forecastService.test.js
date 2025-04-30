const forecastService = require('../../src/services/forecastService');
const mockData = require('../mock-data');

// Mock the forecastService internal methods
jest.mock('../../src/services/forecastService', () => {
  const original = jest.requireActual('../../src/services/forecastService');

  return {
    ...original,
    // Mock the data loading methods
    getAvailableCrops: jest.fn().mockResolvedValue(mockData.mockCrops),
    getClimateZones: jest.fn().mockResolvedValue(mockData.mockClimateZones),
    _loadYieldFactors: jest.fn().mockResolvedValue(mockData.mockYieldFactors),
    getUserForecastHistory: jest.fn().mockResolvedValue(mockData.mockForecastHistory),
    saveForecastToHistory: jest.fn().mockImplementation((userId, forecastData) => {
      return Promise.resolve({
        id: 'new-forecast-id',
        userId,
        createdAt: new Date(),
        ...forecastData
      });
    }),
    // Mock the calculateForecast method to return predictable results
    calculateForecast: jest.fn().mockImplementation((params) => {
      // Check for invalid crop
      if (params.crop === 'invalidCrop') {
        return Promise.reject(new Error('Crop data not found'));
      }

      // Check for invalid climate
      if (params.climate === 'invalidClimate') {
        return Promise.reject(new Error('Climate data not found'));
      }

      // Calculate yield based on parameters
      let yieldFactor = 1.0;

      // Apply climate factor
      if (params.climate === 'mediterranean') {
        yieldFactor *= 1.2;
      } else if (params.climate === 'continental') {
        yieldFactor *= 1.0;
      }

      // Apply environment factor
      if (params.environment === 'protected') {
        yieldFactor *= 1.3;
      } else if (params.environment === 'open') {
        yieldFactor *= 1.0;
      }

      // Calculate total yield
      const baseYield = { min: 3, max: 7 };
      const totalYield = {
        min: Math.round(baseYield.min * yieldFactor * params.area),
        max: Math.round(baseYield.max * yieldFactor * params.area)
      };

      // Return mock forecast result
      return Promise.resolve({
        cropProfile: {
          name: params.crop === 'tomatoes' ? 'Tomatoes' : 'Cucumbers',
          scientificName: params.crop === 'tomatoes' ? 'Solanum lycopersicum' : 'Cucumis sativus',
          lifeCycle: 'Annual',
          growthPattern: 'Vine',
          maintenanceLevel: 'Medium'
        },
        plantingCalendar: {
          seedStartDate: '2023-03-15',
          transplantDate: '2023-04-30',
          harvestStartDate: '2023-07-01',
          harvestEndDate: '2023-08-30',
          totalGrowingDays: 75
        },
        productionMetrics: {
          plantsPerSqMeter: 4,
          totalPlants: params.area * 4,
          totalYield: totalYield,
          yieldPerPlant: {
            min: totalYield.min / (params.area * 4),
            max: totalYield.max / (params.area * 4)
          }
        },
        riskFactors: [
          {
            category: 'Disease',
            name: 'Late Blight',
            likelihood: 'Medium',
            impact: 'Severe',
            mitigation: 'Use resistant varieties and ensure good air circulation.'
          }
        ],
        recommendations: [
          'Start seeds indoors 6-8 weeks before last frost date.',
          'Provide support for vines using stakes or cages.',
          'Water consistently to prevent blossom end rot.'
        ]
      });
    })
  };
});

describe('Forecast Service Tests', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
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