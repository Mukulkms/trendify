// src/pages/MyProfilePage.jsx
import React from 'react';

const MyProfilePage = () => {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">My Profile</h2>
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-gray-600">Profile details will go here.</p>
        {/* Add actual profile form/details here */}
      </div>
    </div>
  );
};

export default MyProfilePage;