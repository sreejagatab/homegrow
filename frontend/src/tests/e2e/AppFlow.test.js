/**
 * End-to-End Application Flow Tests
 *
 * Tests for the complete application flow including:
 * - User registration
 * - User login
 * - Forecast generation
 * - Forecast saving
 * - Forecast history viewing
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import MockApp from '../mocks/MockApp';
import { AuthProvider } from '../../context/AuthContext';
import { renderWithProviders } from '../utils/testUtils';

// Create axios mock
const mockAxios = new MockAdapter(axios);

// Mock data
const testUser = {
  id: 'user123',
  name: 'Test User',
  email: 'test@example.com',
  roles: ['user']
};

const mockCrops = [
  { id: 'tomatoes', name: 'Tomatoes', image: '/images/crops/tomato.jpg' },
  { id: 'cucumbers', name: 'Cucumbers', image: '/images/crops/cucumber.jpg' },
  { id: 'bellPeppers', name: 'Bell Peppers', image: '/images/crops/bell-pepper.jpg' }
];

const mockClimateZones = [
  { id: 'mediterranean', name: 'Mediterranean' },
  { id: 'continental', name: 'Continental' },
  { id: 'tropical', name: 'Tropical' }
];

const mockForecastResult = {
  tomatoes: {
    cropProfile: {
      name: 'Tomatoes',
      scientificName: 'Solanum lycopersicum',
      family: 'Solanaceae',
      growthHabit: 'Annual',
      lifecycle: '90-150 days',
      waterRequirements: 'Medium',
      sunRequirements: 'Full sun',
      description: 'Tomatoes are one of the most popular garden vegetables.'
    },
    plantingCalendar: {
      seedIndoors: { start: 'Week 8', end: 'Week 10' },
      transplant: { start: 'Week 12', end: 'Week 14' },
      directSow: { start: 'Week 12', end: 'Week 16' },
      harvest: { start: 'Week 24', end: 'Week 36' }
    },
    productionMetrics: {
      totalYield: { min: 300, max: 700, unit: 'kg' },
      yieldPerPlant: { min: 3, max: 7, unit: 'kg' },
      plantsPerArea: { value: 100, unit: 'plants' },
      estimatedRevenue: { min: 900, max: 2100, unit: 'USD' },
      estimatedCosts: { min: 300, max: 500, unit: 'USD' },
      estimatedProfit: { min: 600, max: 1600, unit: 'USD' }
    },
    riskFactors: [
      { name: 'Disease Risk', level: 'Medium', description: 'Susceptible to blight and other fungal diseases.' },
      { name: 'Pest Risk', level: 'Medium', description: 'Can be affected by aphids, hornworms, and whiteflies.' },
      { name: 'Climate Risk', level: 'Low', description: 'Well-suited to Mediterranean climate.' }
    ],
    recommendations: [
      'Use drip irrigation to reduce disease risk',
      'Stake or cage plants for better air circulation',
      'Mulch to conserve moisture and reduce weeds',
      'Rotate crops to prevent soil-borne diseases'
    ]
  }
};

// Helper to render the app with providers
// Note: We use MemoryRouter for testing and a MockApp component
// to avoid nested Router issues
const renderApp = () => {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/']}>
        <MockApp />
      </MemoryRouter>
    </AuthProvider>
  );
};

describe('End-to-End Application Flow', () => {
  // Increase timeout for this test suite
  jest.setTimeout(30000);

  // Setup mocks before each test
  beforeEach(() => {
    // Clear mocks
    mockAxios.reset();

    // Reset MSW handlers
    server.resetHandlers();

    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn()
      },
      writable: true
    });

    // Set up MSW handlers for this test
    server.use(
      // Auth endpoints
      http.get('/api/auth/me', async ({ request }) => {
        const authHeader = request.headers.get('Authorization');
        if (authHeader === 'Bearer test-token') {
          return HttpResponse.json({ success: true, data: testUser });
        }
        return HttpResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
      }),

      http.post('/api/auth/register', async ({ request }) => {
        const body = await request.json();
        const { name, email, password, confirmPassword } = body;

        if (password !== confirmPassword) {
          return HttpResponse.json({
            success: false,
            message: 'Passwords do not match'
          }, { status: 400 });
        }

        return HttpResponse.json({
          success: true,
          token: 'test-token',
          user: { ...testUser, name, email }
        }, { status: 201 });
      }),

      http.post('/api/auth/login', async ({ request }) => {
        const body = await request.json();
        const { email, password } = body;

        if (email === testUser.email && password === 'Password123') {
          return HttpResponse.json({
            success: true,
            token: 'test-token',
            user: testUser
          });
        }

        return HttpResponse.json({
          success: false,
          message: 'Invalid credentials'
        }, { status: 401 });
      }),

      // Forecast endpoints
      http.get('/api/forecast/crops', () => {
        return HttpResponse.json({ success: true, data: mockCrops });
      }),

      http.get('/api/forecast/climate-zones', () => {
        return HttpResponse.json({ success: true, data: mockClimateZones });
      }),

      http.post('/api/forecast', () => {
        return HttpResponse.json({
          success: true,
          data: mockForecastResult
        });
      }),

      http.post('/api/forecast/save', () => {
        return HttpResponse.json({
          success: true,
          data: {
            id: 'forecast123',
            userId: testUser.id,
            params: {
              climate: 'mediterranean',
              environment: 'open',
              area: 100,
              crops: ['tomatoes']
            },
            results: mockForecastResult
          }
        });
      }),

      http.get(`/api/forecast/history/${testUser.id}`, () => {
        return HttpResponse.json({
          success: true,
          data: [
            {
              id: 'forecast123',
              userId: testUser.id,
              createdAt: new Date().toISOString(),
              params: {
                climate: 'mediterranean',
                environment: 'open',
                area: 100,
                crops: ['tomatoes']
              }
            }
          ]
        });
      })
    );
  });

  it('should allow a user to register, login, generate a forecast, and save it', async () => {
    // Render the app using our utility function
    await act(async () => {
      renderWithProviders(<MockApp />, { initialRoute: '/' })
    });

    // Wait for the app to load
    await waitFor(() => {
      expect(screen.getByText(/HomeGrow Forecast Tool/i)).toBeInTheDocument();
    }, { timeout: 5000 });

    // Navigate to register page
    fireEvent.click(screen.getByText(/Sign Up/i));

    // Wait for register page to load
    await waitFor(() => {
      expect(screen.getByText(/Create Account/i)).toBeInTheDocument();
    });

    // Fill out registration form
    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: testUser.name }
    });

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: testUser.email }
    });

    // Use getByLabelText with exact option to avoid ambiguity
    const passwordField = screen.getByLabelText('Password', { exact: true });
    fireEvent.change(passwordField, {
      target: { value: 'Password123' }
    });

    const confirmPasswordField = screen.getByLabelText('Confirm Password', { exact: true });
    fireEvent.change(confirmPasswordField, {
      target: { value: 'Password123' }
    });

    // Submit registration form
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    // Wait for dashboard to load after successful registration
    await waitFor(() => {
      expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    });

    // Navigate to forecast page
    fireEvent.click(screen.getByText(/New Forecast/i));

    // Wait for forecast form to load
    await waitFor(() => {
      expect(screen.getByText(/Create a Forecast/i)).toBeInTheDocument();
    });

    // Fill out forecast form
    fireEvent.click(screen.getByLabelText(/Mediterranean/i));
    fireEvent.click(screen.getByLabelText(/Open Field/i));

    fireEvent.change(screen.getByLabelText(/Growing Area/i), {
      target: { value: '100' }
    });

    fireEvent.click(screen.getByLabelText(/Tomatoes/i));

    // Submit forecast form
    fireEvent.click(screen.getByRole('button', { name: /Generate Forecast/i }));

    // Wait for forecast results to load
    await waitFor(() => {
      expect(screen.getByText(/Forecast Results/i)).toBeInTheDocument();
    });

    // Check that forecast results are displayed
    expect(screen.getByText(/Tomatoes/i)).toBeInTheDocument();
    expect(screen.getByText(/Solanum lycopersicum/i)).toBeInTheDocument();
    expect(screen.getByText(/Crop Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Planting Calendar/i)).toBeInTheDocument();
    expect(screen.getByText(/Production Metrics/i)).toBeInTheDocument();

    // Save the forecast
    fireEvent.click(screen.getByRole('button', { name: /Save Forecast/i }));

    // Wait for save confirmation
    await waitFor(() => {
      expect(screen.getByText(/Forecast saved successfully/i)).toBeInTheDocument();
    });

    // Navigate to forecast history
    fireEvent.click(screen.getByText(/Forecast History/i));

    // Wait for forecast history to load
    await waitFor(() => {
      expect(screen.getByText(/Your Saved Forecasts/i)).toBeInTheDocument();
    });

    // Check that the saved forecast is in the history
    expect(screen.getByText(/Mediterranean/i)).toBeInTheDocument();
    expect(screen.getByText(/Open Field/i)).toBeInTheDocument();
    expect(screen.getByText(/100 m²/i)).toBeInTheDocument();
    expect(screen.getByText(/Tomatoes/i)).toBeInTheDocument();

    // Logout
    fireEvent.click(screen.getByText(/Logout/i));

    // Wait for home page after logout
    await waitFor(() => {
      expect(screen.getByText(/HomeGrow Forecast Tool/i)).toBeInTheDocument();
    }, { timeout: 5000 });

    // Check that we're logged out
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });
});
