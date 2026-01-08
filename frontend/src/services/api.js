// /services/api.js - COMPLETE UPDATED VERSION
import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle rate limiting errors (429)
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'] || 15;
      const message = `Shumë kërkesa! Ju lutem prisni ${retryAfter} sekonda para se të provoni përsëri.`;
      console.warn('Rate limit exceeded:', {
        url: error.config?.url,
        retryAfter,
        message
      });
      return Promise.reject(new Error(message));
    }

    // Don't redirect on PIN verification errors or patient deletion errors
    if (error.response?.status === 401) {
      const isPinRelatedRequest = 
        error.config?.url?.includes('/auth/verify-pin') || 
        (error.config?.url?.includes('/patients/') && error.config?.method === 'delete');
      
      if (!isPinRelatedRequest) {
        console.log('Authentication error - redirecting to login');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(new Error('Session expired. Please login again.'));
      }
    }
    
    // Enhanced error logging with more detail
    console.error("API Error Details:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.response?.data?.message || error.message,
      request: error.config?.data ? JSON.parse(JSON.stringify(error.config.data)) : null
    });
    
    // If there's a response from the server, use its message
    if (error.response?.data?.message) {
      return Promise.reject(new Error(error.response.data.message));
    }
    
    // Network errors or timeouts
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timed out. Please try again.'));
    }
    
    // For all other errors
    return Promise.reject(new Error(error.message || 'An unexpected error occurred'));
  }
);

// Add request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request data for debugging
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, 
      config.data ? JSON.parse(JSON.stringify(config.data)) : null);
    
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (credentials) => {
    try {
      const response = await api.post('/auth/register', credentials);
      return response;
    } catch (error) {
      console.error('Registration API error:', error);
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  },

  verifyEmail: async (data) => {
    try {
      const response = await api.post('/auth/verify-email', data);
      return response;
    } catch (error) {
      console.error('Email verification API error:', error);
      throw error;
    }
  },

  resendVerificationCode: async (email) => {
    try {
      const response = await api.post('/auth/resend-verification', { email });
      return response;
    } catch (error) {
      console.error('Resend verification API error:', error);
      throw error;
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response;
    } catch (error) {
      console.error('Forgot password API error:', error);
      throw error;
    }
  },

  resetPassword: async (email, code, newPassword) => {
    try {
      console.log('Calling reset password API');
      const response = await api.post('/auth/reset-password', {
        email,
        code,
        newPassword
      });
      
      console.log('Reset password API response:', response);
      
      // If the server returns a token, store it for automatic login
      if (response.token && response.user) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      console.error('Reset password API error:', error);
      throw error;
    }
  },


  setPin: async (pin) => {
    try {
      const response = await api.post('/auth/set-pin', { pin });
      return response;
    } catch (error) {
      console.error('Set PIN API error:', error);
      throw error;
    }
  },

  verifyPin: async (pin) => {
    try {
      const response = await api.post('/auth/verify-pin', { pin });
      return response;
    } catch (error) {
      console.error('Verify PIN API error:', error);
      throw error;
    }
  },
  
  // New PIN reset functions
  requestPinReset: async (email) => {
    try {
      const response = await api.post('/auth/request-pin-reset', { email });
      return response;
    } catch (error) {
      console.error('Request PIN reset API error:', error);
      throw error;
    }
  },
  
  resetPin: async (email, code, newPin) => {
    try {
      const response = await api.post('/auth/reset-pin', { 
        email, 
        code, 
        newPin 
      });
      return response;
    } catch (error) {
      console.error('Reset PIN API error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout API error:', error);
      throw error;
    }
  }
};

// Patient endpoints
export const getPatients = () => api.get('/patients');
export const getPatientById = (id) => api.get(`/patients/${id}`);
export const createPatient = (patientData) => api.post('/patients', patientData);
export const updatePatient = (id, patientData) => api.put(`/patients/${id}`, patientData);
// Fix the frontend API service deletePatient function in services/api.js

export const deletePatient = (id, pin) => {
  console.log(`Attempting to delete patient with ID: ${id}, PIN provided: ${pin ? 'Yes' : 'No'}`);
  
  if (!pin) {
    return Promise.reject(new Error('PIN is required for deletion'));
  }
  
  // Include timeout to handle long-running operations
  return api.delete(`/patients/${id}`, { 
    data: { pin },
    timeout: 10000 // 10-second timeout
  }).catch(error => {
    console.error('Delete patient request failed:', error);
    
    // Enhanced error handling with detailed information
    const errorMessage = error.response?.data?.message || error.message || 'Error deleting patient';
    console.error('Error details:', {
      status: error.response?.status,
      message: errorMessage,
      error: error
    });
    
    // Create a new error with the message from the server if available
    throw new Error(errorMessage);
  });
};

