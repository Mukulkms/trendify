// src/components/dashboardcomp/QuickLinkCard.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link

const QuickLinkCard = ({ link }) => {
    // Determine if the link should be clickable (has a path and is not explicitly disabled)
    const isClickable = link.path && typeof link.path === 'string' && !link.disabled;

    // The common visual content of the card
    const cardContent = (
        <div className={`bg-white rounded-md shadow-sm p-6 text-center 
                        ${isClickable ? 'hover:shadow-md transition-shadow duration-200 cursor-pointer' : ''}`}>
            <div className="text-blue-500 text-3xl mb-2">{link.icon}</div>
            <h3 className="font-semibold text-gray-800 mb-1">{link.title}</h3>
            <p className="text-gray-600 text-sm">{link.description}</p>
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
            <div className={`cursor-not-allowed opacity-50`}>
                {cardContent}
            </div>
        )
    );
};

export default QuickLinkCard;