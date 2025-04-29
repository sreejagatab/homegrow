/**
 * Authentication Flow Tests
 * 
 * Tests for the authentication flow including:
 * - Login form
 * - Registration form
 * - Authentication state management
 * - Protected routes
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Login from '../auth/Login';
import Register from '../auth/Register';
import AuthContext from '../../context/AuthContext';

// Mock axios
jest.mock('axios');

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

// Test user data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'Password123'
};

// Mock AuthContext provider
const mockAuthContext = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  clearErrors: jest.fn()
};

const renderWithAuthContext = (ui, contextValue = mockAuthContext) => {
  return render(
    <AuthContext.Provider value={contextValue}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

describe('Authentication Flow', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('Login Component', () => {
    it('should render login form', () => {
      renderWithAuthContext(<Login />);
      
      // Check for form elements
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
      expect(screen.getByText(/Don't have an account/i)).toBeInTheDocument();
    });
    
    it('should handle form submission', async () => {
      renderWithAuthContext(<Login />);
      
      // Fill out the form
      fireEvent.change(screen.getByLabelText(/Email/i), {
        target: { value: testUser.email }
      });
      
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: testUser.password }
      });
      
      // Submit the form
      fireEvent.click(screen.getByRole('button', { name: /Login/i }));
      
      // Check that login function was called with correct data
      await waitFor(() => {
        expect(mockAuthContext.login).toHaveBeenCalledWith({
          email: testUser.email,
          password: testUser.password
        });
      });
    });
    
    it('should display error message when login fails', async () => {
      // Mock error state
      const errorContext = {
        ...mockAuthContext,
        error: 'Invalid credentials'
      };
      
      renderWithAuthContext(<Login />, errorContext);
      
      // Check for error message
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
    
    it('should clear errors when component unmounts', () => {
      const { unmount } = renderWithAuthContext(<Login />);
      
      // Unmount the component
      unmount();
      
      // Check that clearErrors was called
      expect(mockAuthContext.clearErrors).toHaveBeenCalled();
    });
  });
  
  describe('Register Component', () => {
    it('should render registration form', () => {
      renderWithAuthContext(<Register />);
      
      // Check for form elements
      expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
      expect(screen.getByText(/Already have an account/i)).toBeInTheDocument();
    });
    
    it('should handle form submission', async () => {
      renderWithAuthContext(<Register />);
      
      // Fill out the form
      fireEvent.change(screen.getByLabelText(/Name/i), {
        target: { value: testUser.name }
      });
      
      fireEvent.change(screen.getByLabelText(/Email/i), {
        target: { value: testUser.email }
      });
      
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: testUser.password }
      });
      
      fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
        target: { value: testUser.password }
      });
      
      // Submit the form
      fireEvent.click(screen.getByRole('button', { name: /Register/i }));
      
      // Check that register function was called with correct data
      await waitFor(() => {
        expect(mockAuthContext.register).toHaveBeenCalledWith({
          name: testUser.name,
          email: testUser.email,
          password: testUser.password
        });
      });
    });
    
    it('should validate password match', async () => {
      renderWithAuthContext(<Register />);
      
      // Fill out the form with mismatched passwords
      fireEvent.change(screen.getByLabelText(/Name/i), {
        target: { value: testUser.name }
      });
      
      fireEvent.change(screen.getByLabelText(/Email/i), {
        target: { value: testUser.email }
      });
      
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: testUser.password }
      });
      
      fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
        target: { value: 'different-password' }
      });
      
      // Submit the form
      fireEvent.click(screen.getByRole('button', { name: /Register/i }));
      
      // Check for error message
      await waitFor(() => {
        expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
      });
      
      // Check that register function was not called
      expect(mockAuthContext.register).not.toHaveBeenCalled();
    });
    
    it('should display error message when registration fails', async () => {
      // Mock error state
      const errorContext = {
        ...mockAuthContext,
        error: 'Email already in use'
      };
      
      renderWithAuthContext(<Register />, errorContext);
      
      // Check for error message
      expect(screen.getByText(/Email already in use/i)).toBeInTheDocument();
    });
    
    it('should clear errors when component unmounts', () => {
      const { unmount } = renderWithAuthContext(<Register />);
      
      // Unmount the component
      unmount();
      
      // Check that clearErrors was called
      expect(mockAuthContext.clearErrors).toHaveBeenCalled();
    });
  });
});
