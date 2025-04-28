/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid, false if invalid
 */
export const isValidEmail = (email) => {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
  };
  
  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {Object} Validation result and message
   */
  export const validatePassword = (password) => {
    if (!password || password.length < 6) {
      return { 
        valid: false, 
        message: 'Password must be at least 6 characters' 
      };
    }
    
    return { valid: true };
  };
  
  /**
   * Validate forecast parameters
   * @param {Object} params - Forecast parameters
   * @returns {Object} Validation result and errors
   */
  export const validateForecastParams = (params) => {
    const errors = {};
    
    if (!params.climate) {
      errors.climate = 'Climate zone is required';
    }
    
    if (!params.environment) {
      errors.environment = 'Growing environment is required';
    }
    
    if (!params.area || params.area <= 0) {
      errors.area = 'Valid growing area is required';
    }
    
    if (!params.crops || params.crops.length === 0) {
      errors.crops = 'At least one crop must be selected';
    }
    
    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  };
  
  /**
   * Format error messages from API responses
   * @param {Object} error - Error object from API call
   * @returns {string} Formatted error message
   */
  export const formatApiError = (error) => {
    if (error.response && error.response.data) {
      if (error.response.data.message) {
        return error.response.data.message;
      }
      if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
        return error.response.data.errors.join(', ');
      }
    }
    
    return error.message || 'An unexpected error occurred';
  };