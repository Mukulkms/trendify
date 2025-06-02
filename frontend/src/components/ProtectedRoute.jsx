// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles }) {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  if (!token || !user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/super-admin/login" replace />;
  }

  return children;
}
