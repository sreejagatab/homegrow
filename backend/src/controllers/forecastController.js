const forecastService = require('../services/forecastService');
const weatherService = require('../services/weatherService');
const { formatForecastResponse } = require('../utils/formatters');

/**
 * Generate a crop forecast based on user inputs
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.generateForecast = async (req, res, next) => {
  try {
    const { 
      country, 
      region, 
      climate, 
      environment, 
      area, 
      crops = ['tomatoes', 'cucumbers', 'bellPeppers', 'eggplant', 'hotPeppers'],
      experience = 'intermediate'
    } = req.body;

    // Validate required inputs
    if (!climate || !environment || !area) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required parameters' 
      });
    }

    // Get weather data for location if available
    let weatherData = null;
    if (country && region) {
      try {
        weatherData = await weatherService.getRegionalWeatherData(country, region);
      } catch (error) {
        console.log('Weather data unavailable, using climate models only:', error.message);
      }
    }

    // Generate forecast for each requested crop
    const forecastResults = {};
    
    for (const crop of crops) {
      const forecast = await forecastService.calculateForecast({
        crop,
        climate,
        environment,
        area: parseFloat(area),
        weatherData,
        experience
      });
      
      forecastResults[crop] = forecast;
    }

    // Format and return the response
    return res.status(200).json({
      success: true,
      data: formatForecastResponse(forecastResults, { country, region, climate, environment, area })
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get forecast history for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getForecastHistory = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }
    
    const history = await forecastService.getUserForecastHistory(userId);
    
    return res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Save a forecast to user's history
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.saveForecast = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const forecastData = req.body;
    
    if (!userId || !forecastData) {
      return res.status(400).json({
        success: false,
        message: 'User ID and forecast data are required'
      });
    }
    
    const savedForecast = await forecastService.saveForecastToHistory(userId, forecastData);
    
    return res.status(201).json({
      success: true,
      data: savedForecast
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get available crops for forecasting
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getAvailableCrops = async (req, res, next) => {
  try {
    const crops = await forecastService.getAvailableCrops();
    
    return res.status(200).json({
      success: true,
      data: crops
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get climate zones information
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getClimateZones = async (req, res, next) => {
  try {
    const climateZones = await forecastService.getClimateZones();
    
    return res.status(200).json({
      success: true,
      data: climateZones
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get regions for a specific country
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getRegionsByCountry = async (req, res, next) => {
  try {
    const { country } = req.params;
    
    if (!country) {
      return res.status(400).json({
        success: false,
        message: 'Country code is required'
      });
    }
    
    const regions = await forecastService.getRegionsByCountry(country);
    
    return res.status(200).json({
      success: true,
      data: regions
    });
  } catch (error) {
    next(error);
  }
};
