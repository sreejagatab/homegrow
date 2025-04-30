/**
 * MSW Server Setup
 * 
 * This file sets up the Mock Service Worker (MSW) server for tests.
 */

import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Setup MSW server with the defined handlers
export const server = setupServer(...handlers);
