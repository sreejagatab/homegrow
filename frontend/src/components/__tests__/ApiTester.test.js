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
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ApiTester from '../ApiTester';

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

  it('should render loading state initially', async () => {
    // Get the mocked function
    const { runAllApiTests } = require('../utils/testApiConnection');

    // Mock runAllApiTests to return a promise that never resolves
    runAllApiTests.mockImplementation(() => new Promise(() => {}));

    await act(async () => {
      render(<ApiTester />);
    });

    // Check for loading indicators
    expect(screen.getByText(/Running API tests.../i)).toBeInTheDocument();
  });

  it('should show test results when tests complete successfully', async () => {
    // Get the mocked functions
    const { runAllApiTests, formatApiTestResults } = require('../utils/testApiConnection');

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

    runAllApiTests.mockResolvedValue(mockResults);
    formatApiTestResults.mockReturnValue('Formatted test results');

    await act(async () => {
      render(<ApiTester />);
    });

    // Wait for tests to complete
    await waitFor(() => {
      expect(screen.getByText(/API Test Summary/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    // Check that results are displayed
    expect(screen.getByText(/Overall Status:/i)).toBeInTheDocument();
    expect(screen.getByText(/HEALTH API/i)).toBeInTheDocument();
    expect(screen.getByText(/TEST API/i)).toBeInTheDocument();
    expect(screen.getByText(/CROPS API/i)).toBeInTheDocument();
    expect(screen.getByText(/CLIMATE ZONES API/i)).toBeInTheDocument();
    expect(screen.getByText(/AUTH API/i)).toBeInTheDocument();

    // Check that runAllApiTests was called
    expect(runAllApiTests).toHaveBeenCalled();
  });

  it('should show failure status when tests fail', async () => {
    // Get the mocked functions
    const { runAllApiTests, formatApiTestResults } = require('../utils/testApiConnection');

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

    runAllApiTests.mockResolvedValue(mockResults);
    formatApiTestResults.mockReturnValue('Formatted test results');

    await act(async () => {
      render(<ApiTester />);
    });

    // Wait for tests to complete
    await waitFor(() => {
      expect(screen.getByText(/API Test Summary/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    // Check that failure status is displayed
    expect(screen.getByText(/CROPS API/i).closest('.test-item')).toHaveTextContent(/✗/);
    expect(screen.getByText(/CLIMATE ZONES API/i).closest('.test-item')).toHaveTextContent(/✗/);
  });

  it('should run tests again when refresh button is clicked', async () => {
    // Get the mocked functions
    const { runAllApiTests, formatApiTestResults } = require('../utils/testApiConnection');

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

    runAllApiTests.mockResolvedValue(mockResults);
    formatApiTestResults.mockReturnValue('Formatted test results');

    await act(async () => {
      render(<ApiTester />);
    });

    // Wait for initial tests to complete
    await waitFor(() => {
      expect(screen.getByText(/API Test Summary/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    // Clear the mock to track new calls
    runAllApiTests.mockClear();

    // Click the refresh button
    await act(async () => {
      fireEvent.click(screen.getByText(/Run Tests/i));
    });

    // Check that runAllApiTests was called again
    expect(runAllApiTests).toHaveBeenCalled();
  });

  it('should toggle details when show/hide details button is clicked', async () => {
    // Get the mocked functions
    const { runAllApiTests, formatApiTestResults } = require('../utils/testApiConnection');

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

    runAllApiTests.mockResolvedValue(mockResults);
    formatApiTestResults.mockReturnValue('Formatted test results');

    await act(async () => {
      render(<ApiTester />);
    });

    // Wait for tests to complete
    await waitFor(() => {
      expect(screen.getByText(/API Test Summary/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    // Initially, details should be hidden
    expect(screen.queryByText(/Response Time:/i)).not.toBeInTheDocument();

    // Click the show details button
    await act(async () => {
      fireEvent.click(screen.getByText(/Show Details/i));
    });

    // Now details should be visible
    await waitFor(() => {
      expect(screen.getByText(/Response Time:/i)).toBeInTheDocument();
      expect(screen.getByText(/50ms/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    // Click the hide details button
    await act(async () => {
      fireEvent.click(screen.getByText(/Hide Details/i));
    });

    // Details should be hidden again
    await waitFor(() => {
      expect(screen.queryByText(/Response Time:/i)).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should toggle auto-refresh when checkbox is clicked', async () => {
    // Get the mocked functions
    const { runAllApiTests, formatApiTestResults } = require('../utils/testApiConnection');

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

    runAllApiTests.mockResolvedValue(mockResults);
    formatApiTestResults.mockReturnValue('Formatted test results');

    // Mock setInterval and clearInterval
    jest.useFakeTimers();

    await act(async () => {
      render(<ApiTester />);
    });

    // Wait for tests to complete
    await waitFor(() => {
      expect(screen.getByText(/API Test Summary/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    // Clear the mock to track new calls
    runAllApiTests.mockClear();

    // Click the auto-refresh checkbox
    await act(async () => {
      fireEvent.click(screen.getByLabelText(/Auto-refresh/i));
    });

    // Advance timers to trigger auto-refresh
    await act(async () => {
      jest.advanceTimersByTime(30000);
    });

    // Check that runAllApiTests was called again
    expect(runAllApiTests).toHaveBeenCalled();

    // Clear the mock again
    runAllApiTests.mockClear();

    // Uncheck the auto-refresh checkbox
    await act(async () => {
      fireEvent.click(screen.getByLabelText(/Auto-refresh/i));
    });

    // Advance timers again
    await act(async () => {
      jest.advanceTimersByTime(30000);
    });

    // Check that runAllApiTests was not called
    expect(runAllApiTests).not.toHaveBeenCalled();

    // Restore timers
    jest.useRealTimers();
  });
});
