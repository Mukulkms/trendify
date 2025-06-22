import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/Auth/AuthContext';
import { AuthProvider2, useAuth2 } from './super-admin/AuthContext2';

// // Import ToastContainer and toastify CSS
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// Layouts
import MainLayout from './layouts/MainLayout';
import SuperAdminLayout from './layouts/SuperAdminLayout';

// Main Pages
import HomePage from './pages/home';
import LoginPage from './pages/login';
import MensClothingPage from './pages/Menclothing';
import WomensClothingPage from './pages/Womenclothing';
import KidsClothingPage from './pages/KidsClothing';
import AccessoriesPage from './pages/Accessories';
import NewArrivalsPage from './pages/NewArrivals';
import CartPage from './pages/CartPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import WishlistPage from './pages/Wishlist';
import AddressSelectionPage from './pages/AddressSelectionPage';
import PaymentPage from './pages/payment.jsx';

import NotFoundPage from './pages/NotFoundPage.jsx';

// Dashboard Pages
import UserDashboardLayout from './Dashboard/UserDash.jsx';
import DashboardOverviewPage from './Dashboard/DashboardPage.jsx';
import MyAddressesPage from './pages/MyAddressesPage.jsx';
import MyOrdersPage from './pages/MyOrdersPage.jsx';
import MyProfilePage from './pages/MyProfilePage.jsx';

// Super Admin
import SuperAdminRegister from './super-admin/pages/register';
import SuperAdminLogin from './super-admin/pages/login';
import AdminDash from './super-admin/AdminDash.jsx';
import DashboardLayout from './super-admin/layouts/DashboardLayout.jsx';
import Users from './super-admin/components/UserManagement';
import SuperAdminProducts from './super-admin/pages/SuperAdminProducts.jsx';
import SuperAdminOrders from './super-admin/pages/SuperAdminOrdersPage.jsx'; // Corrected filename case if needed
import OrderConfirmation from './pages/order-confirmation.jsx';
import OrderHistory from './components/orderHistory';
import CategoryManagement from './super-admin/pages/CategoryManagement.jsx';
// Protected Routes
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-center p-8 text-lg text-gray-700">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const ProtectedRoute2 = ({ children }) => {
  const { user, loading } = useAuth2();
  if (loading) return <div className="text-center p-8 text-lg text-gray-700">Loading...</div>;
  if (!user) return <Navigate to="/superadmin/login" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AuthProvider2>
          <Routes>

            {/* Main Site with Header + Footer */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/men" element={<MensClothingPage />} />
              <Route path="/women" element={<WomensClothingPage />} />
              <Route path="/kids" element={<KidsClothingPage />} />
              <Route path="/accessories" element={<AccessoriesPage />} />
              <Route path="/new-arrivals" element={<NewArrivalsPage />} />
              <Route path="/product/:id" element={<ProductDetailsPage />} />
              <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
              <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
              <Route path="/checkout/address" element={<ProtectedRoute><AddressSelectionPage /></ProtectedRoute>} />
              <Route path="/checkout/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
              <Route path ="/order-confirmation" element = {<OrderConfirmation/>}/>
              <Route path ="/my-orders" element = {<OrderHistory/>}/>

              {/* User Dashboard Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><UserDashboardLayout /></ProtectedRoute>}>
                <Route index element={<DashboardOverviewPage />} />
                <Route path="orders" element={<OrderHistory/>} />
                <Route path="addresses" element={<MyAddressesPage />} />
                <Route path="profile" element={<MyProfilePage />} />
                <Route path="wishlist" element={<WishlistPage />} />
                <Route path="help" element={<div>Help & Support</div>} />
                <Route path="reviews" element={<div>My Reviews</div>} />
              </Route>
            </Route>

            {/* Superadmin Pages without Header/Footer */}
            <Route element={<SuperAdminLayout />}>
              <Route path="/superadmin/register" element={<SuperAdminRegister />} />
              <Route path="/superadmin/login" element={<SuperAdminLogin />} />
            </Route>

            {/* Superadmin Dashboard layout with Sidebar/Header */}
            <Route path="/superadmin" element={
              <ProtectedRoute2>
                <DashboardLayout />
              </ProtectedRoute2>
            }>
              <Route path="dashboard" element={<AdminDash />} />
              <Route path="orders" element={<SuperAdminOrders />} /> 
              <Route path="products" element={<SuperAdminProducts />} />
              <Route path="users" element={<Users/>} />
              <Route path="categories" element={<CategoryManagement/>} />
              {/* Add more routes here */}
            </Route>
            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider2>
      </AuthProvider>
    </Router>
  );
}

export default App;