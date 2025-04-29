/**
 * Input validation middleware for Express
 */
const validator = require('validator');

/**
 * Validate registration input
 */
const validateRegisterInput = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = {};
  
  // Validate name
  if (!name) {
    errors.name = 'Name is required';
  } else if (name.length < 2 || name.length > 50) {
    errors.name = 'Name must be between 2 and 50 characters';
  }
  
  // Validate email
  if (!email) {
    errors.email = 'Email is required';
  } else if (!validator.isEmail(email)) {
    errors.email = 'Email is invalid';
  }
  
  // Validate password
  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  } else if (!validator.isStrongPassword(password, { 
    minLength: 6, 
    minLowercase: 1, 
    minUppercase: 0, 
    minNumbers: 1, 
    minSymbols: 0 
  })) {
    errors.password = 'Password must contain at least one letter and one number';
  }
  
  // Return errors if any
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }
  
  next();
};

/**
 * Validate login input
 */
const validateLoginInput = (req, res, next) => {
  const { email, password } = req.body;
  const errors = {};
  
  // Validate email
  if (!email) {
    errors.email = 'Email is required';
  } else if (!validator.isEmail(email)) {
    errors.email = 'Email is invalid';
  }
  
  // Validate password
  if (!password) {
    errors.password = 'Password is required';
  }
  
  // Return errors if any
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }
  
  next();
};

/**
 * Validate preferences input
 */
const validatePreferencesInput = (req, res, next) => {
  const { defaultArea } = req.body;
  const errors = {};
  
  // Validate area if provided
  if (defaultArea !== undefined && (!validator.isNumeric(defaultArea.toString()) || defaultArea <= 0)) {
    errors.defaultArea = 'Area must be a positive number';
  }
  
  // Return errors if any
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }
  
  next();
};

module.exports = {
  validateRegisterInput,
  validateLoginInput,
  validatePreferencesInput
};
