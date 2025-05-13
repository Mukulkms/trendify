import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-48">
      <FaSpinner className="animate-spin text-blue-500 text-4xl" />
      <span className="ml-2">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;