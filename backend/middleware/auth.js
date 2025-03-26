// middleware/auth.js - Improved version with better error handling
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Get token from Authorization header 
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      console.log('No Authorization header found');
      return res.status(401).json({ message: 'Authentication required. No auth header.' });
    }
    
    // Extract token - handle both "Bearer token" and just "token" formats
    const token = authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : authHeader;
    
    if (!token) {
      console.log('No token found in Authorization header');
      return res.status(401).json({ message: 'Authentication required. No token found.' });
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token verified successfully for user ID:', decoded.userId);
      
      // Find user to confirm they exist
      const user = await User.findById(decoded.userId);
      if (!user) {
        console.log('User not found with ID:', decoded.userId);
        return res.status(401).json({ message: 'User not found' });
      }

      // Set user info on request object
      req.user = decoded;
      req.token = token;
      next();
    } catch (jwtError) {
      console.log('JWT verification failed:', jwtError.message);
      return res.status(401).json({ message: 'Invalid or expired token. Please log in again.' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Server error in authentication' });
  }
};

// New middleware to check if email is verified
const verifiedOnly = async (req, res, next) => {
  try {
    if (!req.user || !req.user.isVerified) {
      return res.status(403).json({ 
        message: 'Email verification required', 
        verified: false 
      });
    }
    next();
  } catch (error) {
    console.error('Email verification check error:', error);
    res.status(500).json({ message: 'Server error checking verification status' });
  }
};

module.exports = { auth, verifiedOnly };