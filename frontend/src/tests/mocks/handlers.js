/**
 * MSW Request Handlers
 *
 * This file defines the request handlers for Mock Service Worker (MSW).
 * These handlers intercept API requests during tests and return mock responses.
 */

import { http, HttpResponse, delay } from 'msw';
import mockCrops from './data/mockCrops';
import mockClimateZones from './data/mockClimateZones';
import mockForecasts from './data/mockForecasts';

// Helper function to add delay to responses
const delayedResponse = async (data, status = 200, delayMs = 100) => {
  await delay(delayMs);
  return HttpResponse.json(data, { status });
};

export const handlers = [
  // Health endpoint
  http.get('/api/health', async () => {
    return delayedResponse({
      success: true,
      server: { status: 'online', version: '1.0.0' },
      database: { status: 'connected', version: '5.0.0' }
    });
  }),

  // Crops endpoints
  http.get('/api/forecast/crops', async () => {
    return delayedResponse({
      success: true,
      crops: mockCrops
    });
  }),

  // Climate zones endpoints
  http.get('/api/forecast/climate-zones', async () => {
    return delayedResponse({
      success: true,
      climateZones: mockClimateZones
    });
  }),

  // Forecasts endpoints
  http.get('/api/forecast/saved', async () => {
    return delayedResponse({
      success: true,
      forecasts: mockForecasts
    });
  }),

  http.post('/api/forecast/generate', async ({ request }) => {
    const body = await request.json();
    const { cropId, climateZone, plantingDate, gardenArea } = body;

    // Validate required fields
    if (!cropId || !climateZone || !plantingDate) {
      return delayedResponse({
        success: false,
        error: 'Missing required fields',
        message: 'Please provide all required fields'
      }, 400);
    }

    // Find crop
    const crop = mockCrops.find(c => c.id === cropId);
    if (!crop) {
      return delayedResponse({
        success: false,
        error: 'Invalid crop',
        message: 'The selected crop does not exist'
      }, 400);
    }

    // Generate mock forecast
    const forecast = {
      id: Math.random().toString(36).substring(2, 15),
      cropId,
      cropName: crop.name,
      climateZone,
      plantingDate,
      harvestDate: new Date(new Date(plantingDate).getTime() + (crop.timeToHarvest.max * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      gardenArea: gardenArea || 10,
      yieldEstimate: {
        min: crop.baseYield.min * (gardenArea || 10),
        max: crop.baseYield.max * (gardenArea || 10),
        unit: 'kg'
      },
      waterNeeds: 'Medium',
      sunNeeds: 'Full Sun',
      soilNeeds: 'Well-drained',
      companionPlants: ['Basil', 'Marigold'],
      avoidPlants: ['Potato', 'Fennel'],
      growthStages: [
        {
          name: 'Germination',
          startDay: 0,
          endDay: Math.floor(crop.timeToHarvest.max * 0.1),
          description: 'Seeds germinate and seedlings emerge'
        },
        {
          name: 'Vegetative Growth',
          startDay: Math.floor(crop.timeToHarvest.max * 0.1) + 1,
          endDay: Math.floor(crop.timeToHarvest.max * 0.4),
          description: 'Plants develop leaves and stems'
        },
        {
          name: 'Flowering',
          startDay: Math.floor(crop.timeToHarvest.max * 0.4) + 1,
          endDay: Math.floor(crop.timeToHarvest.max * 0.6),
          description: 'Plants produce flowers'
        },
        {
          name: 'Fruit Development',
          startDay: Math.floor(crop.timeToHarvest.max * 0.6) + 1,
          endDay: Math.floor(crop.timeToHarvest.max * 0.9),
          description: 'Fruits or vegetables develop'
        },
        {
          name: 'Maturation',
          startDay: Math.floor(crop.timeToHarvest.max * 0.9) + 1,
          endDay: crop.timeToHarvest.max,
          description: 'Fruits or vegetables ripen and are ready for harvest'
        }
      ],
      createdAt: new Date().toISOString()
    };

    return delayedResponse({
      success: true,
      forecast
    });
  }),

  http.post('/api/forecast/save', async ({ request }) => {
    const forecast = await request.json();

    // Validate forecast
    if (!forecast.cropId || !forecast.climateZone || !forecast.plantingDate) {
      return delayedResponse({
        success: false,
        error: 'Invalid forecast',
        message: 'Please provide a valid forecast'
      }, 400);
    }

    // Add ID and timestamps
    const savedForecast = {
      ...forecast,
      id: Math.random().toString(36).substring(2, 15),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return delayedResponse({
      success: true,
      forecast: savedForecast
    });
  }),

  http.delete('/api/forecast/:id', async ({ params }) => {
    const { id } = params;

    // Check if forecast exists
    const forecast = mockForecasts.find(f => f.id === id);
    if (!forecast) {
      return delayedResponse({
        success: false,
        error: 'Forecast not found',
        message: 'The forecast does not exist'
      }, 404);
    }

    return delayedResponse({
      success: true,
      message: 'Forecast deleted successfully'
    });
  }),

  // Authentication endpoints
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json();

    // Check credentials
    if (email === 'test@example.com' && password === 'Password123') {
      return delayedResponse({
        success: true,
        token: 'mock-jwt-token',
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com'
        }
      });
    }

    return delayedResponse({
      success: false,
      error: 'Invalid credentials',
      message: 'Email or password is incorrect'
    }, 401);
  }),

  http.post('/api/auth/register', async ({ request }) => {
    const { name, email, password, confirmPassword } = await request.json();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return delayedResponse({
        success: false,
        error: 'Invalid email',
        message: 'Please provide a valid email address'
      }, 400);
    }

    // Validate password length
    if (password.length < 6) {
      return delayedResponse({
        success: false,
        error: 'Invalid password',
        message: 'Password must be at least 6 characters long'
      }, 400);
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return delayedResponse({
        success: false,
        error: 'Passwords do not match',
        message: 'Password and confirm password must match'
      }, 400);
    }

    return delayedResponse({
      success: true,
      token: 'mock-jwt-token',
      user: {
        id: '1',
        name,
        email
      }
    });
  }),

  http.post('/api/auth/logout', async () => {
    return delayedResponse({
      success: true,
      message: 'Logged out successfully'
    });
  }),

  http.get('/api/auth/verify', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

    if (token === 'mock-jwt-token') {
      return delayedResponse({
        success: true,
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com'
        }
      });
    }

    return delayedResponse({
      success: false,
      error: 'Invalid token',
      message: 'Token is invalid or expired'
    }, 401);
  }),

  // User profile endpoints
  http.get('/api/user/profile', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

    if (token === 'mock-jwt-token') {
      return delayedResponse({
        success: true,
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          createdAt: '2023-01-01T00:00:00Z',
          preferences: {
            theme: 'light',
            notifications: true
          }
        }
      });
    }

    return delayedResponse({
      success: false,
      error: 'Unauthorized',
      message: 'You must be logged in to access this resource'
    }, 401);
  }),

  http.put('/api/user/profile', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    const userData = await request.json();

    if (token !== 'mock-jwt-token') {
      return delayedResponse({
        success: false,
        error: 'Unauthorized',
        message: 'You must be logged in to access this resource'
      }, 401);
    }

    return delayedResponse({
      success: true,
      user: {
        id: '1',
        ...userData,
        updatedAt: new Date().toISOString()
      }
    });
  })
];
