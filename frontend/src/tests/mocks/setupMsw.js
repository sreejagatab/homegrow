/**
 * MSW Setup for Jest
 *
 * This file sets up the Mock Service Worker (MSW) for Jest tests.
 * It configures the server to start before tests and stop after tests.
 */

// Import polyfills first
import './msw-node-polyfills';

import { server } from './server';

// Start server before all tests
beforeAll(() => {
  // Enable request interception
  server.listen({ onUnhandledRequest: 'warn' });
  console.log('MSW Server started');
});

// Reset handlers after each test
afterEach(() => {
  server.resetHandlers();
});

// Stop server after all tests
afterAll(() => {
  server.close();
  console.log('MSW Server stopped');
});
