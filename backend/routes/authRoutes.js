// routes/authRoutes.js - Add PIN reset routes
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// Check if pinController exists and if not, create a placeholder
let pinController;
try {
  pinController = require('../controllers/pinController');
} catch (error) {
  console.warn("PIN controller not found, creating placeholder");
  pinController = {
    requestPinReset: (req, res) => res.status(501).json({ message: 'PIN reset not implemented' }),
    resetPin: (req, res) => res.status(501).json({ message: 'PIN reset not implemented' })
  };
}

// Check if all controller functions exist before defining routes
const ensureAllFunctions = () => {
  const requiredFunctions = [
    'register', 'login', 'verifyEmail', 'resendVerificationCode', 
    'forgotPassword', 'resetPassword', 'getProfile', 'updateProfile', 
    'logout', 'setPin', 'verifyPin'
  ];
  
  for (const fn of requiredFunctions) {
    if (typeof authController[fn] !== 'function') {
      console.error(`Missing or invalid controller function: ${fn}`);
      return false;
    }
  }
  return true;
};

// Only define routes if all functions are available
if (ensureAllFunctions()) {
  // Public routes
  router.post('/register', authController.register);
  router.post('/login', authController.login);
  router.post('/verify-email', authController.verifyEmail);
  router.post('/resend-verification', authController.resendVerificationCode);
  router.post('/forgot-password', authController.forgotPassword);
  router.post('/reset-password', authController.resetPassword);

  // PIN management routes
  router.post('/request-pin-reset', pinController.requestPinReset);
  router.post('/reset-pin', pinController.resetPin);

  // Protected routes
  router.get('/profile', auth, authController.getProfile);
  router.patch('/profile', auth, authController.updateProfile);
  router.post('/logout', auth, authController.logout);

  // PIN management (admin only)
  router.post('/set-pin', auth, authController.setPin);
  router.post('/verify-pin', auth, authController.verifyPin);
} else {
  console.error('Some controller functions are missing. Routes not configured correctly.');
}

module.exports = router;