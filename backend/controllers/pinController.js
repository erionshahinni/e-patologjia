// controllers/pinController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Import the specialized pin reset email service
const { pinResetEmailService } = require('../services/email');

// Generate a 6-digit reset code
const generateResetCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Request PIN reset (similar to forgot password)
exports.requestPinReset = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    console.log(`Processing PIN reset request for email: ${email}`);
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      // For security reasons, don't reveal if user exists
      console.log(`No user found with email: ${email}`);
      return res.json({ message: 'If an account with that email exists, we have sent a PIN reset code' });
    }
    
    // Verify user is an admin
    if (user.role !== 'admin') {
      console.log(`User with email ${email} is not an admin (role: ${user.role})`);
      return res.json({ message: 'If an account with that email exists, we have sent a PIN reset code' });
    }
    
    // Generate reset code
    const resetCode = generateResetCode();
    const resetCodeExpires = new Date();
    resetCodeExpires.setMinutes(resetCodeExpires.getMinutes() + 30); // Code expires in 30 minutes
    
    console.log(`Generated reset code for ${email}: ${resetCode}, expires: ${resetCodeExpires}`);
    
    // Save code to user
    user.pinResetCode = resetCode;
    user.pinResetCodeExpires = resetCodeExpires;
    await user.save();
    
    // Send email with reset code using the specialized pin reset email service
    console.log(`Preparing to send PIN reset code email to ${email}`);
    const emailSent = await pinResetEmailService.sendPinResetEmail(email, resetCode);
    
    if (!emailSent) {
      console.error(`Failed to send PIN reset email to ${email}`);
      return res.status(500).json({ message: 'Failed to send PIN reset email. Please try again later.' });
    }
    
    console.log(`PIN reset code successfully sent to ${email}`);
    res.json({ message: 'PIN reset code sent to your email' });
  } catch (error) {
    console.error('PIN reset request error:', error);
    res.status(500).json({ message: 'Error processing request. Please try again later.' });
  }
};

// Reset PIN with verification code
exports.resetPin = async (req, res) => {
  try {
    const { email, code, newPin } = req.body;
    
    if (!email || !code || !newPin) {
      return res.status(400).json({ message: 'Email, code, and new PIN are required' });
    }
    
    console.log(`Processing PIN reset for email: ${email} with code: ${code}`);
    
    // Validate PIN format
    if (!newPin || newPin.length !== 4 || !/^\d+$/.test(newPin)) {
      return res.status(400).json({ message: 'PIN must be a 4-digit number' });
    }
    
    // Find user with matching email and reset code
    const user = await User.findOne({ 
      email,
      pinResetCode: code,
      pinResetCodeExpires: { $gt: new Date() }
    });
    
    if (!user) {
      console.log(`Invalid or expired reset code for email: ${email}`);
      return res.status(400).json({ message: 'Invalid or expired reset code' });
    }
    
    // Verify user is an admin
    if (user.role !== 'admin') {
      console.log(`User with email ${email} is not an admin`);
      return res.status(403).json({ message: 'Only admin users can set a PIN' });
    }
    
    console.log(`Valid reset code for user: ${user._id}, setting new PIN`);
    
    // Set new PIN
    user.pin = newPin;
    
    // Clear reset code
    user.pinResetCode = undefined;
    user.pinResetCodeExpires = undefined;
    
    await user.save();
    
    console.log(`PIN successfully reset for user: ${user._id}`);
    res.json({ message: 'PIN reset successful. You can now use your new PIN for administrative operations.' });
  } catch (error) {
    console.error('Reset PIN error:', error);
    res.status(500).json({ message: 'Error resetting PIN. Please try again later.' });
  }
};