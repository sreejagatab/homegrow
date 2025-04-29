/**
 * ApiTester Component Tests
 * 
 * Tests for the ApiTester component functionality including:
 * - Rendering
 * - API testing
 * - Result display
 * - Error handling
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ApiTester from '../ApiTester';
import * as testApiConnection from '../utils/testApiConnection';

// Mock the testApiConnection module
jest.mock('../utils/testApiConnection', () => ({
  runAllApiTests: jest.fn(),
  formatApiTestResults: jest.fn()
}));

describe('ApiTester Component', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should render loading state initially', () => {
    // Mock runAllApiTests to return a promise that never resolves
    testApiConnection.runAllApiTests.mockImplementation(() => new Promise(() => {}));
    
    render(<ApiTester />);
    
    // Check for loading indicators
    expect(screen.getByText(/Running API tests.../i)).toBeInTheDocument();
  });
  
  it('should show test results when tests complete successfully', async () => {
    // Mock successful test results
    const mockResults = {
      overallSuccess: true,
      timestamp: new Date().toISOString(),
      health: { success: true, status: 200 },
      test: { success: true, status: 200 },
      crops: { success: true, status: 200, itemCount: 5 },
      climateZones: { success: true, status: 200, itemCount: 3 },
      auth: { success: true, status: 200 }
    };
    
    testApiConnection.runAllApiTests.mockResolvedValue(mockResults);
    testApiConnection.formatApiTestResults.mockReturnValue('Formatted test results');
    
    render(<ApiTester />);
    
    // Wait for tests to complete
    await waitFor(() => {
      expect(screen.getByText(/API Test Summary/i)).toBeInTheDocument();
    });
    
    // Check that results are displayed
    expect(screen.getByText(/Overall Status:/i)).toBeInTheDocument();
    expect(screen.getByText(/HEALTH API/i)).toBeInTheDocument();
    expect(screen.getByText(/TEST API/i)).toBeInTheDocument();
    expect(screen.getByText(/CROPS API/i)).toBeInTheDocument();
    expect(screen.getByText(/CLIMATE ZONES API/i)).toBeInTheDocument();
    expect(screen.getByText(/AUTH API/i)).toBeInTheDocument();
    
    // Check that runAllApiTests was called
    expect(testApiConnection.runAllApiTests).toHaveBeenCalled();
  });
  
  it('should show failure status when tests fail', async () => {
    // Mock failed test results
    const mockResults = {
      overallSuccess: false,
      timestamp: new Date().toISOString(),
      health: { success: true, status: 200 },
      test: { success: true, status: 200 },
      crops: { success: false, status: 500, error: 'Internal Server Error' },
      climateZones: { success: false, status: 404, error: 'Not Found' },
      auth: { success: true, status: 200 }
    };
    
    testApiConnection.runAllApiTests.mockResolvedValue(mockResults);
    testApiConnection.formatApiTestResults.mockReturnValue('Formatted test results');
    
    render(<ApiTester />);
    
    // Wait for tests to complete
    await waitFor(() => {
      expect(screen.getByText(/API Test Summary/i)).toBeInTheDocument();
    });
    
    // Check that failure status is displayed
    expect(screen.getByText(/CROPS API/i).closest('.test-item')).toHaveTextContent(/✗/);
    expect(screen.getByText(/CLIMATE ZONES API/i).closest('.test-item')).toHaveTextContent(/✗/);
  });
  
  it('should run tests again when refresh button is clicked', async () => {
    // Mock successful test results
    const mockResults = {
      overallSuccess: true,
      timestamp: new Date().toISOString(),
      health: { success: true, status: 200 },
      test: { success: true, status: 200 },
      crops: { success: true, status: 200 },
      climateZones: { success: true, status: 200 },
      auth: { success: true, status: 200 }
    };
    
    testApiConnection.runAllApiTests.mockResolvedValue(mockResults);
    testApiConnection.formatApiTestResults.mockReturnValue('Formatted test results');
    
    render(<ApiTester />);
    
    // Wait for initial tests to complete
    await waitFor(() => {
      expect(screen.getByText(/API Test Summary/i)).toBeInTheDocument();
    });
    
    // Clear the mock to track new calls
    testApiConnection.runAllApiTests.mockClear();
    
    // Click the refresh button
    fireEvent.click(screen.getByText(/Run Tests/i));
    
    // Check that runAllApiTests was called again
    expect(testApiConnection.runAllApiTests).toHaveBeenCalled();
  });
  
  it('should toggle details when show/hide details button is clicked', async () => {
    // Mock successful test results
    const mockResults = {
      overallSuccess: true,
      timestamp: new Date().toISOString(),
      health: { success: true, status: 200, responseTime: 50 },
      test: { success: true, status: 200 },
      crops: { success: true, status: 200, itemCount: 5 },
      climateZones: { success: true, status: 200 },
      auth: { success: true, status: 200 }
    };
    
    testApiConnection.runAllApiTests.mockResolvedValue(mockResults);
    testApiConnection.formatApiTestResults.mockReturnValue('Formatted test results');
    
    render(<ApiTester />);
    
    // Wait for tests to complete
    await waitFor(() => {
      expect(screen.getByText(/API Test Summary/i)).toBeInTheDocument();
    });
    
    // Initially, details should be hidden
    expect(screen.queryByText(/Response Time:/i)).not.toBeInTheDocument();
    
    // Click the show details button
    fireEvent.click(screen.getByText(/Show Details/i));
    
    // Now details should be visible
    expect(screen.getByText(/Response Time:/i)).toBeInTheDocument();
    expect(screen.getByText(/50ms/i)).toBeInTheDocument();
    
    // Click the hide details button
    fireEvent.click(screen.getByText(/Hide Details/i));
    
    // Details should be hidden again
    expect(screen.queryByText(/Response Time:/i)).not.toBeInTheDocument();
  });
  
  it('should toggle auto-refresh when checkbox is clicked', async () => {
    // Mock successful test results
    const mockResults = {
      overallSuccess: true,
      timestamp: new Date().toISOString(),
      health: { success: true, status: 200 },
      test: { success: true, status: 200 },
      crops: { success: true, status: 200 },
      climateZones: { success: true, status: 200 },
      auth: { success: true, status: 200 }
    };
    
    testApiConnection.runAllApiTests.mockResolvedValue(mockResults);
    testApiConnection.formatApiTestResults.mockReturnValue('Formatted test results');
    
    // Mock setInterval and clearInterval
    jest.useFakeTimers();
    
    render(<ApiTester />);
    
    // Wait for tests to complete
    await waitFor(() => {
      expect(screen.getByText(/API Test Summary/i)).toBeInTheDocument();
    });
    
    // Clear the mock to track new calls
    testApiConnection.runAllApiTests.mockClear();
    
    // Click the auto-refresh checkbox
    fireEvent.click(screen.getByLabelText(/Auto-refresh/i));
    
    // Advance timers to trigger auto-refresh
    jest.advanceTimersByTime(30000);
    
    // Check that runAllApiTests was called again
    expect(testApiConnection.runAllApiTests).toHaveBeenCalled();
    
    // Clear the mock again
    testApiConnection.runAllApiTests.mockClear();
    
    // Uncheck the auto-refresh checkbox
    fireEvent.click(screen.getByLabelText(/Auto-refresh/i));
    
    // Advance timers again
    jest.advanceTimersByTime(30000);
    
    // Check that runAllApiTests was not called
    expect(testApiConnection.runAllApiTests).not.toHaveBeenCalled();
    
    // Restore timers
    jest.useRealTimers();
  });
});
