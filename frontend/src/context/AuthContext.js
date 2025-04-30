import React, { createContext, useContext, useState, useEffect } from 'react';
import { registerUser, loginUser, getCurrentUser, setAuthToken } from '../services/api';

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Load user on initial render
  useEffect(() => {
    const loadUser = async () => {
      // Check if token exists in localStorage
      const token = localStorage.getItem('token');
      
      if (token) {
        setAuthToken(token);
        
        try {
          const res = await getCurrentUser();
          
          if (res.data && res.data.success) {
            setUser(res.data.data);
            setIsAuthenticated(true);
          } else {
            // Invalid token
            localStorage.removeItem('token');
            setAuthToken(null);
            setUser(null);
            setIsAuthenticated(false);
          }
        } catch (err) {
          console.error('Error loading user:', err);
          localStorage.removeItem('token');
          setAuthToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      
      setLoading(false);
    };
    
    loadUser();
  }, []);
  
  // Register user
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await registerUser(userData);
      
      if (res.data && res.data.success) {
        localStorage.setItem('token', res.data.token);
        setAuthToken(res.data.token);
        setUser(res.data.user);
        setIsAuthenticated(true);
      }
      
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };
  
  // Login user
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await loginUser(credentials);
      
      if (res.data && res.data.success) {
        localStorage.setItem('token', res.data.token);
        setAuthToken(res.data.token);
        setUser(res.data.user);
        setIsAuthenticated(true);
      }
      
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };
  
  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };
  
  // Clear errors
  const clearErrors = () => {
    setError(null);
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        clearErrors
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
