// components/admin/PinResetForm.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { Key, RefreshCw, AlertCircle, Check, ArrowLeft, Mail } from 'lucide-react';

const PinResetForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('request'); // 'request', 'verify', 'success'
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [debug, setDebug] = useState(''); // Debug info for development

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setDebug('');
    setLoading(true);

    if (!email) {
      setError('Please enter your admin email address');
      setLoading(false);
      return;
    }

    try {
      // Log request details for debugging
      console.log('Requesting PIN reset for email:', email);
      setDebug(`Sending request for email: ${email}`);
      
      const response = await authAPI.requestPinReset(email);
      console.log('PIN reset response:', response);
      setSuccess('If your email is registered as an admin, a reset code has been sent.');
      setStep('verify');
      
      // Debug message - remove in production
      setDebug(`Reset code should be sent to ${email}. Check your email inbox and spam folder.`);
    } catch (error) {
      console.error('Error requesting PIN reset:', error);
      setError(error.message || 'Failed to request PIN reset. Please try again.');
      setDebug(`Error: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPin = async (e) => {
    e.preventDefault();
    setError('');
    setDebug('');

    // PIN validation
    if (newPin !== confirmPin) {
      setError('PINs do not match');
      return;
    }

    if (newPin.length !== 4 || !/^\d+$/.test(newPin)) {
      setError('PIN must be a 4-digit number');
      return;
    }

    setLoading(true);
    try {
      console.log('Resetting PIN with code:', code);
      setDebug(`Submitting PIN reset with code: ${code} for email: ${email}`);
      
      await authAPI.resetPin(email, code, newPin);
      setSuccess('PIN reset successfully!');
      setStep('success');
    } catch (error) {
      console.error('Error resetting PIN:', error);
      setError(error.message || 'Failed to reset PIN. Please check your code and try again.');
      setDebug(`Error: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
            {step === 'request' ? (
              <Mail className="h-8 w-8 text-blue-600" />
            ) : step === 'verify' ? (
              <Key className="h-8 w-8 text-blue-600" />
            ) : (
              <Check className="h-8 w-8 text-green-600" />
            )}
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset Admin PIN
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {step === 'request' && 'Request a PIN reset code sent to your email.'}
          {step === 'verify' && 'Enter the verification code and set your new PIN.'}
          {step === 'success' && 'Your PIN has been reset successfully.'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative flex items-center">
              <Check className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {debug && process.env.NODE_ENV !== 'production' && (
            <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded relative text-sm">
              <strong>Debug info:</strong> {debug}
            </div>
          )}

          {step === 'request' && (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Admin Email Address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    disabled={loading}
                    placeholder="Enter your admin email"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <RefreshCw className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Sending Request...
                  </div>
                ) : (
                  'Request PIN Reset'
                )}
              </button>
            </form>
          )}

          {step === 'verify' && (
            <form onSubmit={handleResetPin} className="space-y-4">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                  Verification Code
                </label>
                <div className="mt-1 relative">
                  <input
                    id="code"
                    name="code"
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    disabled={loading}
                    placeholder="Enter 6-digit code"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-purple-600">
                    PIN Reset
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Check your email inbox for a message with the subject "Your EPATOLOGJIA Admin PIN Reset Code"
                </p>
              </div>

              <div>
                <label htmlFor="newPin" className="block text-sm font-medium text-gray-700">
                  New 4-Digit PIN
                </label>
                <div className="mt-1">
                  <input
                    id="newPin"
                    name="newPin"
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    pattern="[0-9]*"
                    required
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    disabled={loading}
                    placeholder="Enter 4-digit PIN"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPin" className="block text-sm font-medium text-gray-700">
                  Confirm PIN
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPin"
                    name="confirmPin"
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    pattern="[0-9]*"
                    required
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    disabled={loading}
                    placeholder="Confirm 4-digit PIN"
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep('request');
                    setSuccess('');
                  }}
                  className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  Back
                </button>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <RefreshCw className="animate-spin -ml-1 mr-3 h-5 w-5" />
                      Resetting PIN...
                    </div>
                  ) : (
                    'Reset PIN'
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center py-4">
              <div className="h-16 w-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-lg font-medium text-gray-900 mb-2">PIN Reset Complete!</p>
              <p className="text-sm text-gray-500 mb-4">
                Your administrative PIN has been reset successfully. You can now use it for sensitive operations.
              </p>
              <button
                onClick={() => navigate('/admin')}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go to Admin Panel
              </button>
            </div>
          )}

          {step !== 'success' && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to="/admin"
                  className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Admin Panel
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PinResetForm;