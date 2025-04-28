import axios from 'axios';

// API base URL from environment or default to localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with defaults
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Generate a crop forecast
 * @param {Object} params - Forecast parameters
 * @returns {Promise} Forecast data
 */
export const generateForecast = async (params) => {
  try {
    const response = await apiClient.post('/forecast', params);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching climate zones:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch climate zones');
  }
};

/**
 * Get regions for a specific country
 * @param {string} country - Country code
 * @returns {Promise} Regions data
 */
export const getRegionsByCountry = async (country) => {
  try {
    const response = await apiClient.get(`/forecast/regions/${country}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching regions:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch regions');
  }
};

/**
 * Save a forecast to user's history
 * @param {string} userId - User ID
 * @param {Object} forecastData - Forecast data
 * @returns {Promise} Saved forecast
 */
export const saveForecast = async (userId, forecastData) => {
  try {
    const response = await apiClient.post(`/forecast/save/${userId}`, forecastData);
    return response.data.data;
  } catch (error) {
    console.error('Error saving forecast:', error);
    throw new Error(error.response?.data?.message || 'Failed to save forecast');
  }
};

/**
 * Get forecast history for a user
 * @param {string} userId - User ID
 * @returns {Promise} Forecast history
 */
export const getForecastHistory = async (userId) => {
  try {
    const response = await apiClient.get(`/forecast/history/${userId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching forecast history:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch forecast history');
  }
};

/**
 * Get weather data for a region
 * @param {string} country - Country code
 * @param {string} region - Region ID
 * @returns {Promise} Weather data
 */
export const getWeatherData = async (country, region) => {
  try {
    const response = await apiClient.get(`/weather/${country}/${region}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    // Don't throw error as weather data is optional
    return null;
  }
};

/**
 * Get current user 
 * Note: In a real application, this would retrieve the logged-in user
 * @returns {Promise} User data or null if not logged in
 */
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get('/users/current');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    // Don't throw error as user might not be logged in
    return null;
  }
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} New user data
 */
export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post('/users/register', userData);
    return response.data.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw new Error(error.response?.data?.message || 'Failed to register user');
  }
};

/**
 * Login user
 * @param {Object} credentials - User login credentials
 * @returns {Promise} User data and token
 */
export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post('/users/login', credentials);
    return response.data.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw new Error(error.response?.data?.message || 'Failed to log in');
  }
};

// Add authorization token to requests when available
export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('authToken', token);
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
    localStorage.removeItem('authToken');
  }
};

// Initialize auth token from local storage
const savedToken = localStorage.getItem('authToken');
if (savedToken) {
  setAuthToken(savedToken);
}('Error generating forecast:', error);
    throw new Error(error.response?.data?.message || 'Failed to generate forecast');
  }
};

/**
 * Get available crops for forecasting
 * @returns {Promise} Crops data
 */
export const getCrops = async () => {
  try {
    const response = await apiClient.get('/forecast/crops');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching crops:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch crops');
  }
};

/**
 * Get climate zones information
 * @returns {Promise} Climate zones data
 */
export const getClimateZones = async () => {
  try {
    const response = await apiClient.get('/forecast/climate-zones');
    return response.data.data;
  } catch (error) {
    console.error