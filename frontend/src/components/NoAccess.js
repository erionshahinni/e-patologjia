// components/NoAccess.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

const NoAccess = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex flex-col items-center">
          <div className="h-24 w-24 rounded-full bg-red-100 flex items-center justify-center mb-6">
            <ShieldAlert className="h-12 w-12 text-red-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Unauthorized Access
          </h2>
          
          <p className="text-gray-600 mb-8">
            You don't have permission to access this resource.
            Please contact an administrator if you believe this is an error.
          </p>

          <div className="border-t border-gray-200 pt-8">
            <p className="text-sm text-gray-500 mb-4">
              You can try logging out and signing in with a different account,
              or return to the dashboard.
            </p>
            
            <div className="flex space-x-4 justify-center">
              <button
                onClick={handleBackToDashboard}
                className="inline-flex items-center px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to Dashboard
              </button>
              
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoAccess;