import React, { useState, useEffect } from 'react';
import { Shield, Lock, ArrowLeft, Home } from 'lucide-react';

// Forbidden Page Component
const ForbiddenPage = () => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-800 to-red-900 px-8 py-6 text-center">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Access Forbidden</h1>
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Shield className="w-10 h-10 text-red-500" />
          </div>
          
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Admin Access Required
          </h2>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            You don't have permission to access this page. This area is restricted to administrators only.
          </p>
          
          <div className="space-y-4">
            <button
              onClick={handleGoHome}
              className="w-full bg-black to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-[rgb(113,127,223)] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Go to Home
            </button>
            
            <button
              onClick={handleGoBack}
              className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-[rgb(113,127,223)] hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 text-center">
          <p className="text-sm text-gray-500">
            Need admin access? Contact your system administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

// Loading Component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">Verifying admin access...</p>
    </div>
  </div>
);

// Main Protected Admin Route Component
const ProtectedAdminRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null); // null = loading, true = admin, false = not admin
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const response = await fetch('http://localhost:3000/user/admin-check', {
        method: 'GET',
        credentials: 'include', // Include cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsAdmin(data.isAdmin);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking admin status
  if (loading) {
    return <LoadingSpinner />;
  }

  // Show forbidden page if not admin
  if (!isAdmin) {
    return <ForbiddenPage />;
  }

  // Render the protected content if admin
  return <>{children}</>;
};

export default ProtectedAdminRoute;