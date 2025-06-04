import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaShoppingCart, FaBox, FaUsers, FaTag, FaDollarSign, FaChartBar, FaCog, FaQuestionCircle } from 'react-icons/fa';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { CgProfile } from 'react-icons/cg';
import DashboardOverview from './components/DashboardOverview';
import SuperAdminHeader from '../components/SuperAdminHeader';
import { useAuth2 } from '../super-admin/AuthContext2';

export default function Dashboard() {
  const { user, logout, loading } = useAuth2();
  const navigate = useNavigate();

  // Check authentication status on mount
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p>Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <SuperAdminHeader />
      {/* Super Admin Dashboard Header */}
      <header className="bg-white p-4 shadow-md flex items-center justify-between z-10">
        <h1 className="text-2xl font-bold text-gray-800">
          Hi, {user ? user.fullname : 'Guest'}
        </h1>
        <div className="flex items-center space-x-6">
          <IoMdNotificationsOutline className="w-6 h-6 text-gray-500 cursor-pointer hover:text-gray-700" />
          <div className="flex items-center cursor-pointer">
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {user ? user.fullname : 'Guest'}
              </p>
              <p className="text-xs text-gray-500">{user ? user.role : 'N/A'}</p>
            </div>
            <CgProfile className="w-5 h-5 text-gray-500 ml-2" />
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Left Sidebar */}
        <aside className="w-64 bg-white p-6 shadow-md overflow-y-auto">
          <h3 className="text-gray-500 mb-4 uppercase text-xs font-semibold tracking-wider">Menu</h3>
          <ul className="space-y-2">
            <li className="flex items-center p-3 rounded-lg bg-blue-100 text-blue-700 font-semibold cursor-pointer transition-colors duration-200">
              <FaHome className="w-5 h-5 mr-3" />
              Dashboard
            </li>
            <li className="flex items-center p-3 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors duration-200">
              <FaShoppingCart className="w-5 h-5 mr-3" />
              Orders <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">3</span>
            </li>
            <li className="flex items-center p-3 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors duration-200">
              <FaBox className="w-5 h-5 mr-3" />
              Products
            </li>
            <li className="flex items-center p-3 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors duration-200">
              <FaUsers className="w-5 h-5 mr-3" />
              User Management
            </li>
            <li className="flex items-center p-3 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors duration-200">
              <FaTag className="w-5 h-5 mr-3" />
              Category
            </li>
            <li className="flex items-center p-3 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors duration-200">
              <FaDollarSign className="w-5 h-5 mr-3" />
              Subscription
            </li>
            <li className="flex items-center p-3 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors duration-200">
              <FaChartBar className="w-5 h-5 mr-3" />
              Discount
            </li>
          </ul>

          <h3 className="text-gray-500 mt-6 mb-4 uppercase text-xs font-semibold tracking-wider">Support</h3>
          <ul className="space-y-2">
            <li className="flex items-center p-3 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors duration-200">
              <FaCog className="w-5 h-5 mr-3" />
              Settings
            </li>
            <li className="flex items-center p-3 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors duration-200">
              <FaQuestionCircle className="w-5 h-5 mr-3" />
              Get Help
            </li>
          </ul>
        </aside>
        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          <DashboardOverview />
        </main>
      </div>
    </div>
  );
}