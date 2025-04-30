/**
 * AuthContext Tests
 * 
 * Tests for the authentication context functionality including:
 * - User registration
 * - User login
 * - User logout
 * - Loading user from token
 * - Error handling
 */

import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth } from '../AuthContext';
import * as api from '../../services/api';

// Mock the API service
jest.mock('../../services/api');

// Test user data
const testUser = {
  id: 'user123',
  name: 'Test User',
  email: 'test@example.com',
  roles: ['user']
};

// Test component that uses the auth context
const TestComponent = () => {
  const { 
    user, 
    isAuthenticated, 
    loading, 
    error, 
    register, 
    login, 
    logout 
  } = useAuth();

  return (
    <div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="authenticated">{isAuthenticated.toString()}</div>
      <div data-testid="user">{user ? JSON.stringify(user) : 'null'}</div>
      <div data-testid="error">{error || 'no error'}</div>
      <button onClick={() => register({ name: 'New User', email: 'new@example.com', password: 'password123' })}>
        Register
      </button>
      <button onClick={() => login({ email: 'test@example.com', password: 'password123' })}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

// Helper to render with AuthProvider
const renderWithAuthProvider = () => {
  return render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );
};

describe('AuthContext', () => {
  // Setup localStorage mock
  beforeAll(() => {
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn()
      },
      writable: true
    });
  });

  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.getItem.mockReturnValue(null);
  });

  it('should initialize with default values', async () => {
    // Mock getCurrentUser to return null (no token)
    api.getCurrentUser.mockRejectedValue(new Error('No token'));

    renderWithAuthProvider();

    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });

    // Check initial state
    expect(screen.getByTestId('authenticated').textContent).toBe('false');
    expect(screen.getByTestId('user').textContent).toBe('null');
    expect(screen.getByTestId('error').textContent).toBe('no error');
  });

  it('should load user from token in localStorage', async () => {
    // Mock localStorage to return a token
    window.localStorage.getItem.mockReturnValue('valid-token');

    // Mock getCurrentUser to return a user
    api.getCurrentUser.mockResolvedValue({
      data: {
        success: true,
        data: testUser
      }
    });

    renderWithAuthProvider();

    // Wait for user to be loaded
    await waitFor(() => {
      expect(screen.getByTestId('authenticated').textContent).toBe('true');
    });

    // Check that user was loaded
    expect(screen.getByTestId('user').textContent).toContain(testUser.email);
    expect(api.setAuthToken).toHaveBeenCalledWith('valid-token');
  });

  it('should handle login successfully', async () => {
    // Mock loginUser to return a successful response
    api.loginUser.mockResolvedValue({
      data: {
        success: true,
        token: 'new-token',
        user: testUser
      }
    });

    renderWithAuthProvider();

    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });

    // Click login button
    await act(async () => {
      screen.getByText('Login').click();
    });

    // Wait for login to complete
    await waitFor(() => {
      expect(screen.getByTestId('authenticated').textContent).toBe('true');
    });

    // Check that user was set
    expect(screen.getByTestId('user').textContent).toContain(testUser.email);
    expect(window.localStorage.setItem).toHaveBeenCalledWith('token', 'new-token');
    expect(api.setAuthToken).toHaveBeenCalledWith('new-token');
  });

  it('should handle login failure', async () => {
    // Mock loginUser to return an error
    const errorMessage = 'Invalid credentials';
    api.loginUser.mockRejectedValue({
      response: {
        data: {
          message: errorMessage
        }
      }
    });

    renderWithAuthProvider();

    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });

    // Click login button
    await act(async () => {
      screen.getByText('Login').click();
    });

    // Wait for login to fail
    await waitFor(() => {
      expect(screen.getByTestId('error').textContent).toBe(errorMessage);
    });

    // Check that user was not set
    expect(screen.getByTestId('authenticated').textContent).toBe('false');
    expect(screen.getByTestId('user').textContent).toBe('null');
  });

  it('should handle registration successfully', async () => {
    // Mock registerUser to return a successful response
    api.registerUser.mockResolvedValue({
      data: {
        success: true,
        token: 'new-token',
        user: {
          id: 'new-user-123',
          name: 'New User',
          email: 'new@example.com',
          roles: ['user']
        }
      }
    });

    renderWithAuthProvider();

    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });

    // Click register button
    await act(async () => {
      screen.getByText('Register').click();
    });

    // Wait for registration to complete
    await waitFor(() => {
      expect(screen.getByTestId('authenticated').textContent).toBe('true');
    });

    // Check that user was set
    expect(screen.getByTestId('user').textContent).toContain('new@example.com');
    expect(window.localStorage.setItem).toHaveBeenCalledWith('token', 'new-token');
    expect(api.setAuthToken).toHaveBeenCalledWith('new-token');
  });

  it('should handle registration failure', async () => {
    // Mock registerUser to return an error
    const errorMessage = 'Email already in use';
    api.registerUser.mockRejectedValue({
      response: {
        data: {
          message: errorMessage
        }
      }
    });

    renderWithAuthProvider();

    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });

    // Click register button
    await act(async () => {
      screen.getByText('Register').click();
    });

    // Wait for registration to fail
    await waitFor(() => {
      expect(screen.getByTestId('error').textContent).toBe(errorMessage);
    });

    // Check that user was not set
    expect(screen.getByTestId('authenticated').textContent).toBe('false');
    expect(screen.getByTestId('user').textContent).toBe('null');
  });

  it('should handle logout', async () => {
    // Mock localStorage to return a token
    window.localStorage.getItem.mockReturnValue('valid-token');

    // Mock getCurrentUser to return a user
    api.getCurrentUser.mockResolvedValue({
      data: {
        success: true,
        data: testUser
      }
    });

    renderWithAuthProvider();

    // Wait for user to be loaded
    await waitFor(() => {
      expect(screen.getByTestId('authenticated').textContent).toBe('true');
    });

    // Click logout button
    await act(async () => {
      screen.getByText('Logout').click();
    });

    // Check that user was cleared
    expect(screen.getByTestId('authenticated').textContent).toBe('false');
    expect(screen.getByTestId('user').textContent).toBe('null');
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(api.setAuthToken).toHaveBeenCalledWith(null);
  });

  it('should handle invalid token', async () => {
    // Mock localStorage to return a token
    window.localStorage.getItem.mockReturnValue('invalid-token');

    // Mock getCurrentUser to return an error
    api.getCurrentUser.mockRejectedValue(new Error('Invalid token'));

    renderWithAuthProvider();

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });

    // Check that user was not set
    expect(screen.getByTestId('authenticated').textContent).toBe('false');
    expect(screen.getByTestId('user').textContent).toBe('null');
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(api.setAuthToken).toHaveBeenCalledWith(null);
  });
});
