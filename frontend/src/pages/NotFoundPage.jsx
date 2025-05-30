import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">404 - Page Not Found</h2>
      <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
      <button
        onClick={() => navigate('/')}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md"
      >
        Go to Homepage
      </button>
    </div>
  );
};

export default NotFoundPage;