// components/Login.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RefreshCw, LogIn, Mail, Lock, AlertCircle, WifiOff } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, loading: authLoading, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isServerUnreachable, setIsServerUnreachable] = useState(false);

  // Only redirect if user is logged in and we're on the login page
  useEffect(() => {
    if (user && user.isVerified && location.pathname === '/login') {
      const redirect = location.state?.from || '/dashboard';
      navigate(redirect, { replace: true });
    } else if (user && !user.isVerified && location.pathname === '/login') {
      // If user is logged in but not verified, redirect to verification page
      navigate('/verify-email', { state: { email: user.email, needsResend: true } });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent multiple submissions
    
    setError('');
    setIsServerUnreachable(false);
    setLoading(true);
  
    try {
      // Basic validation
      if (!formData.email || !formData.password) {
        setError('Email and password are required');
        setLoading(false);
        return;
      }
  
      console.log('Attempting login with email:', formData.email);
  
      // The login function will handle redirecting unverified users
      await login(formData.email, formData.password);
      // Navigation is handled by the useEffect above
    } catch (err) {
      console.error('Login error:', err);
      
      if (err.message?.includes('Network error') || err.message?.includes('not reachable')) {
        setIsServerUnreachable(true);
      } else if (err.message?.includes('Invalid credentials')) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError(err.message || 'Failed to login. Please try again.');
      }
      
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Show any auth context errors
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  // Don't render the form while initial auth loading is happening
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Brown background */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-amber-950 via-amber-900 to-amber-950 items-center justify-center p-12">
        <div className="max-w-md">
          <div className="flex justify-center mb-8">
            <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl border-2 border-white/30">
              <LogIn className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Welcome Back
          </h1>
          <p className="text-xl text-white/90 leading-relaxed">
            Sign in to access ePatologjia
          </p>
        </div>
      </div>

      {/* Right side - White form box */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 sm:p-10">
            {/* Mobile header */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <LogIn className="h-8 w-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-sm text-gray-600">
                Sign in to your account or{' '}
                <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                  create a new account
                </Link>
              </p>
            </div>

            {/* Desktop header */}
            <div className="hidden lg:block mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Sign In
              </h2>
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                  Sign up
                </Link>
              </p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {isServerUnreachable && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                  <div className="flex items-start">
                    <WifiOff className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-sm text-yellow-700">
                      Unable to reach the server. Please check your internet connection and make sure the backend service is running.
                    </p>
                  </div>
                </div>
              )}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="email" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Mail className="h-4 w-4 text-indigo-600 mr-2" />
                  Email address 
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all sm:text-sm"
                    placeholder="Enter your email"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Lock className="h-4 w-4 text-indigo-600 mr-2" />
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all sm:text-sm"
                    placeholder="Enter your password"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="animate-spin h-5 w-5 mr-2" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <LogIn className="h-5 w-5 mr-2" />
                      Sign in
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;