// src/Dashboard/UserDash.jsx
import React from 'react';
import { Outlet } from 'react-router-dom'; // Essential for nested routes
import Sidebar from '../components/dashboardcomp/Sidebar'; // Path to your Sidebar

const UserDashboardLayout = () => {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar - Remains consistent across all dashboard sub-pages */}
      <div className="hidden md:flex w-64 bg-black text-gray-400 py-6 flex-shrink-0 shadow-md">
        <Sidebar />
      </div>

      {/* Main Content Area - This is where the specific dashboard pages (like DashboardPage or MyAddressesPage) will render */}
      <div className="flex-1 p-6">
        <Outlet /> {/* <-- This component renders the content of the currently matched nested route */}
      </div>
    </div>
  );
};

export default UserDashboardLayout;