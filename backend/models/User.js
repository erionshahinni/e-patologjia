// models/User.js - Add PIN reset fields
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'doctor', 'guest'],
    default: 'admin'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  resetPasswordCode: {
    type: String
  },
  resetPasswordCodeExpires: {
    type: Date
  },
  verificationCode: {
    type: String
  },
  verificationCodeExpires: {
    type: Date
  },
  pin: {
    type: String,
    default: null
  },
  pinResetCode: {
    type: String
  },
  pinResetCodeExpires: {
    type: Date
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  const user = this;
  
  try {
    // Only hash the password if it has been modified
    if (user.isModified('password')) {
      console.log('Password modified, hashing...');
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      console.log('Password hashed successfully in pre-save hook');
    }
    
    // Hash PIN if it's modified
    if (user.isModified('pin') && user.pin) {
      console.log('Pin modified, hashing...');
      const salt = await bcrypt.genSalt(8);
      user.pin = await bcrypt.hash(user.pin, salt);
      console.log('Pin hashed successfully in pre-save hook');
    }
    
    next();
  } catch (error) {
    console.error('Error in User model pre-save hook:', error);
    next(error);
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;