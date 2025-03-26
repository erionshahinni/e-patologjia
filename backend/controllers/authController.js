// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Import specialized email services
const { 
  verificationEmailService, 
  passwordResetEmailService 
} = require('../services/email');

const generateVerificationCode = () => {
  // Generate a 6-digit code
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate reset code
const generateResetCode = () => {
  // Generate a 6-digit code
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Forgot password function
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      // For security reasons, don't reveal if user exists
      return res.json({ message: 'If an account with that email exists, we have sent a password reset code' });
    }
    
    // Generate reset code
    const resetCode = generateResetCode();
    const resetCodeExpires = new Date();
    resetCodeExpires.setMinutes(resetCodeExpires.getMinutes() + 10); // Code expires in 10 minutes
    
    // Save code to user
    user.resetPasswordCode = resetCode;
    user.resetPasswordCodeExpires = resetCodeExpires;
    await user.save();
    
    // Send email with reset code using the password reset email service
    const emailSent = await passwordResetEmailService.sendPasswordResetEmail(email, resetCode);
    
    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send password reset email' });
    }
    
    res.json({ message: 'Password reset code sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Error processing request' });
  }
};

// Reset password function
const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    
    console.log(`Password reset attempt for email: ${email}`);
    
    // Basic validation
    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: 'Email, verification code, and new password are required' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    
    // Find user with matching email and reset code that hasn't expired
    const user = await User.findOne({ 
      email,
      resetPasswordCode: code,
      resetPasswordCodeExpires: { $gt: new Date() }
    });
    
    if (!user) {
      console.log('Invalid or expired reset code for email:', email);
      return res.status(400).json({ message: 'Invalid or expired reset code' });
    }
    
    console.log('Valid reset code for user:', user._id);
    
    // Set new password - the User model will hash it in the pre-save hook
    user.password = newPassword;
    
    // Clear reset code fields
    user.resetPasswordCode = undefined;
    user.resetPasswordCodeExpires = undefined;
    
    await user.save();
    console.log('Password successfully reset for user:', user._id);
    
    // Generate a new token for the user so they can log in immediately
    const token = jwt.sign(
      { userId: user._id, role: user.role, isVerified: user.isVerified },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Return user information and token so frontend can automatically log them in
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.json({ 
      message: 'Password reset successful. You can now log in with your new password.',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log('Register attempt:', { username, email });

    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    // Count existing users to determine role
    const userCount = await User.countDocuments();
    console.log('Current user count:', userCount);
    
    // Set role based on count - first two users are admins, rest are guests
    const role = userCount < 2 ? 'admin' : 'guest';
    console.log(`Assigning role '${role}' to new user`);

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const verificationCodeExpires = new Date();
    verificationCodeExpires.setMinutes(verificationCodeExpires.getMinutes() + 10); // Code expires in 10 minutes

    // Create user (password will be hashed by the pre-save hook)
    const user = await User.create({
      username,
      email,
      password, // No need to hash here, the model will do it
      role, // Assign the determined role instead of hardcoding 'guest'
      isVerified: false,
      verificationCode,
      verificationCodeExpires
    });
    console.log('User created successfully:', email, 'with role:', role);

    // Send verification email using the verification email service
    const emailSent = await verificationEmailService.sendVerificationEmail(email, verificationCode);
    if (!emailSent) {
      console.error('Failed to send verification email to:', email);
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role, isVerified: user.isVerified },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    console.log('Token generated successfully');

    // Remove sensitive information from response
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.verificationCode;
    delete userResponse.verificationCodeExpires;

    res.status(201).json({
      user: userResponse,
      token,
      message: 'Registration successful. Please verify your email.'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ 
      message: error.message || 'Error registering user'
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('No user found with email:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    console.log('User found:', email);

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password comparison result:', isMatch);

    if (!isMatch) {
      console.log('Password does not match for user:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role, isVerified: user.isVerified },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    console.log('Token generated successfully for user:', email);

    // Remove sensitive data from response
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.verificationCode;
    delete userResponse.verificationCodeExpires;
    delete userResponse.resetPasswordCode;
    delete userResponse.resetPasswordCodeExpires;
    delete userResponse.pinResetCode;
    delete userResponse.pinResetCodeExpires;

    res.json({
      user: userResponse,
      token,
      message: user.isVerified ? 'Login successful' : 'Please verify your email'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: error.message || 'Error logging in'
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    // Check if verification code is valid and not expired
    if (user.verificationCode !== code) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    if (user.verificationCodeExpires < new Date()) {
      return res.status(400).json({ message: 'Verification code expired' });
    }

    // Mark user as verified
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    // Generate a new token with updated verification status
    const token = jwt.sign(
      { userId: user._id, role: user.role, isVerified: true },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      message: 'Email verified successfully',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ 
      message: error.message || 'Error verifying email'
    });
  }
};

const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode();
    const verificationCodeExpires = new Date();
    verificationCodeExpires.setMinutes(verificationCodeExpires.getMinutes() + 10);

    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;
    await user.save();

    // Send verification email
    const emailSent = await verificationEmailService.sendVerificationEmail(email, verificationCode);
    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send verification email' });
    }

    res.json({ message: 'Verification code sent successfully' });
  } catch (error) {
    console.error('Resend verification code error:', error);
    res.status(500).json({ 
      message: error.message || 'Error sending verification code'
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password -verificationCode -verificationCodeExpires');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching profile',
      error: error.message 
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['username', 'email', 'password'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    updates.forEach(update => {
      user[update] = req.body[update];
    });
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.verificationCode;
    delete userResponse.verificationCodeExpires;

    res.json(userResponse);
  } catch (error) {
    res.status(400).json({ 
      message: 'Error updating profile',
      error: error.message 
    });
  }
};

const logout = async (req, res) => {
  try {
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error logging out',
      error: error.message 
    });
  }
};

// Set PIN for admin users
const setPin = async (req, res) => {
  try {
    const { pin } = req.body;
    
    // Only admin users can set a PIN
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can set a PIN' });
    }

    // Validate PIN (4-digit number)
    if (!/^\d{4}$/.test(pin)) {
      return res.status(400).json({ message: 'PIN must be a 4-digit number' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.pin = pin;
    await user.save();

    res.json({ message: 'PIN set successfully' });
  } catch (error) {
    console.error('Set PIN error:', error);
    res.status(500).json({ 
      message: error.message || 'Error setting PIN'
    });
  }
};

// Verify PIN for admin operations
const verifyPin = async (req, res) => {
  try {
    const { pin } = req.body;
    
    if (!pin) {
      console.log('No PIN provided in request');
      return res.status(400).json({ message: 'PIN is required' });
    }

    if (pin.length !== 4 || !/^\d+$/.test(pin)) {
      console.log('Invalid PIN format');
      return res.status(400).json({ message: 'PIN must be a 4-digit number' });
    }
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(`Verifying PIN for user: ${user.username}, role: ${user.role}`);

    // Admin users should have their own PIN
    if (user.role === 'admin') {
      if (!user.pin) {
        console.log('No PIN set for this admin user');
        return res.status(400).json({ message: 'No PIN set for this admin user. Please set a PIN in Admin Panel → Security Settings.' });
      }

      const isPinValid = await bcrypt.compare(pin, user.pin);
      console.log(`PIN validation result: ${isPinValid}`);
      
      if (!isPinValid) {
        return res.status(401).json({ message: 'Invalid PIN' });
      }

      return res.json({ valid: true });
    }
    
    // For non-admin users, check if there's any admin PIN set in the system
    console.log('Non-admin user, checking against global admin PIN');
    const adminUser = await User.findOne({ role: 'admin' }).sort({ createdAt: 1 });
    
    if (!adminUser || !adminUser.pin) {
      console.log('No admin PIN found in the system');
      return res.status(400).json({ message: 'No admin PIN set in the system' });
    }

    const isPinValid = await bcrypt.compare(pin, adminUser.pin);
    console.log(`Global PIN validation result: ${isPinValid}`);
    
    if (!isPinValid) {
      return res.status(401).json({ message: 'Invalid PIN' });
    }

    res.json({ valid: true });
  } catch (error) {
    console.error('Verify PIN error:', error);
    res.status(500).json({ 
      message: error.message || 'Error verifying PIN'
    });
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  resendVerificationCode,
  forgotPassword,
  resetPassword, 
  getProfile,
  updateProfile,
  logout,
  setPin,
  verifyPin
};