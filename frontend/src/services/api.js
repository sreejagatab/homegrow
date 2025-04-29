// frontend/src/services/api.js

/**
 * API service for making requests to the backend
 */

import axios from 'axios';

// Create an axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to include auth token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      // Clear token if it's invalid
      localStorage.removeItem('token');
    }

    // Format error message
    const errorMessage = error.response?.data?.message ||
                         error.response?.data?.error ||
                         error.message ||
                         'An unexpected error occurred';

    // Create a new error with the formatted message
    const formattedError = new Error(errorMessage);

    // Add additional error details
    formattedError.status = error.response?.status;
    formattedError.data = error.response?.data;

    return Promise.reject(formattedError);
  }
);

// Set auth token for future requests
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  }
};

// Authentication API calls

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} Promise that resolves to the user data and token
 */
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

/**
 * Login user
 * @param {Object} credentials - User login credentials
 * @returns {Promise} Promise that resolves to the user data and token
 */
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

/**
 * Get current user data
 * @returns {Promise} Promise that resolves to the user data
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

/**
 * Update user preferences
 * @param {Object} preferences - User preferences
 * @returns {Promise} Promise that resolves to the updated user data
 */
export const updateUserPreferences = async (preferences) => {
  try {
    const response = await api.put('/auth/preferences', preferences);
    return response;
  } catch (error) {
    console.error('Error updating preferences:', error);
    throw error;
  }
};

/**
 * Log out user
 * @returns {void}
 */
export const logoutUser = () => {
  setAuthToken(null);
};

// Forecast API calls

/**
 * Get available crops for forecasting
 * @returns {Promise} Promise that resolves to an array of crops
 */
export const getAvailableCrops = async () => {
  try {
    const response = await api.get('/forecast/crops');
    return response.data;
  } catch (error) {
    console.error('Error fetching crops:', error);
    throw error;
  }
};

/**
 * Get climate zones
 * @returns {Promise} Promise that resolves to an array of climate zones
 */
export const getClimateZones = async () => {
  try {
    const response = await api.get('/forecast/climate-zones');
    return response.data;
  } catch (error) {
    console.error('Error fetching climate zones:', error);
    throw error;
  }
};

/**
 * Get regions by country
 * @param {string} country - Country code
 * @returns {Promise} Promise that resolves to an array of regions
 */
export const getRegionsByCountry = async (country) => {
  try {
    const response = await api.get(`/forecast/regions/${country}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching regions:', error);
    throw error;
  }
};

/**
 * Generate a forecast
 * @param {Object} forecastParams - Forecast parameters
 * @returns {Promise} Promise that resolves to the forecast data
 */
export const generateForecast = async (forecastParams) => {
  try {
    const response = await api.post('/forecast', forecastParams);
    return response.data;
  } catch (error) {
    console.error('Error generating forecast:', error);
    throw error;
  }
};

/**
 * Get forecast history for a user
 * @param {string} userId - User ID
 * @returns {Promise} Promise that resolves to the forecast history
 */
export const getForecastHistory = async (userId) => {
  try {
    const response = await api.get(`/forecast/history/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching forecast history:', error);
    throw error;
  }
};

/**
 * Save a forecast to user's history
 * @param {string} userId - User ID
 * @param {Object} forecastData - Forecast data to save
 * @returns {Promise} Promise that resolves to the saved forecast
 */
export const saveForecast = async (userId, forecastData) => {
  try {
    const response = await api.post(`/forecast/save/${userId}`, forecastData);
    return response.data;
  } catch (error) {
    console.error('Error saving forecast:', error);
    throw error;
  }
};
