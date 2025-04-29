// frontend/src/pages/UserProfile.js

import React, { useState, useContext } from 'react';
import { ForecastContext } from '../contexts/ForecastContext';
import { updateUserPreferences } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/pages/UserProfile.css';

/**
 * User Profile page component
 * @returns {React.ReactNode} User profile page
 */
const UserProfile = () => {
  const { user, loading, error, updateUserData } = useContext(ForecastContext);
  
  // Local state for form
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    defaultCountry: user?.preferences?.defaultCountry || '',
    defaultClimate: user?.preferences?.defaultClimate || '',
    defaultEnvironment: user?.preferences?.defaultEnvironment || '',
    defaultArea: user?.preferences?.defaultArea || ''
  });
  
  // Local state for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');
    
    try {
      setIsSubmitting(true);
      
      // Update user preferences
      const updatedPreferences = {
        defaultCountry: formData.defaultCountry,
        defaultClimate: formData.defaultClimate,
        defaultEnvironment: formData.defaultEnvironment,
        defaultArea: formData.defaultArea ? parseFloat(formData.defaultArea) : undefined
      };
      
      const response = await updateUserPreferences(updatedPreferences);
      
      // Update user data in context
      updateUserData(response.user);
      
      // Show success message
      setSuccessMessage('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      setFormError(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // If loading, show loading spinner
  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-state">
          <LoadingSpinner size="large" />
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }
  
  // If error, show error message
  if (error) {
    return (
      <div className="profile-container">
        <div className="error-state">
          <h2>Error Loading Profile</h2>
          <p>{error}</p>
          <button className="btn-primary" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Your Profile</h1>
        <p>Manage your account and preferences</p>
      </div>
      
      <div className="profile-content">
        <div className="profile-card">
          <h2>Account Information</h2>
          
          {formError && <div className="error-message">{formError}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}
          
          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Personal Details</h3>
              
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled
                />
                <small>Name cannot be changed</small>
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled
                />
                <small>Email cannot be changed</small>
              </div>
            </div>
            
            <div className="form-section">
              <h3>Default Preferences</h3>
              <p className="section-description">
                These preferences will be pre-filled when creating new forecasts
              </p>
              
              <div className="form-group">
                <label htmlFor="defaultCountry">Default Country</label>
                <select
                  id="defaultCountry"
                  name="defaultCountry"
                  value={formData.defaultCountry}
                  onChange={handleInputChange}
                >
                  <option value="">Select Country</option>
                  <option value="usa">United States</option>
                  <option value="canada">Canada</option>
                  <option value="uk">United Kingdom</option>
                  <option value="australia">Australia</option>
                  <option value="spain">Spain</option>
                  <option value="italy">Italy</option>
                  <option value="france">France</option>
                  <option value="germany">Germany</option>
                  <option value="mexico">Mexico</option>
                  <option value="japan">Japan</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="defaultClimate">Default Climate Zone</label>
                <select
                  id="defaultClimate"
                  name="defaultClimate"
                  value={formData.defaultClimate}
                  onChange={handleInputChange}
                >
                  <option value="">Select Climate Zone</option>
                  <option value="mediterranean">Mediterranean</option>
                  <option value="continental">Continental</option>
                  <option value="oceanic">Oceanic</option>
                  <option value="subtropical">Subtropical</option>
                  <option value="tropical">Tropical</option>
                  <option value="arid">Arid</option>
                  <option value="semiarid">Semi-Arid</option>
                  <option value="subarctic">Subarctic</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="defaultEnvironment">Default Growing Environment</label>
                <select
                  id="defaultEnvironment"
                  name="defaultEnvironment"
                  value={formData.defaultEnvironment}
                  onChange={handleInputChange}
                >
                  <option value="">Select Environment</option>
                  <option value="open">Open Field</option>
                  <option value="protected">Protected (Greenhouse/Polytunnel)</option>
                  <option value="cooled">Climate Controlled</option>
                  <option value="non-cooled">Non-Cooled Indoor</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="defaultArea">Default Growing Area (m²)</label>
                <input
                  type="number"
                  id="defaultArea"
                  name="defaultArea"
                  value={formData.defaultArea}
                  onChange={handleInputChange}
                  min="1"
                  max="1000"
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="small" color="white" />
                    <span>Saving...</span>
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
