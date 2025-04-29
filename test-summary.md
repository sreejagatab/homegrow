# HomeGrow Forecast Tool - Test Summary

This document provides an overview of the testing strategy implemented for the HomeGrow Forecast Tool.

## Testing Strategy

The testing strategy for the HomeGrow Forecast Tool includes:

1. **Unit Tests**: Testing individual components and functions in isolation
2. **Integration Tests**: Testing how components work together
3. **API Tests**: Testing the API endpoints and their responses
4. **Authentication Tests**: Testing the authentication system
5. **Database Tests**: Testing the database connection and operations
6. **Frontend Tests**: Testing the React components and their behavior
7. **End-to-End Tests**: Testing the complete application flow

## Test Coverage

### Backend Tests

| Category | Test Files | Description |
|----------|------------|-------------|
| Models | `User.test.js` | Tests for the User model including password hashing, JWT token generation, and validation |
| Controllers | `authController.test.js` | Tests for the authentication controller including registration, login, and user management |
| Middleware | `auth.test.js` | Tests for the authentication middleware including token verification and role-based access control |
| Services | `forecastService.test.js` | Tests for the forecast service including forecast calculation, planting calendar generation, and risk assessment |
| Routes | `auth.routes.test.js` | Tests for the authentication API routes including registration, login, and protected routes |

### Frontend Tests

| Category | Test Files | Description |
|----------|------------|-------------|
| Services | `api.test.js` | Tests for the API service including API requests, authentication token handling, and error handling |
| Components | `ApiStatus.test.js` | Tests for the API status component including rendering, API status checking, and error handling |
| Components | `ApiTester.test.js` | Tests for the API tester component including rendering, API testing, and result display |
| Components | `AuthFlow.test.js` | Tests for the authentication flow including login form, registration form, and authentication state management |
| Components | `ForecastForm.test.js` | Tests for the forecast form including rendering, validation, and submission |
| Components | `ForecastResults.test.js` | Tests for the forecast results including rendering, chart display, and saving forecasts |
| Utils | `testApiConnection.test.js` | Tests for the API connection test utility including API health testing, endpoint testing, and result formatting |

## Diagnostic Tools

The following diagnostic tools have been created to help identify and fix issues:

1. **MongoDB Connection Test** (`backend/test-mongodb.js`): Tests the connection to MongoDB and provides detailed error information
2. **Server Status Check** (`backend/server-status.js`): Checks the server environment and provides information about the system
3. **Authentication Test** (`backend/test-auth.js`): Tests the authentication system including registration, login, and protected routes
4. **API Status Component** (`frontend/src/components/ApiStatus.js`): Displays the status of the API and its endpoints
5. **API Tester Component** (`frontend/src/components/ApiTester.js`): Tests the API endpoints and displays the results
6. **Docker Testing Environment** (`Dockerfile.test` and `run-docker-tests.bat`): Provides an isolated environment for testing

## Running Tests

### Running All Tests

To run all tests, use the provided scripts:

**Windows**:
```
run-all-tests.bat
```

**Unix/Mac**:
```
./run-all-tests.sh
```

### Running Backend Tests

```
cd backend
npm test
```

For test coverage:
```
cd backend
npm run test:coverage
```

### Running Frontend Tests

```
cd frontend
npm test
```

For test coverage:
```
cd frontend
npm run test:coverage
```

### Running Specific Tests

To run a specific test file:

```
cd backend
npx jest tests/models/User.test.js
```

```
cd frontend
npm test -- --testPathPattern=src/components/__tests__/ApiStatus.test.js
```

## Continuous Integration

The project is configured with GitHub Actions for continuous integration. The workflow is defined in `.github/workflows/test.yml` and includes:

1. Running backend tests with a MongoDB service
2. Running frontend tests
3. Reporting test results

## Test Reports

Test reports are generated in the following locations:

- Backend: `backend/coverage`
- Frontend: `frontend/coverage`

## Troubleshooting

If you encounter issues with the tests, check the following:

1. Make sure MongoDB is running (for backend tests)
2. Check that all dependencies are installed (`npm install` in both backend and frontend directories)
3. Check the environment variables in `.env.test`
4. Run the diagnostic tools to identify specific issues

## Adding New Tests

When adding new features, please follow these guidelines for adding tests:

1. Create a new test file in the appropriate directory
2. Follow the existing test patterns and naming conventions
3. Ensure that all critical functionality is covered by tests
4. Run the tests to make sure they pass before submitting a pull request

## Test Quality Metrics

The following metrics are used to evaluate test quality:

1. **Test Coverage**: Aim for at least 80% code coverage
2. **Test Speed**: Tests should run quickly to enable fast feedback
3. **Test Independence**: Tests should not depend on each other
4. **Test Readability**: Tests should be easy to understand and maintain
