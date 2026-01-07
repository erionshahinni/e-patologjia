// components/ResetPassword.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Key, RefreshCw, ArrowLeft, CheckCircle, Mail, Lock, Hash, AlertCircle } from 'lucide-react';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await resetPassword(
        formData.email,
        formData.code,
        formData.newPassword
      );
      
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setError(error.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Brown background */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-amber-950 via-amber-900 to-amber-950 items-center justify-center p-12">
        <div className="max-w-md">
          <div className="flex justify-center mb-8">
            <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl border-2 border-white/30">
              <Key className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            New Password
          </h1>
          <p className="text-xl text-white/90 leading-relaxed">
            Enter the reset code sent to your email and create a new secure password for your account
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
                  <Key className="h-8 w-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Reset Password
              </h2>
              <p className="text-sm text-gray-600">
                Enter the code and your new password
              </p>
            </div>

            {/* Desktop header */}
            <div className="hidden lg:block mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Reset your password
              </h2>
              <p className="text-sm text-gray-600">
                Enter the reset code and create your new password
              </p>
            </div>

            {success ? (
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Password Reset Successful!</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Your password has been reset successfully. You will be redirected to the login page shortly.
                  </p>
                  <Link
                    to="/login"
                    className="inline-flex justify-center items-center py-3 px-6 border border-transparent rounded-lg shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-[1.02]"
                  >
                    Go to Login
                  </Link>
                </div>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
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
                  <label htmlFor="code" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <Hash className="h-4 w-4 text-indigo-600 mr-2" />
                    Reset Code
                  </label>
                  <div className="mt-1">
                    <input
                      id="code"
                      name="code"
                      type="text"
                      required
                      value={formData.code}
                      onChange={handleChange}
                      placeholder="Enter 6-digit code"
                      className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all sm:text-sm"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="newPassword" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <Lock className="h-4 w-4 text-indigo-600 mr-2" />
                    New Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      required
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all sm:text-sm"
                      placeholder="Enter new password"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <Lock className="h-4 w-4 text-indigo-600 mr-2" />
                    Confirm New Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all sm:text-sm"
                      placeholder="Confirm new password"
                      disabled={loading}
                    />
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
                        Resetting Password...
                      </>
                    ) : (
                      <>
                        <Key className="h-5 w-5 mr-2" />
                        Reset Password
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {!success && (
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </Link>
                  
                  <Link
                    to="/forgot-password"
                    className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Request New Code
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;