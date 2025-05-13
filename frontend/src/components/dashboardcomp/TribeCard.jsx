import React from 'react';
import { FaShippingFast, FaClock, FaHeadset } from 'react-icons/fa';

const TribeCard = ({ tribe }) => {
  return (
    <div className="bg-white  text-center rounded-md shadow-sm p-6 w-full">
      <h2 className="font-semibold  text-3xl text-gray-800 mb-2">{tribe.title}</h2>
      <p className="text-gray-600 mb-4">{tribe.subtitle}</p>
      <div className="flex gap-4 mb-4 justify-center items-center">
        <div className="flex flex-col items-center ">
          <FaShippingFast className="text-green-500 text-xl mb-1" />
          <span className="text-sm text-gray-700">{tribe.benefits[0]}</span>
        </div>
        <div className="flex flex-col items-center">
          <FaClock className="text-green-500 text-xl mb-1" />
          <span className="text-sm text-gray-700">{tribe.benefits[1]}</span>
        </div>
        <div className="flex flex-col items-center">
          <FaHeadset className="text-green-500 text-xl mb-1" />
          <span className="text-sm text-gray-700">{tribe.benefits[2]}</span>
        </div>
      </div>
      <button className="bg-green-500 hover:bg-green-700 text-white text-xl py-3 px-6 rounded-md w-full flex items-center justify-center">
        <FaHeadset className="mr-2" /> Get Trendify Membership
      </button>
    </div>
  );
};

export default TribeCard;