// Report endpoints
export const getReports = () => api.get('/reports');
export const getReportById = (id) => api.get(`/reports/${id}`);
export const getReportsByPatientId = (patientId) => api.get(`/reports/patient/${patientId}`);
export const createReport = (reportData) => {
  console.log('Creating report with data:', reportData);
  return api.post('/reports', reportData);
};

export const updateReport = (id, reportData) => {
  console.log('Updating report with ID:', id, 'and data:', reportData);
  
  // Create a copy of the report data to modify
  const updatedData = { ...reportData };
  
  // If we're changing payment status, add tracking info
  if (updatedData.originalReport) {
    // Check if payment status changed
    if (updatedData.paymentStatus !== updatedData.originalReport.paymentStatus) {
      // Keep track of previous status
      updatedData.previousPaymentStatus = updatedData.originalReport.paymentStatus;
      updatedData.statusChangedAt = new Date().toISOString();
      
      console.log('Payment status change detected:', {
        from: updatedData.originalReport.paymentStatus,
        to: updatedData.paymentStatus,
        timestamp: updatedData.statusChangedAt
      });
    }
    
    // Remove the originalReport property before sending to API
    delete updatedData.originalReport;
  }
  
  return api.put(`/reports/${id}`, updatedData);
};

// Update the deleteReport function in api.js
export const deleteReport = (id, pin) => {
  console.log(`Attempting to delete report with ID: ${id}`);
  
  if (!pin) {
    return Promise.reject(new Error('PIN is required for deletion'));
  }
  
  // Include longer timeout to handle potential slow operations
  return api.delete(`/reports/${id}`, { 
    data: { pin },
    timeout: 30000 // 30-second timeout instead of 10 seconds
  }).catch(error => {
    console.error('Delete report request failed:', error);
    
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timed out. The server is taking too long to respond. Please try again.'));
    }
    
    // Enhanced error handling with detailed information
    const errorMessage = error.response?.data?.message || error.message || 'Error deleting report';
    console.error('Error details:', {
      status: error.response?.status,
      message: errorMessage,
      error: error
    });
    
    // Create a new error with the message from the server if available
    throw new Error(errorMessage);
  });
};

// Send report via email with PDF attachment
export const sendReportEmail = async (reportId, email, pdfBlob, filename, includeLogos) => {
  try {
    // Convert blob to base64
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Remove data:application/pdf;base64, prefix
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(pdfBlob);
    });

    const response = await api.post(`/reports/${reportId}/send-email`, {
      email,
      pdfBase64: base64,
      filename,
      includeLogos
    });
    
    return response;
  } catch (error) {
    console.error('Send report email API error:', error);
    throw error;
  }
};

// Open Outlook with email and PDF attachment
export const openOutlookWithAttachment = async (reportId, email, pdfBlob, filename, includeLogos) => {
  try {
    // Convert blob to base64
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Remove data:application/pdf;base64, prefix
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(pdfBlob);
    });

    const response = await api.post(`/reports/${reportId}/open-outlook`, {
      email,
      pdfBase64: base64,
      filename,
      includeLogos
    });
    
    return response;
  } catch (error) {
    console.error('Open Outlook API error:', error);
    throw error;
  }
};

// Template endpoints
export const getTemplates = () => api.get('/templates');
export const getTemplateById = (id) => api.get(`/templates/${id}`);
export const createTemplate = (templateData) => api.post('/templates', templateData);
export const updateTemplate = (id, templateData) => api.put(`/templates/${id}`, templateData);
export const deleteTemplate = (id) => api.delete(`/templates/${id}`);

// Updated admin endpoints
export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  updateUserRole: (userId, role) => api.patch(`/admin/users/${userId}/role`, { role }),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  checkPinStatus: async () => {
    try {
      const response = await api.get('/admin/pin-status');
      return response;
    } catch (error) {
      // If the endpoint doesn't exist yet in your backend, handle it gracefully
      console.error('Error checking PIN status:', error);
      
      // Default to false if the endpoint isn't implemented yet
      if (error.response?.status === 404) {
        return { isConfigured: false };
      }
      throw error;
    }
  }
};

export default api;