# HomeGrow Testing Guide

This guide provides information on how to run tests and improve the testing process for the HomeGrow project.

## Running Tests

### Frontend Tests

To run all frontend tests:

```bash
cd frontend
npm test
```

To run a specific test file:

```bash
cd frontend
npm test -- --testPathPattern=ComponentName.test.js
```

To run tests in watch mode:

```bash
cd frontend
npm test -- --watch
```

### Backend Tests

To run all backend tests:

```bash
cd backend
npm test
```

### End-to-End Tests

To run end-to-end tests:

```bash
npm run test:e2e
```

## Test Structure

The tests are organized as follows:

- `frontend/src/components/__tests__/`: Tests for React components
- `frontend/src/services/__tests__/`: Tests for API services
- `frontend/src/utils/__tests__/`: Tests for utility functions
- `frontend/src/tests/e2e/`: End-to-end tests
- `frontend/src/tests/mocks/`: Mock data and services for testing
- `backend/tests/`: Backend tests

## Mock Data and Services

We use mock data and services to simulate API responses in tests. The mock data is located in:

- `frontend/src/tests/mocks/data/`: Mock data files
- `frontend/src/tests/mocks/mockApiService.js`: Mock API service

## Best Practices

1. **Use act() for State Updates**: Always wrap state updates in act() to avoid warnings.
2. **Use waitFor with Timeouts**: Use waitFor with appropriate timeouts for asynchronous operations.
3. **Mock Dependencies Consistently**: Mock dependencies consistently across all tests.
4. **Test Edge Cases**: Add tests for error states and edge cases.
5. **Keep Tests Independent**: Each test should be independent of others.
6. **Use Descriptive Test Names**: Use descriptive names for tests to make it clear what they're testing.
7. **Clean Up After Tests**: Clean up any resources created during tests.

## Common Issues and Solutions

### act() Warnings

If you see warnings about updates not wrapped in act(), make sure to wrap all state updates in act():

```javascript
await act(async () => {
  fireEvent.click(button);
});
```

### Timeout Issues

If tests are timing out, increase the timeout:

```javascript
await waitFor(() => {
  expect(element).toBeInTheDocument();
}, { timeout: 5000 });
```

### Router Nesting Issues

If you're seeing errors about nested Routers, use the MockApp component instead of the real App component:

```javascript
import MockApp from '../mocks/MockApp';

// ...

render(
  <AuthProvider>
    <MemoryRouter initialEntries={['/']}>
      <MockApp />
    </MemoryRouter>
  </AuthProvider>
);
```

## Improving Test Coverage

To improve test coverage:

1. Run tests with coverage report:

```bash
cd frontend
npm test -- --coverage
```

2. Identify areas with low coverage and add tests for those areas.
3. Focus on testing critical user flows and edge cases.

## Resources

- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Mock Service Worker Documentation](https://mswjs.io/docs/)
- [Testing React Applications](https://reactjs.org/docs/testing.html)
