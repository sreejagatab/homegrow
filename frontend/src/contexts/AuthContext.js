/**
 * Authentication Context
 * 
 * This context provides authentication state and functions to the entire application.
 */

import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

// Create the context
export const AuthContext = createContext();

/**
 * Authentication Provider Component
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Provider component
 */
export const AuthProvider = ({ children, value }) => {
  // Use provided value for testing or create new state
  const [state, setState] = useState(value || {
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null
  });

  /**
   * Load user from token in localStorage
   */
  const loadUser = useCallback(async () => {
    // Check if token exists
    const token = localStorage.getItem('token');
    
    if (!token) {
      setState(prevState => ({
        ...prevState,
        isAuthenticated: false,
        user: null,
        loading: false
      }));
      return;
    }
    
    try {
      // Set token in axios headers
      api.setAuthToken(token);
      
      // Get current user
      const response = await api.getCurrentUser();
      
      if (response.success) {
        setState(prevState => ({
          ...prevState,
          isAuthenticated: true,
          user: response.user,
          loading: false,
          error: null
        }));
      } else {
        // Invalid token
        localStorage.removeItem('token');
        setState(prevState => ({
          ...prevState,
          isAuthenticated: false,
          user: null,
          loading: false,
          error: response.message || 'Authentication failed'
        }));
      }
    } catch (error) {
      console.error('Error loading user:', error);
      localStorage.removeItem('token');
      setState(prevState => ({
        ...prevState,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: error.message || 'Authentication failed'
      }));
    }
  }, []);

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Object} - Response object
   */
  const register = async (userData) => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));
    
    try {
      const response = await api.registerUser(userData);
      
      if (response.success) {
        // Save token to localStorage
        localStorage.setItem('token', response.token);
        
        // Set token in axios headers
        api.setAuthToken(response.token);
        
        setState(prevState => ({
          ...prevState,
          isAuthenticated: true,
          user: response.user,
          loading: false,
          error: null
        }));
        
        return { success: true };
      } else {
        setState(prevState => ({
          ...prevState,
          loading: false,
          error: response.message || 'Registration failed'
        }));
        
        return { 
          success: false, 
          message: response.message || 'Registration failed' 
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      setState(prevState => ({
        ...prevState,
        loading: false,
        error: error.message || 'Registration failed'
      }));
      
      return { 
        success: false, 
        message: error.message || 'Registration failed' 
      };
    }
  };

  /**
   * Login a user
   * @param {Object} credentials - User login credentials
   * @returns {Object} - Response object
   */
  const login = async (credentials) => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));
    
    try {
      const response = await api.loginUser(credentials);
      
      if (response.success) {
        // Save token to localStorage
        localStorage.setItem('token', response.token);
        
        // Set token in axios headers
        api.setAuthToken(response.token);
        
        setState(prevState => ({
          ...prevState,
          isAuthenticated: true,
          user: response.user,
          loading: false,
          error: null
        }));
        
        return { success: true };
      } else {
        setState(prevState => ({
          ...prevState,
          loading: false,
          error: response.message || 'Login failed'
        }));
        
        return { 
          success: false, 
          message: response.message || 'Login failed' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      
      setState(prevState => ({
        ...prevState,
        loading: false,
        error: error.message || 'Login failed'
      }));
      
      return { 
        success: false, 
        message: error.message || 'Login failed' 
      };
    }
  };

  /**
   * Logout the current user
   * @returns {Object} - Response object
   */
  const logout = async () => {
    try {
      // Call logout API (optional)
      await api.logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Remove token from localStorage
      localStorage.removeItem('token');
      
      // Remove token from axios headers
      api.setAuthToken(null);
      
      // Update state
      setState(prevState => ({
        ...prevState,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      }));
      
      return { success: true };
    }
  };

  /**
   * Update user profile
   * @param {Object} userData - Updated user data
   * @returns {Object} - Response object
   */
  const updateProfile = async (userData) => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));
    
    try {
      const response = await api.updateUserProfile(userData);
      
      if (response.success) {
        setState(prevState => ({
          ...prevState,
          user: response.user,
          loading: false,
          error: null
        }));
        
        return { success: true };
      } else {
        setState(prevState => ({
          ...prevState,
          loading: false,
          error: response.message || 'Profile update failed'
        }));
        
        return { 
          success: false, 
          message: response.message || 'Profile update failed' 
        };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      
      setState(prevState => ({
        ...prevState,
        loading: false,
        error: error.message || 'Profile update failed'
      }));
      
      return { 
        success: false, 
        message: error.message || 'Profile update failed' 
      };
    }
  };

  // Load user on mount
  useEffect(() => {
    if (!value) {
      loadUser();
    }
  }, [loadUser, value]);

  // Create context value
  const contextValue = {
    ...state,
    register,
    login,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
