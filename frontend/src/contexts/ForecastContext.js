// frontend/src/contexts/ForecastContext.js

import React, { createContext, useState, useEffect } from 'react';
import {
  generateForecast,
  getCurrentUser,
  getAvailableCrops,
  getClimateZones,
  getForecastHistory,
  saveForecast,
  setAuthToken,
  logoutUser
} from '../services/api';
import { fallbackCrops } from '../data/fallbackCrops';
import { fallbackClimateZones } from '../data/fallbackClimateZones';

// Create the context
export const ForecastContext = createContext();

// Create the provider component
export const ForecastProvider = ({ children }) => {
  // State for forecast data
  const [forecastData, setForecastData] = useState(null);
  const [forecastHistory, setForecastHistory] = useState([]);

  // State for form options
  const [availableCrops, setAvailableCrops] = useState([]);
  const [climateZones, setClimateZones] = useState([]);

  // State for loading and errors
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for user authentication
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);

        // Try to load crops and climate zones from API
        try {
          const cropsData = await getAvailableCrops();
          setAvailableCrops(cropsData);
          console.log('Successfully loaded crops data from API');
        } catch (cropErr) {
          console.error('Error loading crops data from API:', cropErr);
          console.log('Using fallback crops data');
          setAvailableCrops(fallbackCrops);
        }

        try {
          const climateData = await getClimateZones();
          setClimateZones(climateData);
          console.log('Successfully loaded climate zones data from API');
        } catch (climateErr) {
          console.error('Error loading climate zones data from API:', climateErr);
          console.log('Using fallback climate zones data');
          setClimateZones(fallbackClimateZones);
        }

        // Check authentication status
        await checkAuthStatus();
      } catch (err) {
        console.error('Error in loadInitialData:', err);
        setError('Some application data could not be loaded. Using fallback data where possible.');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check if user is authenticated
  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        // Set the token in axios headers
        setAuthToken(token);

        // Get current user data
        const userData = await getCurrentUser();
        updateUserData(userData);

        // Load user's forecast history
        if (userData && userData.id) {
          loadForecastHistory(userData.id);
        }
      } catch (err) {
        console.error('Authentication error:', err);
        // Token might be invalid or expired
        handleLogout();
      }
    }
  };

  /**
   * Load user's forecast history
   * @param {string} userId - User ID
   */
  const loadForecastHistory = async (userId) => {
    try {
      setLoading(true);
      const response = await getForecastHistory(userId);

      // Log the response for debugging
      console.log('ForecastContext loadForecastHistory response:', response);

      // Make sure we're setting an array to state
      // The API returns { data: [...] } structure
      if (response && response.data && Array.isArray(response.data)) {
        setForecastHistory(response.data);
      } else if (Array.isArray(response)) {
        setForecastHistory(response);
      } else {
        console.error('Invalid forecast history format:', response);
        setForecastHistory([]);
      }
    } catch (err) {
      console.error('Error loading forecast history:', err);
      setError('Failed to load forecast history');
      // Initialize with empty array on error
      setForecastHistory([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update user data and authentication status
   * @param {Object} userData - User data
   */
  const updateUserData = (userData) => {
    if (userData) {
      setUser(userData);
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  /**
   * Create a new forecast
   * @param {Object} forecastParams - Forecast parameters
   */
  const createForecast = async (forecastParams) => {
    try {
      setLoading(true);
      setError(null);

      const data = await generateForecast(forecastParams);
      setForecastData(data);

      return data;
    } catch (error) {
      setError(error.message || 'Failed to generate forecast');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Save the current forecast to user's history
   */
  const saveCurrentForecast = async () => {
    if (!isAuthenticated) {
      setError('You must be logged in to save forecasts');
      return;
    }

    if (!forecastData) {
      setError('No forecast data to save');
      return;
    }

    try {
      setLoading(true);
      await saveForecast(user.id, forecastData);

      // Reload forecast history
      await loadForecastHistory(user.id);

      return true;
    } catch (error) {
      setError(error.message || 'Failed to save forecast');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset the forecast data
   */
  const resetForecast = () => {
    setForecastData(null);
    setError(null);
  };

  /**
   * Log out the current user
   */
  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setIsAuthenticated(false);
    setForecastHistory([]);
  };

  // Create the context value
  const contextValue = {
    // Forecast data
    forecastData,
    forecastHistory,

    // Form options
    availableCrops,
    climateZones,

    // Loading and error states
    loading,
    error,

    // User authentication
    user,
    isAuthenticated,

    // Methods
    createForecast,
    saveCurrentForecast,
    resetForecast,
    updateUserData,
    logout: handleLogout,
    clearError: () => setError(null)
  };

  // Return the provider with the context value
  return (
    <ForecastContext.Provider value={contextValue}>
      {children}
    </ForecastContext.Provider>
  );
};
