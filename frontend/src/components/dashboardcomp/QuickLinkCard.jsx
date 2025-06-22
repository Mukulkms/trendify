// src/components/dashboardcomp/QuickLinkCard.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link

const QuickLinkCard = ({ link }) => {
    // Determine if the link should be clickable (has a path and is not explicitly disabled)
    const isClickable = link.path && typeof link.path === 'string' && !link.disabled;

    // The common visual content of the card
    const cardContent = (
        <div className={`bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-100 p-8 text-center relative overflow-hidden group
                         ${isClickable ? 'hover:shadow-2xl hover:border-blue-200 transform hover:scale-105 transition-all duration-300 cursor-pointer' : ''}`}>
            
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-20 transform translate-x-8 -translate-y-8"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-indigo-100 to-blue-100 rounded-full opacity-20 transform -translate-x-6 translate-y-6"></div>
            
            {/* Icon container */}
            <div className={`relative bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-4xl mb-6 mx-auto w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg
                           ${isClickable ? 'group-hover:from-blue-600 group-hover:to-indigo-700 group-hover:shadow-xl group-hover:scale-110 transition-all duration-300' : ''}`}>
                {link.icon}
            </div>
            
            {/* Content */}
            <div className="relative z-10">
                <h3 className="font-bold text-xl text-gray-800 mb-3 leading-tight">{link.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed font-medium">{link.description}</p>
            </div>
            
            {/* Hover indicator */}
            {isClickable && (
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        isClickable ? (
            // If clickable, wrap in Link
            <Link to={link.path} className="block no-underline">
                {cardContent}
            </Link>
        ) : (
            // If not clickable, render as a plain div with disabled styling
            <div className="cursor-not-allowed opacity-60">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl shadow-md border border-gray-200 p-8 text-center relative overflow-hidden">
                    {/* Disabled state decorations */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gray-300 rounded-full opacity-10 transform translate-x-8 -translate-y-8"></div>
                    
                    {/* Disabled icon container */}
                    <div className="bg-gray-400 text-gray-600 text-4xl mb-6 mx-auto w-20 h-20 rounded-2xl flex items-center justify-center shadow-md">
                        {link.icon}
                    </div>
                    
                    {/* Disabled content */}
                    <div>
                        <h3 className="font-bold text-xl text-gray-500 mb-3 leading-tight">{link.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed font-medium">{link.description}</p>
                    </div>
                    
                    {/* Disabled indicator */}
                    <div className="absolute top-4 right-4">
                        <div className="bg-gray-400 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default QuickLinkCard;