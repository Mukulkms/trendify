// src/components/dashboardcomp/Sidebar.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Import Link, useLocation, useNavigate
import { FaTachometerAlt, FaShoppingBag, FaMapMarkerAlt, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../Auth/AuthContext'; // Import useAuth if your AuthContext handles logout

const Sidebar = () => {
  const location = useLocation(); // Hook to get current path for active styling
  const navigate = useNavigate();
  const { logout } = useAuth(); // Assuming your AuthContext provides a logout function

  const navLinks = [
    { name: 'Overview', icon: <FaTachometerAlt />, path: '/dashboard' },
    { name: 'My Orders', icon: <FaShoppingBag />, path: '/dashboard/orders' },
    { name: 'My Addresses', icon: <FaMapMarkerAlt />, path: '/dashboard/addresses' },
    { name: 'My Profile', icon: <FaUser />, path: '/dashboard/profile' },
  ];

  const handleLogout = () => {
    if (logout) {
      logout(); // Call logout from AuthContext
      navigate('/login'); // Redirect to login page after logout
    } else {
      // Fallback if logout not provided by AuthContext
      localStorage.removeItem('trendify_token');
      navigate('/login');
    }
  };

  return (
    <aside className="bg-slate-900 text-gray-400 w-64 py-6 flex flex-col shadow-md">
      <div className="px-6 mb-8">
        <h1 className="text-white font-bold text-xl">Trendify</h1>
      </div>
      <nav className="flex-grow">
        {navLinks.map((linkItem) => (
          <div key={linkItem.path} className="mb-4 px-2">
            <Link
              to={linkItem.path}
              className={`flex items-center py-3 px-4 rounded transition-colors w-full text-left
                ${location.pathname === linkItem.path ? 'bg-gray-700 text-white' : 'hover:bg-gray-800 hover:text-white'}`}
            >
              {linkItem.icon && <span className="mr-4">{linkItem.icon}</span>}
              <span>{linkItem.name}</span>
            </Link>
          </div>
        ))}
      </nav>
      {/* Logout Button */}
      <div className="px-2 mt-auto"> {/* 'mt-auto' pushes it to the bottom */}
        <button
          onClick={handleLogout}
          className="flex items-center py-3 px-4 rounded cursor-pointer hover:bg-gray-800 hover:text-white border-t border-gray-700 w-full text-left"
        >
          <FaSignOutAlt className="mr-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;