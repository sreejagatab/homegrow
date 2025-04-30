/**
 * End-to-End Tests for Crops and Climate Zones Pages
 *
 * Tests for the crops and climate zones pages including:
 * - Page loading
 * - Data display
 * - User interactions
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import MockApp from '../mocks/MockApp';
import { renderWithProviders } from '../utils/testUtils';
import mockCrops from '../mocks/data/mockCrops';
import mockClimateZones from '../mocks/data/mockClimateZones';

describe('Crops and Climate Zones Pages', () => {
  // Setup mocks before each test
  beforeEach(() => {
    // Reset MSW handlers
    server.resetHandlers();

    // Add specific handlers for crops and climate zones tests
    server.use(
      http.get('http://localhost:5001/api/forecast/crops', () => {
        return HttpResponse.json({
          success: true,
          data: mockCrops
        }, { status: 200 });
      }),

      http.get('http://localhost:5001/api/forecast/climate-zones', () => {
        return HttpResponse.json({
          success: true,
          data: mockClimateZones
        }, { status: 200 });
      })
    );
  });

  describe('Crops Page', () => {
    it('should load and display crops data', async () => {
      // Render the app
      await act(async () => {
        renderWithProviders(<MockApp />, { initialRoute: '/crops' });
      });

      // Wait for the crops page to load
      await waitFor(() => {
        expect(screen.getByText(/Vegetable Crop Library/i)).toBeInTheDocument();
      });

      // Check that crops data is displayed
      for (const crop of mockCrops) {
        expect(screen.getByText(crop.name)).toBeInTheDocument();
      }
    });

    it('should display crop details when a crop is selected', async () => {
      // Render the app
      await act(async () => {
        renderWithProviders(<MockApp />, { initialRoute: '/crops' });
      });

      // Wait for the crops page to load
      await waitFor(() => {
        expect(screen.getByText(/Vegetable Crop Library/i)).toBeInTheDocument();
      });

      // Click on a crop
      await act(async () => {
        fireEvent.click(screen.getByText(mockCrops[0].name));
      });

      // Wait for crop details to load
      await waitFor(() => {
        expect(screen.getByText(mockCrops[0].scientificName)).toBeInTheDocument();
      });

      // Check that crop details are displayed
      expect(screen.getByText(/Planting Guide/i)).toBeInTheDocument();
      expect(screen.getByText(/Care & Maintenance/i)).toBeInTheDocument();
    });

    it('should handle API errors gracefully', async () => {
      // Override the handler to return an error
      server.use(
        rest.get('http://localhost:5001/api/forecast/crops', (req, res, ctx) => {
          return res(
            ctx.status(500),
            ctx.json({
              success: false,
              message: 'Server error'
            })
          );
        })
      );

      // Render the app
      await act(async () => {
        renderWithProviders(<MockApp />, { initialRoute: '/crops' });
      });

      // Wait for the error message
      await waitFor(() => {
        expect(screen.getByText(/Failed to load crop data/i)).toBeInTheDocument();
      });
    });
  });

  describe('Climate Zones Page', () => {
    it('should load and display climate zones data', async () => {
      // Render the app
      await act(async () => {
        renderWithProviders(<MockApp />, { initialRoute: '/climate-zones' });
      });

      // Wait for the climate zones page to load
      await waitFor(() => {
        expect(screen.getByText(/Climate Zones Guide/i)).toBeInTheDocument();
      });

      // Check that climate zones data is displayed
      for (const zone of mockClimateZones) {
        expect(screen.getByText(zone.name)).toBeInTheDocument();
      }
    });

    it('should display climate zone details', async () => {
      // Render the app
      await act(async () => {
        renderWithProviders(<MockApp />, { initialRoute: '/climate-zones' });
      });

      // Wait for the climate zones page to load
      await waitFor(() => {
        expect(screen.getByText(/Climate Zones Guide/i)).toBeInTheDocument();
      });

      // Check that climate zone details are displayed
      expect(screen.getByText(/Climate Zone Details/i)).toBeInTheDocument();
      expect(screen.getByText(/Growing Tips by Climate/i)).toBeInTheDocument();
    });

    it('should handle API errors gracefully', async () => {
      // Override the handler to return an error
      server.use(
        rest.get('http://localhost:5001/api/forecast/climate-zones', (req, res, ctx) => {
          return res(
            ctx.status(500),
            ctx.json({
              success: false,
              message: 'Server error'
            })
          );
        })
      );

      // Render the app
      await act(async () => {
        renderWithProviders(<MockApp />, { initialRoute: '/climate-zones' });
      });

      // Wait for the error message
      await waitFor(() => {
        expect(screen.getByText(/Failed to load climate zone data/i)).toBeInTheDocument();
      });
    });
  });
});
