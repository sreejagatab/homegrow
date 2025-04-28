import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, setAuthToken } from '../utils/api';
import { ForecastContext } from '../contexts/ForecastContext';
import '../styles/pages/Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { updateUserData } = useContext(ForecastContext);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email || !formData.password) {
      setError('Please provide both email and password');
      return;
    }
    
    try {
      setLoading(true);
      const response = await loginUser(formData);
      
      // Set token in localStorage and axios headers
      setAuthToken(response.token);
      
      // Update user context
      updateUserData(response.user);
      
      // Redirect to dashboard or home
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-card">
          <h1>Log In</h1>
          <p className="auth-subtitle">Welcome back! Please log in to access your account.</p>
          
          {error && <div className="auth-error">{error}</div>}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
          
          <div className="auth-links">
            <p>
              Don't have an account? <Link to="/register">Sign up</Link>
            </p>
            <p>
              <Link to="/forgot-password">Forgot your password?</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;