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
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const logoutUser = () => {
  setAuthToken(null);
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Forecast API calls
export const generateForecast = async (forecastParams) => {
  try {
    const response = await api.post('/forecast', forecastParams);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getCrops = async () => {
  try {
    const response = await api.get('/forecast/crops');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getClimateZones = async () => {
  try {
    const response = await api.get('/forecast/climate-zones');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getRegions = async (country) => {
  try {
    const response = await api.get(`/forecast/regions/${country}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getForecastHistory = async (userId) => {
  try {
    const response = await api.get(`/forecast/history/${userId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const saveForecast = async (userId, forecastData) => {
  try {
    const response = await api.post(`/forecast/save/${userId}`, forecastData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Helper function to handle API errors
const handleApiError = (error) => {
  let errorMessage = 'An unexpected error occurred';

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    errorMessage = error.response.data.message || error.response.data.error || errorMessage;
  } else if (error.request) {
    // The request was made but no response was received
    errorMessage = 'No response from server. Please check your internet connection.';
  } else {
    // Something happened in setting up the request that triggered an Error
    errorMessage = error.message;
  }

  return new Error(errorMessage);
};

export default api;
