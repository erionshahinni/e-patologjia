// components/VerifyEmail.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, CheckCircle, AlertCircle, RefreshCw, ShieldCheck } from 'lucide-react';

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyEmail, resendVerificationCode, user } = useAuth();
  
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);

  // Initialize email from location state or user object
  useEffect(() => {
    console.log('VerifyEmail component mounted', { locationState: location.state, user });
    
    if (location.state?.email) {
      setEmail(location.state.email);
      
      // If coming from login and needs resend, automatically trigger resend
      if (location.state.needsResend) {
        handleResendCode();
      }
    } else if (user?.email) {
      setEmail(user.email);
    }
    
    // If user is already verified, redirect to dashboard
    if (user?.isVerified) {
      navigate('/', { replace: true });
    }
  }, [location, user, navigate]);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!verificationCode) {
      setError('Verification code is required');
      return;
    }
    
    setLoading(true);
    
    try {
      await verifyEmail(email, verificationCode);
      setSuccess('Email verified successfully! Redirecting to dashboard...');
      
      // Redirect to dashboard after successful verification
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 2000);
    } catch (error) {
      setError(error.message || 'Failed to verify email');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    setSuccess('');
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    setResendLoading(true);
    
    try {
      await resendVerificationCode(email);
      setSuccess('Verification code resent successfully!');
      setCountdown(60); // Start 60-second countdown
    } catch (error) {
      setError(error.message || 'Failed to resend verification code');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Brown background */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-amber-950 via-amber-900 to-amber-950 items-center justify-center p-12">
        <div className="max-w-md">
          <div className="flex justify-center mb-8">
            <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl border-2 border-white/30">
              <ShieldCheck className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Verify Your Email
          </h1>
          <p className="text-xl text-white/90 leading-relaxed">
            We've sent a verification code to your email. Please enter it below to verify your account.
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
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <Mail className="h-8 w-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Verify Your Email
              </h2>
              <p className="text-sm text-gray-600">
                We've sent a verification code to your email
              </p>
            </div>

            {/* Desktop header */}
            <div className="hidden lg:block mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Email Verification
              </h2>
              <p className="text-sm text-gray-600">
                Enter the code sent to your email address
              </p>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-lg flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm text-green-700">{success}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleVerify}>
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
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all sm:text-sm"
                    placeholder="Enter your email"
                    disabled={loading || resendLoading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="verificationCode" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <ShieldCheck className="h-4 w-4 text-indigo-600 mr-2" />
                  Verification Code
                </label>
                <div className="mt-1">
                  <input
                    id="verificationCode"
                    name="verificationCode"
                    type="text"
                    required
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all sm:text-sm"
                    disabled={loading || resendLoading}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={resendLoading || countdown > 0 || loading}
                    className="font-medium text-indigo-600 hover:text-indigo-500 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center transition-colors"
                  >
                    {resendLoading ? (
                      <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    {countdown > 0 ? `Resend code (${countdown}s)` : 'Resend code'}
                  </button>
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
                      Verifying...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-5 w-5 mr-2" />
                      Verify Email
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Back to login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;