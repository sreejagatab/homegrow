/**
 * Jest Setup File
 *
 * This file is run before each test file to set up the testing environment.
 */

// Import Jest DOM matchers
import '@testing-library/jest-dom';

// Setup fetch mock
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

// TextEncoder/TextDecoder polyfills are now handled in msw-node-polyfills.js

// Import MSW setup
import './tests/mocks/setupMsw';

// Mock localStorage
class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }
}

// Set up localStorage mock before tests
Object.defineProperty(window, 'localStorage', {
  value: new LocalStorageMock(),
  writable: true
});

// Also set it on global for direct access
global.localStorage = window.localStorage;

// Mock console.error and console.warn to keep test output clean
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    // Check if this is a React Testing Library error
    if (
      args[0] &&
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: An update to') ||
        args[0].includes('Warning: Can\'t perform a React state update on an unmounted component'))
    ) {
      return;
    }
    originalConsoleError(...args);
  };

  console.warn = (...args) => {
    // Check if this is a React Router warning
    if (
      args[0] &&
      typeof args[0] === 'string' &&
      (args[0].includes('React Router Future Flag Warning') ||
        args[0].includes('Warning: React does not recognize the'))
    ) {
      return;
    }
    originalConsoleWarn(...args);
  };
});

// Reset localStorage before each test
beforeEach(() => {
  window.localStorage.clear();
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});
