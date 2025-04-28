const User = require('../models/User');

/**
 * Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already in use'
      });
    }
    
    // Create user
    const user = await User.create({
      name,
      email,
      password
    });
    
    // Create token
    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

/**
 * Log in user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password'
      });
    }
    
    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Create token
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

/**
 * Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Log user out / clear cookie
 * @route   GET /api/auth/logout
 * @access  Private
 */
exports.logout = async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {}
  });
};

/**
 * Update user preferences
 * @route   PUT /api/auth/preferences
 * @access  Private
 */
exports.updatePreferences = async (req, res, next) => {
  try {
    const { defaultCountry, defaultRegion, defaultClimate, defaultEnvironment, defaultArea, preferredCrops } = req.body;
    
    const updates = {
      preferences: {
        defaultCountry,
        defaultRegion,
        defaultClimate,
        defaultEnvironment, 
        defaultArea,
        preferredCrops
      }
    };
    
    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Helper to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();
  
  const userData = {
    id: user._id,
    name: user.name,
    email: user.email,
    preferences: user.preferences,
    roles: user.roles
  };
  
  res.status(statusCode).json({
    success: true,
    token,
    user: userData
  });
};