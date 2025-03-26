// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    const error = { ...err };
    error.message = err.message;
  
    // Log error for debugging
    console.error(err);
  
    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
      error.message = 'Resource not found';
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
  
    // Mongoose duplicate key
    if (err.code === 11000) {
      error.message = 'Duplicate field value entered';
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
  
    // Mongoose validation error
    if (err.name === 'ValidationError') {
      error.message = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
  
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
      error.message = 'Invalid token. Please log in again';
      return res.status(401).json({
        success: false,
        error: error.message
      });
    }
  
    if (err.name === 'TokenExpiredError') {
      error.message = 'Token expired. Please log in again';
      return res.status(401).json({
        success: false,
        error: error.message
      });
    }
  
    // Default error
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Server Error'
    });
  };
  
  module.exports = errorHandler;