const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authRateLimiter } = require('../middleware/rateLimiter');
const {
  validateRegisterInput,
  validateLoginInput,
  validatePreferencesInput
} = require('../middleware/validator');
const {
  register,
  login,
  getMe,
  logout,
  updatePreferences
} = require('../controllers/authController');

// Apply middleware to authentication endpoints
router.post('/register', authRateLimiter, validateRegisterInput, register);
router.post('/login', authRateLimiter, validateLoginInput, login);
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);
router.put('/preferences', protect, validatePreferencesInput, updatePreferences);

module.exports = router;