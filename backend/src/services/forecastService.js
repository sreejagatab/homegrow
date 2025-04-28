const fs = require('fs').promises;
const path = require('path');
const { calculateYield, calculatePlantingCalendar, assessRiskFactors } = require('../utils/calculations');

// Path to data files
const CROPS_PATH = path.join(__dirname, '../data/crops.json');
const CLIMATES_PATH = path.join(__dirname, '../data/climates.json');
const REGIONS_PATH = path.join(__dirname, '../data/regions.json');
const YIELD_FACTORS_PATH = path.join(__dirname, '../data/yieldFactors.json');

/**
 * Calculate forecast based on provided parameters
 * @param {Object} params - Forecast parameters
 * @returns {Object} Forecast data
 */
exports.calculateForecast = async (params) => {
  const { crop, climate, environment, area, weatherData, experience } = params;

  try {
    // Load crop data
    const cropData = await getCropData(crop);
    if (!cropData) {
      throw new Error(`Crop data not found for ${crop}`);
    }

    // Load climate data
    const climateData = await getClimateData(climate);
    if (!climateData) {
      throw new Error(`Climate data not found for ${climate}`);
    }

    // Load yield factors
    const yieldFactors = await getYieldFactors();

    // Calculate expected yield per square meter
    const yieldPerSquareMeter = calculateYield(
      cropData.baseYield,
      climateData,
      environment,
      yieldFactors,
      crop,
      experience
    );

    // Calculate total yield based on area
    const totalYield = {
      min: Math.round(yieldPerSquareMeter.min * area * 10) / 10,
      max: Math.round(yieldPerSquareMeter.max * area * 10) / 10
    };

    // Generate planting calendar
    const plantingCalendar = calculatePlantingCalendar(
      cropData.plantingMonths,
      climateData,
      environment,
      weatherData
    );

    // Assess risk factors
    const riskFactors = assessRiskFactors(
      cropData.risks,
      climateData,
      environment,
      weatherData
    );

    // Generate recommendations based on all factors
    const recommendations = generateRecommendations(
      cropData,
      climateData,
      environment,
      riskFactors,
      experience
    );

    // Return complete forecast
    return {
      cropProfile: {
        name: cropData.name,
        scientificName: cropData.scientificName,
        lifeCycle: cropData.lifeCycle,
        growthPattern: cropData.growthPattern,
        yieldPerSquareMeter,
        keyRequirements: cropData.keyRequirements
      },
      plantingCalendar,
      productionMetrics: {
        totalYield,
        timeToHarvest: cropData.timeToHarvest,
        harvestDuration: cropData.harvestDuration,
        maintenanceLevel: cropData.maintenanceLevel
      },
      riskFactors,
      recommendations
    };
  } catch (error) {
    console.error(`Error calculating forecast: ${error.message}`);
    throw error;
  }
};

/**
 * Get crop data from data file or database
 * @param {string} cropName - Name of the crop
 * @returns {Object} Crop data
 */
async function getCropData(cropName) {
  try {
    const cropsData = JSON.parse(await fs.readFile(CROPS_PATH, 'utf8'));
    return cropsData.find(crop => crop.id === cropName);
  } catch (error) {
    console.error(`Error reading crop data: ${error.message}`);
    throw error;
  }
}

/**
 * Get climate data from data file or database
 * @param {string} climateZone - Climate zone
 * @returns {Object} Climate data
 */
async function getClimateData(climateZone) {
  try {
    const climatesData = JSON.parse(await fs.readFile(CLIMATES_PATH, 'utf8'));
    return climatesData.find(climate => climate.id === climateZone);
  } catch (error) {
    console.error(`Error reading climate data: ${error.message}`);
    throw error;
  }
}

/**
 * Get yield factors from data file or database
 * @returns {Object} Yield factors
 */
async function getYieldFactors() {
  try {
    return JSON.parse(await fs.readFile(YIELD_FACTORS_PATH, 'utf8'));
  } catch (error) {
    console.error(`Error reading yield factors: ${error.message}`);
    throw error;
  }
}

/**
 * Generate recommendations based on all factors
 * @param {Object} cropData - Crop data
 * @param {Object} climateData - Climate data
 * @param {string} environment - Growing environment
 * @param {Array} riskFactors - Risk factors
 * @param {string} experience - User experience level
 * @returns {Array} Recommendations
 */
