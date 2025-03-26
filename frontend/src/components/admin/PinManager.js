// components/admin/PinManager.js - Updated with reset option
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter
} from '../ui/card';
import { Key, RefreshCw, ShieldAlert, Check, Lock, AlertCircle } from 'lucide-react';
import Button from '../ui/button';

const PinManager = ({ isPinConfigured, onPinUpdated }) => {
  const { user, setPin } = useAuth();
  const [pin, setLocalPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Only admin users can set a PIN
  if (user?.role !== 'admin') {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-500" />
            Not Authorized
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Only admin users can manage deletion PINs.</p>
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // PIN validation
    if (pin !== confirmPin) {
      setError('PINs do not match');
      return;
    }

    if (pin.length !== 4 || !/^\d+$/.test(pin)) {
      setError('PIN must be a 4-digit number');
      return;
    }

    setLoading(true);
    try {
      await setPin(pin);
      setSuccess('PIN set successfully! You can now use this PIN for sensitive operations like deleting records.');
      setLocalPin('');
      setConfirmPin('');
      if (onPinUpdated) onPinUpdated();
    } catch (error) {
      setError(error.message || 'Failed to set PIN');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5 text-blue-500" />
          Admin Deletion PIN
        </CardTitle>
        <CardDescription>
          {isPinConfigured 
            ? "Update your secure 4-digit PIN that is required to delete patients or reports." 
            : "Create a secure 4-digit PIN that will be required to delete patients or reports."}
        </CardDescription>
      </CardHeader>

      <CardContent>
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

        {isPinConfigured && (
          <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded relative flex items-center">
            <Check className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>PIN is currently configured. You can set a new PIN or reset it if forgotten.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="pin" className="block text-sm font-medium text-gray-700">
              4-Digit PIN
            </label>
            <div className="mt-1 relative">
              <input
                id="pin"
                name="pin"
                type="password"
                inputMode="numeric"
                maxLength={4}
                pattern="[0-9]*"
                required
                value={pin}
                onChange={(e) => setLocalPin(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                disabled={loading}
                placeholder="Enter 4-digit PIN"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Key className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPin" className="block text-sm font-medium text-gray-700">
              Confirm PIN
            </label>
            <div className="mt-1 relative">
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
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Key className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <RefreshCw className="animate-spin -ml-1 mr-3 h-5 w-5" />
                Setting PIN...
              </div>
            ) : (
              isPinConfigured ? 'Update PIN' : 'Set PIN'
            )}
          </Button>
        </form>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-3">
            {isPinConfigured 
              ? "Forgot your PIN or need to reset it?"
              : "If you need to reset your PIN later, you can use the reset option:"}
          </p>
          <Link 
            to="/reset-pin" 
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors"
          >
            <Lock className="h-4 w-4" />
            Reset Your PIN via Email
          </Link>
        </div>
      </CardContent>

      <CardFooter className="text-sm text-gray-500 px-6 py-4">
        <p>
          This PIN will be required when deleting patients or reports. Keep it secure and don't share it with unauthorized users.
        </p>
      </CardFooter>
    </Card>
  );
};

export default PinManager;