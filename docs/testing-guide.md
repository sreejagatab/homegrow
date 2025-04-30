# HomeGrow Testing Guide

This document provides a comprehensive guide to testing the HomeGrow Forecast Tool application. It covers all aspects of testing, including unit tests, integration tests, end-to-end tests, and load tests.

## Table of Contents

1. [Testing Overview](#testing-overview)
2. [Test Environment Setup](#test-environment-setup)
3. [Running Tests](#running-tests)
   - [Backend Tests](#backend-tests)
   - [Frontend Tests](#frontend-tests)
   - [End-to-End Tests](#end-to-end-tests)
   - [Load Tests](#load-tests)
4. [Writing Tests](#writing-tests)
   - [Backend Test Guidelines](#backend-test-guidelines)
   - [Frontend Test Guidelines](#frontend-test-guidelines)
5. [Continuous Integration](#continuous-integration)
6. [Test Coverage](#test-coverage)
7. [Troubleshooting](#troubleshooting)

## Testing Overview

The HomeGrow Forecast Tool uses a comprehensive testing strategy that includes:

- **Unit Tests**: Test individual components and functions in isolation
- **Integration Tests**: Test interactions between components
- **End-to-End Tests**: Test the complete application flow
- **Load Tests**: Test the application's performance under load

All tests are automated and can be run using npm scripts.

## Test Environment Setup

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (for backend tests)

### Environment Variables

Create a `.env.test` file in the backend directory with the following content:

```
NODE_ENV=test
PORT=5001
MONGO_URI=mongodb://localhost:27017/homegrow_test
JWT_SECRET=test_secret
JWT_EXPIRE=1d
```

## Running Tests

### Backend Tests

To run all backend tests:

```bash
cd backend
npm test
```

To run a specific test file:

```bash
cd backend
npm test -- tests/services/forecastService.test.js
```

### Frontend Tests

To run all frontend tests:

```bash
cd frontend
npm test
```

To run a specific test file:

```bash
cd frontend
npm test -- --testPathPattern=ForecastResults
```

### End-to-End Tests

End-to-end tests use React Testing Library to simulate user interactions with the application.

To run end-to-end tests:

```bash
cd frontend
npm test -- --testPathPattern=e2e
```

### Load Tests

Load tests use Artillery to simulate multiple users accessing the application simultaneously.

To run load tests:

```bash
./run-load-tests.bat
```

This script will:
1. Start the backend server
2. Run the load tests
3. Generate an HTML report
4. Stop the backend server

The load test report will be available at `load-test-report.html`.

## Writing Tests

### Backend Test Guidelines

#### Unit Tests

Backend unit tests use Jest and Supertest. Each test file should focus on a specific module or functionality.

Example of a service test:

```javascript
const forecastService = require('../../src/services/forecastService');

describe('Forecast Service', () => {
  it('should calculate a forecast for tomatoes', async () => {
    // Setup
    const params = {
      crop: 'tomatoes',
      climate: 'mediterranean',
      environment: 'open',
      area: 100
    };
    
    // Execute
    const forecast = await forecastService.calculateForecast(params);
    
    // Assert
    expect(forecast).toBeDefined();
    expect(forecast.cropProfile.name).toBe('Tomatoes');
  });
});
```

#### API Tests

API tests use Supertest to make HTTP requests to the API endpoints.

Example of an API test:

```javascript
const request = require('supertest');
const app = require('../../src/app');

describe('Auth Routes', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });
});
```

### Frontend Test Guidelines

Frontend tests use React Testing Library to render components and simulate user interactions.

Example of a component test:

```javascript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ForecastForm from '../components/ForecastForm';

describe('ForecastForm Component', () => {
  it('should submit the form with valid data', () => {
    const mockOnSubmit = jest.fn();
    
    render(<ForecastForm onSubmit={mockOnSubmit} />);
    
    // Fill out the form
    fireEvent.click(screen.getByLabelText(/Mediterranean/i));
    fireEvent.click(screen.getByLabelText(/Open Field/i));
    fireEvent.change(screen.getByLabelText(/Growing Area/i), {
      target: { value: '100' }
    });
    fireEvent.click(screen.getByLabelText(/Tomatoes/i));
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Generate Forecast/i }));
    
    // Check that onSubmit was called with the correct data
    expect(mockOnSubmit).toHaveBeenCalledWith({
      climate: 'mediterranean',
      environment: 'open',
      area: 100,
      crops: ['tomatoes']
    });
  });
});
```

## Continuous Integration

The HomeGrow Forecast Tool uses GitHub Actions for continuous integration. The CI pipeline runs all tests on every push to the main branch and on pull requests.

The CI configuration is defined in `.github/workflows/ci.yml`.

## Test Coverage

To generate a test coverage report for the backend:

```bash
cd backend
npm run test:coverage
```

To generate a test coverage report for the frontend:

```bash
cd frontend
npm run test:coverage
```

The coverage reports will be available in the `coverage` directory.

## Troubleshooting

### Common Issues

#### MongoDB Connection Errors

If you see MongoDB connection errors in the backend tests, make sure:
- MongoDB is running
- The MONGO_URI in .env.test is correct

#### Rate Limiting Issues

Rate limiting is disabled in the test environment. If you're seeing rate limiting errors, make sure:
- The NODE_ENV environment variable is set to 'test'
- The rate limiter middleware is correctly configured to skip rate limiting in the test environment

#### React Testing Library Warnings

If you see warnings about updates not wrapped in act(), make sure:
- All state updates in tests are wrapped in act()
- Async operations are properly awaited

Example:

```javascript
// Instead of this:
fireEvent.click(button);

// Do this:
await act(async () => {
  fireEvent.click(button);
});
```
