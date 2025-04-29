const express = require('express');
const router = express.Router();
const forecastController = require('../controllers/forecastController');

/**
 * @route   POST /api/forecast
 * @desc    Generate a crop forecast
 * @access  Public
 */
router.post('/', forecastController.generateForecast);

/**
 * @route   GET /api/forecast/crops
 * @desc    Get available crops for forecasting
 * @access  Public
 */
router.get('/crops', forecastController.getAvailableCrops);

/**
 * @route   GET /api/forecast/climate-zones
 * @desc    Get climate zones information
 * @access  Public
 */
router.get('/climate-zones', forecastController.getClimateZones);

/**
 * @route   GET /api/forecast/regions/:country
 * @desc    Get regions for a specific country
 * @access  Public
 */
router.get('/regions/:country', forecastController.getRegionsByCountry);

/**
 * @route   GET /api/forecast/regions/:country/:regionId
 * @desc    Get detailed information for a specific region
 * @access  Public
 */
router.get('/regions/:country/:regionId', forecastController.getRegionDetails);

/**
 * @route   GET /api/forecast/regions/:country/:regionId/subregions
 * @desc    Get subregions for a specific region
 * @access  Public
 */
router.get('/regions/:country/:regionId/subregions', forecastController.getSubregionsByRegion);

/**
 * @route   GET /api/forecast/regions/:country/:regionId/subregions/:subregionId
 * @desc    Get detailed information for a specific subregion
 * @access  Public
 */
router.get('/regions/:country/:regionId/subregions/:subregionId', forecastController.getSubregionDetails);

/**
 * @route   GET /api/forecast/history/:userId
 * @desc    Get forecast history for a user
 * @access  Private
 */
router.get('/history/:userId', forecastController.getForecastHistory);

/**
 * @route   POST /api/forecast/save/:userId
 * @desc    Save a forecast to user's history
 * @access  Private
 */
router.post('/save/:userId', forecastController.saveForecast);

module.exports = router;
