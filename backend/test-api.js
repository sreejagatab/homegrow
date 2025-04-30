/**
 * Test API Endpoints
 * 
 * This script tests the API endpoints for crops and climate-zones.
 */

const axios = require('axios');

// Base URL for API requests
const API_BASE_URL = 'http://localhost:5001/api';

// Test the crops endpoint
async function testCropsEndpoint() {
  try {
    console.log('Testing crops endpoint...');
    const response = await axios.get(`${API_BASE_URL}/forecast/crops`);
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2).substring(0, 200) + '...');
    return true;
  } catch (error) {
    console.error('Error testing crops endpoint:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

// Test the climate-zones endpoint
async function testClimateZonesEndpoint() {
  try {
    console.log('\nTesting climate-zones endpoint...');
    const response = await axios.get(`${API_BASE_URL}/forecast/climate-zones`);
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2).substring(0, 200) + '...');
    return true;
  } catch (error) {
    console.error('Error testing climate-zones endpoint:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

// Run the tests
async function runTests() {
  console.log('Starting API endpoint tests...');
  
  const cropsResult = await testCropsEndpoint();
  const climateZonesResult = await testClimateZonesEndpoint();
  
  console.log('\nTest Results:');
  console.log('- Crops endpoint:', cropsResult ? 'PASSED' : 'FAILED');
  console.log('- Climate Zones endpoint:', climateZonesResult ? 'PASSED' : 'FAILED');
  
  if (cropsResult && climateZonesResult) {
    console.log('\nAll tests passed! The API endpoints are working correctly.');
  } else {
    console.log('\nSome tests failed. Please check the error messages above.');
  }
}

// Run the tests
runTests();
