// components/HomeRedirect.js
import React from 'react';
import { useAuth } from '../context/AuthContext';
import LandingPage from './LandingPage';

const HomeRedirect = () => {
  const { loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Always show landing page, regardless of authentication status
  return <LandingPage />;
};

export default HomeRedirect;
