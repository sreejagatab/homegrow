/**
 * ApiStatus Component Tests
 *
 * Tests for the ApiStatus component functionality including:
 * - Rendering
 * - API status checking
 * - Error handling
 */

import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ApiStatus from '../ApiStatus';
import { wait } from '../../tests/utils/testUtils';

// Import axios for the component
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('ApiStatus Component', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', async () => {
    // Mock axios to never resolve
    axios.get.mockImplementation(() => new Promise(() => {}));

    await act(async () => {
      render(<ApiStatus />);
    });

    // Check for loading indicators
    expect(screen.getByText(/Server:/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Checking.../i).length).toBeGreaterThan(0);
  });

  it('should show online status when API is available', async () => {
    // Mock successful responses
    axios.get.mockImplementation((url) => {
      if (url === '/api/health') {
        return Promise.resolve({
          data: {
            success: true,
            server: { status: 'online' },
            database: { status: 'connected' }
          }
        });
      } else if (url === '/api/forecast/crops') {
        return Promise.resolve({ data: { success: true } });
      } else if (url === '/api/forecast/climate-zones') {
        return Promise.resolve({ data: { success: true } });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    await act(async () => {
      render(<ApiStatus />);
    });

    // Wait for API checks to complete
    await waitFor(() => {
      expect(screen.getByText(/Server:/i)).toBeInTheDocument();
    });

    // Wait for the status to be updated
    await waitFor(() => {
      expect(screen.getByText(/Online/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    // Check that axios.get was called with the health endpoint
    expect(axios.get).toHaveBeenCalledWith('/api/health', expect.anything());
  });

  it('should show offline status when server is down', async () => {
    // Mock server error
    axios.get.mockRejectedValue(new Error('Network Error'));

    await act(async () => {
      render(<ApiStatus />);
    });

    // Wait for API checks to complete
    await waitFor(() => {
      expect(screen.getByText(/Server:/i)).toBeInTheDocument();
    });

    // Wait for the status to be updated
    await waitFor(() => {
      const offlineElements = screen.getAllByText(/Offline/i);
      expect(offlineElements.length).toBeGreaterThan(0);
    }, { timeout: 3000 });

    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(/Server Connection Issue/i)).toBeInTheDocument();
      expect(screen.getByText(/Troubleshooting Tips:/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should show partial status when some endpoints are down', async () => {
    // Mock the health endpoint to return success but other endpoints to fail
    axios.get.mockImplementation((url) => {
      if (url === '/api/health') {
        return Promise.resolve({
          data: {
            success: true,
            server: { status: 'online' },
            database: { status: 'connected' }
          }
        });
      } else if (url === '/api/forecast/crops') {
        return Promise.resolve({ data: { success: true } });
      } else if (url === '/api/forecast/climate-zones') {
        return Promise.reject(new Error('Network Error'));
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    // Use act to handle state updates
    await act(async () => {
      render(<ApiStatus />);
    });

    // Wait for API checks to complete
    await waitFor(() => {
      expect(screen.getByText(/Server:/i)).toBeInTheDocument();
    });

    // Wait for the server status to be updated
    await waitFor(() => {
      expect(screen.getByText(/Online/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    // Wait for the crops API status to be updated
    await waitFor(() => {
      const cropsElement = screen.getByText(/Crops API:/i).nextSibling;
      expect(cropsElement).toHaveTextContent(/Online/i);
    }, { timeout: 3000 });

    // Wait for the climate zones API status to be updated
    await waitFor(() => {
      const climateElement = screen.getByText(/Climate Zones API:/i).nextSibling;
      expect(climateElement).toHaveTextContent(/Offline/i);
    }, { timeout: 3000 });

    // Verify that the health endpoint was called
    expect(axios.get).toHaveBeenCalledWith('/api/health', expect.anything());
  });

  it('should handle database connection issues', async () => {
    // Mock console.warn
    const originalWarn = console.warn;
    console.warn = jest.fn();

    // Mock database connection issue
    axios.get.mockImplementation((url) => {
      if (url === '/api/health') {
        return Promise.resolve({
          data: {
            success: true,
            server: { status: 'online' },
            database: { status: 'error', error: 'Connection failed' }
          }
        });
      }
      return Promise.resolve({ data: { success: true } });
    });

    await act(async () => {
      render(<ApiStatus />);
    });

    // Wait for API checks to complete
    await waitFor(() => {
      expect(screen.getByText(/Server:/i)).toBeInTheDocument();
    });

    // Wait for the status to be updated
    await waitFor(() => {
      expect(screen.getByText(/Online/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    // Verify console.warn was called
    expect(console.warn).toHaveBeenCalled();

    // Restore console.warn
    console.warn = originalWarn;
  });
});
