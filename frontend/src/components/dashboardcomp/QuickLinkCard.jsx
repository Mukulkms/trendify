import React from 'react';

const QuickLinkCard = ({ link }) => {
  return (
    <div className={`bg-white rounded-md shadow-sm p-6 text-center cursor-pointer hover:shadow-md transition-shadow duration-200 ${link.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <div className="text-blue-500 text-3xl mb-2">{link.icon}</div>
      <h3 className="font-semibold text-gray-800 mb-1">{link.title}</h3>
      <p className="text-gray-600 text-sm">{link.description}</p>
    </div>
  );
};

export default QuickLinkCard;