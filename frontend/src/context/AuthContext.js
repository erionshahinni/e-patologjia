// context/AuthContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

// Constants
const TOKEN_KEY = 'token';
const USER_KEY = 'user';
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const navigate = useNavigate();

  // Function to check if token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);

        if (token && storedUser && !isTokenExpired(token)) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear storage but don't trigger navigation
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Auto logout timer - only start when user is logged in
  useEffect(() => {
    if (!user) return;

    const checkActivity = () => {
      const now = Date.now();
      if (now - lastActivity >= INACTIVITY_TIMEOUT) {
        logout(true); // Force logout on inactivity
      }
    };

    const activityTimer = setInterval(checkActivity, 60000);
    
    // Reset timer on user activity
    const updateActivity = () => {
      setLastActivity(Date.now());
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => document.addEventListener(event, updateActivity));

    return () => {
      clearInterval(activityTimer);
      events.forEach(event => document.removeEventListener(event, updateActivity));
    };
  }, [user, lastActivity]);

  const register = async (userData) => {
    setError(null);
    setLoading(true);

    try {
      console.log('Registering user:', userData);
      const response = await authAPI.register(userData);
      
      if (!response.token || !response.user) {
        throw new Error('Invalid response from server: missing token or user data');
      }

      // Store auth data
      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));

      // Update state
      setUser(response.user);
      
      console.log('Redirecting to verification page');
      // Force redirect to verification page
      navigate('/verify-email', { 
        state: { email: userData.email },
        replace: true 
      });
      
      return response.user;
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setError(null);
    setLoading(true);

    try {
      const response = await authAPI.login({ email, password });
      
      if (!response.token || !response.user) {
        throw new Error('Invalid response from server: missing token or user data');
      }

      // Store auth data
      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));

      // Update state
      setUser(response.user);
      
      // If user is not verified, redirect to verification page
      if (!response.user.isVerified) {
        console.log('User not verified, redirecting to verification page');
        navigate('/verify-email', { 
          state: { email, needsResend: true },
          replace: true 
        });
        return null;
      }
      
      return response.user;
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (email, code) => {
    setError(null);
    setLoading(true);

    try {
      const response = await authAPI.verifyEmail({ email, code });
      
      if (!response.token || !response.user) {
        throw new Error('Invalid response from server');
      }

      // Update the stored token and user info after verification
      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));

      // Update state
      setUser(response.user);
      
      return response;
    } catch (error) {
      console.error('Email verification error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationCode = async (email) => {
    setError(null);
    setLoading(true);

    try {
      const response = await authAPI.resendVerificationCode(email);
      return response;
    } catch (error) {
      console.error('Resend verification code error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    setError(null);
    setLoading(true);

    try {
      const response = await authAPI.forgotPassword(email);
      return response;
    } catch (error) {
      console.error('Forgot password error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email, code, newPassword) => {
    setError(null);
    setLoading(true);
  
    try {
      const response = await authAPI.resetPassword(email, code, newPassword);
      
      // If the response includes a token and user data, update the auth state
      if (response.token && response.user) {
        console.log('Setting user data after password reset');
        setUser(response.user);
      }
      
      return response;
    } catch (error) {
      console.error('Reset password error in context:', error);
      setError(error.message || 'Failed to reset password');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const setPin = async (pin) => {
    setError(null);
    setLoading(true);

    try {
      const response = await authAPI.setPin(pin);
      return response;
    } catch (error) {
      console.error('Set PIN error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyPin = async (pin) => {
    setError(null);
    setLoading(true);

    try {
      const response = await authAPI.verifyPin(pin);
      return response;
    } catch (error) {
      console.error('Verify PIN error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(async (shouldRedirect = true) => {
    try {
      // Only attempt API logout if we have a token
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        await authAPI.logout().catch(console.error);
      }
    } finally {
      // Clear storage
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      
      // Reset state
      setUser(null);
      setError(null);

      // Only navigate if explicitly requested and not already on login page
      if (shouldRedirect && window.location.pathname !== '/login') {
        navigate('/login', { replace: true });
      }
    }
  }, [navigate]);

  const value = {
    user,
    loading,
    error,
    login,
    register,
    verifyEmail,
    resendVerificationCode,
    forgotPassword,
    resetPassword,
    setPin,
    verifyPin,
    logout,
    isAuthenticated: !!user,
    isVerified: user?.isVerified || false,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;