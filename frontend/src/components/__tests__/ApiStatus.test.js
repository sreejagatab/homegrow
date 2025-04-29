/**
 * ApiStatus Component Tests
 * 
 * Tests for the ApiStatus component functionality including:
 * - Rendering
 * - API status checking
 * - Error handling
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import ApiStatus from '../ApiStatus';

// Mock axios
jest.mock('axios');

describe('ApiStatus Component', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should render loading state initially', () => {
    // Mock axios.get to return a promise that never resolves
    axios.get.mockImplementation(() => new Promise(() => {}));
    
    render(<ApiStatus />);
    
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
    
    render(<ApiStatus />);
    
    // Wait for API checks to complete
    await waitFor(() => {
      expect(screen.getByText(/Server:/i)).toBeInTheDocument();
      expect(screen.getByText(/Online/i)).toBeInTheDocument();
    });
    
    // Check that all statuses are online
    expect(screen.getAllByText(/Online/i).length).toBeGreaterThan(1);
    
    // Check that axios.get was called for all endpoints
    expect(axios.get).toHaveBeenCalledWith('/api/health', expect.anything());
    expect(axios.get).toHaveBeenCalledWith('/api/forecast/crops', expect.anything());
    expect(axios.get).toHaveBeenCalledWith('/api/forecast/climate-zones', expect.anything());
  });
  
  it('should show offline status when server is down', async () => {
    // Mock server error
    axios.get.mockRejectedValue(new Error('Network Error'));
    
    render(<ApiStatus />);
    
    // Wait for API checks to complete
    await waitFor(() => {
      expect(screen.getByText(/Server:/i)).toBeInTheDocument();
      expect(screen.getByText(/Offline/i)).toBeInTheDocument();
    });
    
    // Check that all statuses are offline
    expect(screen.getAllByText(/Offline/i).length).toBeGreaterThan(1);
    
    // Check for error message
    expect(screen.getByText(/Server Connection Issue/i)).toBeInTheDocument();
    expect(screen.getByText(/Troubleshooting Tips:/i)).toBeInTheDocument();
  });
  
  it('should show partial status when some endpoints are down', async () => {
    // Mock mixed responses
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
        return Promise.reject(new Error('Endpoint Error'));
      }
      return Promise.reject(new Error('Unknown URL'));
    });
    
    render(<ApiStatus />);
    
    // Wait for API checks to complete
    await waitFor(() => {
      expect(screen.getByText(/Server:/i)).toBeInTheDocument();
      expect(screen.getByText(/Online/i)).toBeInTheDocument();
    });
    
    // Check that some endpoints are online and some are offline
    expect(screen.getByText(/Crops API:/i).nextSibling).toHaveTextContent(/Online/i);
    expect(screen.getByText(/Climate Zones API:/i).nextSibling).toHaveTextContent(/Offline/i);
    
    // Check for partial status message
    expect(screen.getByText(/Some API endpoints are offline/i)).toBeInTheDocument();
  });
  
  it('should handle database connection issues', async () => {
    // Mock database connection issue
    axios.get.mockResolvedValue({
      data: {
        success: true,
        server: { status: 'online' },
        database: { status: 'error', error: 'Connection failed' }
      }
    });
    
    render(<ApiStatus />);
    
    // Wait for API checks to complete
    await waitFor(() => {
      expect(screen.getByText(/Server:/i)).toBeInTheDocument();
      expect(screen.getByText(/Online/i)).toBeInTheDocument();
    });
    
    // Check for database error message
    expect(screen.getByText(/Server Connection Issue/i)).toBeInTheDocument();
    expect(screen.getByText(/Database issue: error/i)).toBeInTheDocument();
  });
});
