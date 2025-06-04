import React, { useEffect, useState } from 'react'; // Import useState
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth2 } from '../AuthContext2';
import SuperAdminHeader from '../../components/SuperAdminHeader'; // This component likely contains the search, notifications, and profile info
import Sidebar from '../components/sidebar';
import { IoMdMenu } from 'react-icons/io'; // Import the hamburger menu icon

const DashboardLayout = () => {
  const { user, logout, loading } = useAuth2();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to manage sidebar visibility

  // Authentication check and redirection
  useEffect(() => {
    if (!loading && !user) {
      navigate('/superadmin/login');
    }
  }, [user, loading, navigate]);

  // Loading state handler
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center p-8 text-lg font-semibold text-gray-700 bg-white rounded-lg shadow-md">
          Checking authentication...
        </div>
      </div>
    );
  }

  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Function to close sidebar (useful when navigating or clicking outside)
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <SuperAdminHeader />

      <header className="bg-white p-4 shadow-md flex items-center justify-between z-10">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="lg:hidden mr-4 text-gray-600 hover:text-gray-900 focus:outline-none"
            aria-label="Open menu"
          >
            <IoMdMenu className="w-8 h-8" /> {/* Hamburger icon */}
          </button>
          <h1 className="text-xl font-bold text-indigo-600">Hi, {user?.fullname}</h1>
        </div>
        <button
          onClick={() => {
            logout();
            navigate('/superadmin/login');
          }}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
        >
          Logout
        </button>
      </header>

      <div className="flex flex-1"> {/* Removed padding from here */}
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        <main className="flex-1 p-4 overflow-y-auto ">
          <Outlet /> {/* Renders the nested routes here */}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;