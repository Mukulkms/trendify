// src/layouts/SuperAdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const SuperAdminLayout = () => (
  <div className="bg-gray-100 min-h-screen">
    <Outlet />
  </div>
);

export default SuperAdminLayout;
