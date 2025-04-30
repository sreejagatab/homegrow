/**
 * Test Utilities
 * 
 * This file provides utility functions for testing React components.
 */

import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import { ForecastProvider } from '../../contexts/ForecastContext';

/**
 * Custom render function that wraps the component with necessary providers
 * @param {React.ReactElement} ui - The component to render
 * @param {Object} options - Options for rendering
 * @returns {Object} - The rendered component
 */
export const renderWithProviders = (ui, options = {}) => {
  const {
    initialRoute = '/',
    useMemoryRouter = true,
    authContextValue = {},
    forecastContextValue = {},
    ...renderOptions
  } = options;

  // Create wrapper with all providers
  const AllProviders = ({ children }) => {
    const Router = useMemoryRouter ? MemoryRouter : BrowserRouter;
    const routerProps = useMemoryRouter ? { initialEntries: [initialRoute] } : {};

    return (
      <AuthProvider value={authContextValue}>
        <ForecastProvider value={forecastContextValue}>
          <Router {...routerProps}>
            {children}
          </Router>
        </ForecastProvider>
      </AuthProvider>
    );
  };

  return render(ui, { wrapper: AllProviders, ...renderOptions });
};

/**
 * Mock authenticated user
 * @returns {Object} - Mock user object
 */
export const mockAuthenticatedUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com'
};

/**
 * Mock authentication context value for authenticated user
 * @returns {Object} - Mock auth context value
 */
export const mockAuthContextAuthenticated = {
  isAuthenticated: true,
  user: mockAuthenticatedUser,
  loading: false,
  login: jest.fn().mockResolvedValue({ success: true }),
  register: jest.fn().mockResolvedValue({ success: true }),
  logout: jest.fn().mockResolvedValue({ success: true }),
  updateProfile: jest.fn().mockResolvedValue({ success: true })
};

/**
 * Mock authentication context value for unauthenticated user
 * @returns {Object} - Mock auth context value
 */
export const mockAuthContextUnauthenticated = {
  isAuthenticated: false,
  user: null,
  loading: false,
  login: jest.fn().mockResolvedValue({ success: true }),
  register: jest.fn().mockResolvedValue({ success: true }),
  logout: jest.fn().mockResolvedValue({ success: true }),
  updateProfile: jest.fn().mockResolvedValue({ success: true })
};

/**
 * Mock forecast context value
 * @returns {Object} - Mock forecast context value
 */
export const mockForecastContext = {
  availableCrops: [],
  climateZones: [],
  currentForecast: null,
  savedForecasts: [],
  loading: false,
  error: null,
  loadInitialData: jest.fn(),
  generateForecast: jest.fn().mockResolvedValue({ success: true }),
  saveForecast: jest.fn().mockResolvedValue({ success: true }),
  deleteForecast: jest.fn().mockResolvedValue({ success: true }),
  getSavedForecasts: jest.fn().mockResolvedValue({ success: true }),
  setCurrentForecast: jest.fn()
};

/**
 * Wait for a specified time
 * @param {number} ms - Time to wait in milliseconds
 * @returns {Promise} - Promise that resolves after the specified time
 */
export const wait = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Create a mock response object
 * @param {Object} data - Response data
 * @param {number} status - HTTP status code
 * @returns {Object} - Mock response object
 */
export const createMockResponse = (data, status = 200) => ({
  data,
  status,
  ok: status >= 200 && status < 300
});

/**
 * Create a mock error response
 * @param {string} message - Error message
 * @param {number} status - HTTP status code
 * @returns {Object} - Mock error object
 */
export const createMockError = (message, status = 500) => ({
  response: {
    data: {
      error: message,
      message
    },
    status
  },
  message
});
