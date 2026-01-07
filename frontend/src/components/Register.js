// components/Register.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RefreshCw, UserPlus, User, Mail, Lock, AlertCircle } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    setLoading(true);
  
    try {
      const { confirmPassword, ...registrationData } = formData;
      console.log('Submitting registration data');
      
      // Register the user - this will automatically redirect to the verification page
      await register(registrationData);
      
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register');
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Brown background */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-amber-950 via-amber-900 to-amber-950 items-center justify-center p-12">
        <div className="max-w-md">
          <div className="flex justify-center mb-8">
            <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl border-2 border-white/30">
              <UserPlus className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Join Us Today
          </h1>
          <p className="text-xl text-white/90 leading-relaxed">
            Create your account and start using ePatologjia
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
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                  <UserPlus className="h-8 w-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Create Account
              </h2>
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-purple-600 hover:text-purple-500 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>

            {/* Desktop header */}
            <div className="hidden lg:block mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Sign Up
              </h2>
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-purple-600 hover:text-purple-500 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="username" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <User className="h-4 w-4 text-purple-600 mr-2" />
                  Username
                </label>
                <div className="mt-1">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all sm:text-sm"
                    placeholder="Choose a username"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Mail className="h-4 w-4 text-purple-600 mr-2" />
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all sm:text-sm"
                    placeholder="Enter your email"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Lock className="h-4 w-4 text-purple-600 mr-2" />
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all sm:text-sm"
                    placeholder="Create a password"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Lock className="h-4 w-4 text-purple-600 mr-2" />
                  Confirm Password
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all sm:text-sm"
                    placeholder="Confirm your password"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="animate-spin h-5 w-5 mr-2" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-5 w-5 mr-2" />
                      Create account
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

export default Register;
