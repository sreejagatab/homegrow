/**
 * API Connection Test Utility
 * 
 * This utility provides functions to test the connection between the frontend
 * and backend API. It can be used to diagnose API connection issues and verify
 * that the frontend can communicate with the backend.
 */

import axios from 'axios';

/**
 * Test the API health endpoint
 * @returns {Promise<Object>} Test result
 */
export const testApiHealth = async () => {
  try {
    const startTime = performance.now();
    const response = await axios.get('/api/health', { timeout: 5000 });
    const endTime = performance.now();
    
    return {
      success: true,
      status: response.status,
      data: response.data,
      responseTime: Math.round(endTime - startTime),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      status: error.response?.status,
      data: error.response?.data,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Test the API test endpoint
 * @returns {Promise<Object>} Test result
 */
export const testApiTest = async () => {
  try {
    const response = await axios.get('/api/test', { timeout: 5000 });
    
    return {
      success: true,
      status: response.status,
      data: response.data,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      status: error.response?.status,
      data: error.response?.data,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Test the crops API endpoint
 * @returns {Promise<Object>} Test result
 */
export const testCropsApi = async () => {
  try {
    const response = await axios.get('/api/forecast/crops', { timeout: 5000 });
    
    return {
      success: true,
      status: response.status,
      data: response.data,
      itemCount: response.data.data?.length || 0,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      status: error.response?.status,
      data: error.response?.data,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Test the climate zones API endpoint
 * @returns {Promise<Object>} Test result
 */
export const testClimateZonesApi = async () => {
  try {
    const response = await axios.get('/api/forecast/climate-zones', { timeout: 5000 });
    
    return {
      success: true,
      status: response.status,
      data: response.data,
      itemCount: response.data.data?.length || 0,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      status: error.response?.status,
      data: error.response?.data,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Test the authentication API endpoints
 * @returns {Promise<Object>} Test result
 */
export const testAuthApi = async () => {
  try {
    // We'll just test if the endpoint exists, not actual authentication
    const response = await axios.options('/api/auth/login');
    
    return {
      success: true,
      status: response.status,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    // If we get a 401 or 405, that's actually good - it means the endpoint exists
    if (error.response && (error.response.status === 401 || error.response.status === 405)) {
      return {
        success: true,
        status: error.response.status,
        message: 'Auth endpoint exists',
        timestamp: new Date().toISOString()
      };
    }
    
    return {
      success: false,
      error: error.message,
      status: error.response?.status,
      data: error.response?.data,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Run all API tests
 * @returns {Promise<Object>} Test results
 */
export const runAllApiTests = async () => {
  const results = {
    health: await testApiHealth(),
    test: await testApiTest(),
    crops: await testCropsApi(),
    climateZones: await testClimateZonesApi(),
    auth: await testAuthApi(),
    timestamp: new Date().toISOString()
  };
  
  // Calculate overall status
  const allSuccessful = Object.values(results)
    .filter(result => typeof result === 'object' && 'success' in result)
    .every(result => result.success);
  
  results.overallSuccess = allSuccessful;
  
  return results;
};

/**
 * Format API test results for display
 * @param {Object} results Test results
 * @returns {String} Formatted results
 */
export const formatApiTestResults = (results) => {
  if (!results) return 'No test results available';
  
  let output = '=== API Connection Test Results ===\n\n';
  output += `Timestamp: ${results.timestamp}\n`;
  output += `Overall Status: ${results.overallSuccess ? 'SUCCESS ✅' : 'FAILURE ❌'}\n\n`;
  
  // Format each test result
  Object.entries(results)
    .filter(([key]) => key !== 'timestamp' && key !== 'overallSuccess')
    .forEach(([key, result]) => {
      output += `${key.toUpperCase()} API: ${result.success ? 'SUCCESS ✅' : 'FAILURE ❌'}\n`;
      output += `Status: ${result.status || 'N/A'}\n`;
      
      if (result.responseTime) {
        output += `Response Time: ${result.responseTime}ms\n`;
      }
      
      if (result.itemCount !== undefined) {
        output += `Items: ${result.itemCount}\n`;
      }
      
      if (result.error) {
        output += `Error: ${result.error}\n`;
      }
      
      output += '\n';
    });
  
  return output;
};

export default {
  testApiHealth,
  testApiTest,
  testCropsApi,
  testClimateZonesApi,
  testAuthApi,
  runAllApiTests,
  formatApiTestResults
};
