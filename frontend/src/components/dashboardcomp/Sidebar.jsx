// src/components/dashboardcomp/Sidebar.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaShoppingBag, FaMapMarkerAlt, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../Auth/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navLinks = [
    { name: 'Overview', icon: <FaTachometerAlt />, path: '/dashboard' },
    { name: 'My Orders', icon: <FaShoppingBag />, path: '/dashboard/orders' },
    { name: 'My Addresses', icon: <FaMapMarkerAlt />, path: '/dashboard/addresses' },
    { name: 'My Profile', icon: <FaUser />, path: '/dashboard/profile' },
  ];

  const handleLogout = () => {
    if (logout) {
      logout();
      navigate('/login');
    } else {
      localStorage.removeItem('trendify_token');
      navigate('/login');
    }
  };

  return (
    <aside className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-gray-300 w-64 py-6 flex flex-col shadow-2xl border-r border-slate-700">
      {/* Header */}
      <div className="px-6 mb-8 relative">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <h1 className="text-white font-bold text-xl tracking-wide">Trendify</h1>
        </div>
        <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
      </div>

      {/* Navigation */}
      <nav className="flex-grow px-4 space-y-2">
        {navLinks.map((linkItem) => (
          <div key={linkItem.path}>
            <Link
              to={linkItem.path}
              className={`group flex items-center py-3 px-4 rounded-xl transition-all duration-300 w-full text-left relative overflow-hidden
                ${location.pathname === linkItem.path 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105' 
                  : 'hover:bg-slate-700/50 hover:text-white hover:transform hover:translate-x-1'
                }`}
            >
              {/* Active indicator */}
              {location.pathname === linkItem.path && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"></div>
              )}
              
              {/* Icon */}
              <span className={`mr-4 text-lg transition-transform duration-300 ${
                location.pathname === linkItem.path ? 'transform scale-110' : 'group-hover:scale-110'
              }`}>
                {linkItem.icon}
              </span>
              
              {/* Text */}
              <span className="font-medium tracking-wide">{linkItem.name}</span>
              
              {/* Hover effect background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            </Link>
          </div>
        ))}
      </nav>

      {/* Logout Section */}
      <div className="px-4 mt-auto">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent mb-4"></div>
        <button
          onClick={handleLogout}
          className="group flex items-center py-3 px-4 rounded-xl cursor-pointer hover:bg-red-600/20 hover:text-red-400 transition-all duration-300 w-full text-left relative overflow-hidden border border-slate-600/50 hover:border-red-500/50"
        >
          {/* Icon */}
          <FaSignOutAlt className="mr-4 text-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
          
          {/* Text */}
          <span className="font-medium tracking-wide">Logout</span>
          
          {/* Hover effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-red-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;