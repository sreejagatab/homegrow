/**
 * End-to-End Authentication Tests
 *
 * Tests for the authentication flow including:
 * - User registration
 * - User login
 * - User logout
 * - Protected routes
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import MockApp from '../mocks/MockApp';
import { renderWithProviders } from '../utils/testUtils';

// Test user data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'Password123'
};

describe('Authentication Flow', () => {
  // Setup mocks before each test
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();

    // Reset MSW handlers
    server.resetHandlers();

    // Add specific handlers for authentication tests
    server.use(
      http.post('http://localhost:5001/api/auth/register', async ({ request }) => {
        const body = await request.json();
        const { name, email, password } = body;

        if (!name || !email || !password) {
          return HttpResponse.json({
            success: false,
            message: 'Please provide all required fields'
          }, { status: 400 });
        }

        return HttpResponse.json({
          success: true,
          token: 'test-token',
          user: {
            id: '1',
            name,
            email
          }
        }, { status: 201 });
      }),

      http.post('http://localhost:5001/api/auth/login', async ({ request }) => {
        const body = await request.json();
        const { email, password } = body;

        if (email === testUser.email && password === testUser.password) {
          return HttpResponse.json({
            success: true,
            token: 'test-token',
            user: {
              id: '1',
              name: testUser.name,
              email: testUser.email
            }
          }, { status: 200 });
        }

        return HttpResponse.json({
          success: false,
          message: 'Invalid credentials'
        }, { status: 401 });
      }),

      http.get('http://localhost:5001/api/auth/me', async ({ request }) => {
        const authHeader = request.headers.get('Authorization');

        if (authHeader && authHeader.includes('test-token')) {
          return HttpResponse.json({
            success: true,
            data: {
              id: '1',
              name: testUser.name,
              email: testUser.email
            }
          }, { status: 200 });
        }

        return HttpResponse.json({
          success: false,
          message: 'Not authorized'
        }, { status: 401 });
      })
    );
  });

  it('should allow a user to register successfully', async () => {
    // Render the app
    await act(async () => {
      renderWithProviders(<MockApp />, { initialRoute: '/register' });
    });

    // Wait for the register page to load
    await waitFor(() => {
      expect(screen.getByText(/Create Account/i)).toBeInTheDocument();
    });

    // Fill out the registration form
    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: testUser.name }
    });

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: testUser.email }
    });

    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: testUser.password }
    });

    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));
    });

    // Wait for redirect to dashboard after successful registration
    await waitFor(() => {
      expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    });

    // Check that the user is logged in
    expect(localStorage.getItem('token')).toBe('test-token');
  });

  it('should allow a user to login successfully', async () => {
    // Render the app
    await act(async () => {
      renderWithProviders(<MockApp />, { initialRoute: '/login' });
    });

    // Wait for the login page to load
    await waitFor(() => {
      expect(screen.getByText(/Log In/i)).toBeInTheDocument();
    });

    // Fill out the login form
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: testUser.email }
    });

    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: testUser.password }
    });

    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Log In/i }));
    });

    // Wait for redirect to dashboard after successful login
    await waitFor(() => {
      expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    });

    // Check that the user is logged in
    expect(localStorage.getItem('token')).toBe('test-token');
  });

  it('should show an error message for invalid login credentials', async () => {
    // Render the app
    await act(async () => {
      renderWithProviders(<MockApp />, { initialRoute: '/login' });
    });

    // Wait for the login page to load
    await waitFor(() => {
      expect(screen.getByText(/Log In/i)).toBeInTheDocument();
    });

    // Fill out the login form with invalid credentials
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: testUser.email }
    });

    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'wrong-password' }
    });

    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Log In/i }));
    });

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });

    // Check that the user is not logged in
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('should redirect to login when accessing a protected route while not authenticated', async () => {
    // Render the app with a protected route
    await act(async () => {
      renderWithProviders(<MockApp />, { initialRoute: '/dashboard' });
    });

    // Wait for redirect to login page
    await waitFor(() => {
      expect(screen.getByText(/Log In/i)).toBeInTheDocument();
    });

    // Check for message about needing to log in
    expect(screen.getByText(/Please log in to access this page/i)).toBeInTheDocument();
  });

  it('should allow a user to logout', async () => {
    // Set token in localStorage to simulate logged in state
    localStorage.setItem('token', 'test-token');

    // Render the app
    await act(async () => {
      renderWithProviders(<MockApp />, { initialRoute: '/dashboard' });
    });

    // Wait for the dashboard to load
    await waitFor(() => {
      expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    });

    // Click the logout button
    await act(async () => {
      fireEvent.click(screen.getByText(/Logout/i));
    });

    // Wait for redirect to home page after logout
    await waitFor(() => {
      expect(screen.getByText(/HomeGrow Forecast Tool/i)).toBeInTheDocument();
    });

    // Check that the user is logged out
    expect(localStorage.getItem('token')).toBeNull();
  });
});