function generateRecommendations(cropData, climateData, environment, riskFactors, experience) {
  const recommendations = [];

  // Variety selection recommendations
  if (cropData.recommendedVarieties && cropData.recommendedVarieties[climateData.id]) {
    recommendations.push({
      category: 'Variety Selection',
      text: `Consider ${climateData.name}-appropriate varieties like ${cropData.recommendedVarieties[climateData.id].join(', ')}.`
    });
  }

  // Planting strategy based on environment
  if (environment === 'open') {
    recommendations.push({
      category: 'Planting Strategy',
      text: `Start seeds indoors ${cropData.seedStartWeeks} weeks before outdoor planting date for stronger transplants.`
    });
  } else if (environment === 'protected' || environment === 'cooled') {
    recommendations.push({
      category: 'Planting Strategy',
      text: `In your ${environment} environment, you can extend growing seasons by ${cropData.protectedExtensionWeeks} weeks.`
    });
  }

  // Spacing recommendations
  recommendations.push({
    category: 'Spacing',
    text: `Plant ${cropData.spacing.min}-${cropData.spacing.max} cm apart for optimal growth and air circulation.`
  });

  // Experience-based recommendations
  if (experience === 'beginner') {
    recommendations.push({
      category: 'Beginner Tips',
      text: cropData.beginnerTips || 'Start with a smaller growing area and focus on proper watering and pest monitoring.'
    });
  } else if (experience === 'advanced') {
    recommendations.push({
      category: 'Advanced Techniques',
      text: cropData.advancedTips || 'Consider succession planting every 2-3 weeks for continuous harvest.'
    });
  }

  // Add risk mitigation recommendations
  riskFactors.forEach(risk => {
    if (risk.mitigation) {
      recommendations.push({
        category: `${risk.category} Mitigation`,
        text: risk.mitigation
      });
    }
  });

  return recommendations;
}

/**
 * Get user's forecast history
 * @param {string} userId - User ID
 * @returns {Array} Forecast history
 */
exports.getUserForecastHistory = async (userId) => {
  // In a production environment, this would query a database
  // For now, we'll return mock data
  return [
    {
      id: 'forecast-1',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      params: {
        climate: 'mediterranean',
        environment: 'open',
        area: 20,
        crops: ['tomatoes', 'cucumbers']
      }
    },
    {
      id: 'forecast-2',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      params: {
        climate: 'continental',
        environment: 'protected',
        area: 15,
        crops: ['bellPeppers', 'hotPeppers']
      }
    }
  ];
};

/**
 * Save forecast to user's history
 * @param {string} userId - User ID
 * @param {Object} forecastData - Forecast data
 * @returns {Object} Saved forecast
 */
exports.saveForecastToHistory = async (userId, forecastData) => {
  // In a production environment, this would save to a database
  // For now, we'll just return the data with a mock ID
  return {
    id: `forecast-${Date.now()}`,
    createdAt: new Date().toISOString(),
    userId,
    ...forecastData
  };
};

/**
 * Get available crops for forecasting
 * @returns {Array} Available crops
 */
exports.getAvailableCrops = async () => {
  try {
    const cropsData = JSON.parse(await fs.readFile(CROPS_PATH, 'utf8'));
    return cropsData.map(crop => ({
      id: crop.id,
      name: crop.name,
      image: crop.image
    }));
  } catch (error) {
    console.error(`Error reading available crops: ${error.message}`);
    throw error;
  }
};

/**
 * Get climate zones information
 * @returns {Array} Climate zones
 */
exports.getClimateZones = async () => {
  try {
    const climatesData = JSON.parse(await fs.readFile(CLIMATES_PATH, 'utf8'));
    return climatesData.map(climate => ({
      id: climate.id,
      name: climate.name,
      description: climate.description
    }));
  } catch (error) {
    console.error(`Error reading climate zones: ${error.message}`);
    throw error;
  }
};

/**
 * Get regions for a specific country
 * @param {string} country - Country code
 * @returns {Array} Regions
 */
exports.getRegionsByCountry = async (country) => {
  try {
    const regionsData = JSON.parse(await fs.readFile(REGIONS_PATH, 'utf8'));
    const countryData = regionsData.find(c => c.code === country);
    
    if (!countryData) {
      return [];
    }
    
    return countryData.regions.map(region => ({
      id: region.id,
      name: region.name,
      climateZone: region.climateZone
    }));
  } catch (error) {
    console.error(`Error reading regions: ${error.message}`);
    throw error;
  }
};
