import React from 'react';
import { AuthProvider, useAuth } from './components/Auth/AuthContext';
import Header from './components/header';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/home';
import LoginPage from './pages/login';
import MensClothingPage from './pages/Menclothing';
import WomensClothingPage from './pages/Womenclothing';
import Footer from './components/footer';
import KidsClothingPage from './pages/KidsClothing';
import AccessoriesPage from './pages/Accessories';
import NewArrivalsPage from './pages/NewArrivals';
import CartPage from './pages/CartPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import WishlistPage from './pages/Wishlist';
import AddressSelectionPage from './pages/AddressSelectionPage';
import PaymentPage from './pages/payment.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

// --- NEW/ADJUSTED IMPORTS FOR DASHBOARD ---
import UserDashboardLayout from './Dashboard/UserDash.jsx'; // The new layout component
import DashboardOverviewPage from './Dashboard/DashboardPage.jsx'; // The content for the main dashboard overview
import MyAddressesPage from './pages/MyAddressesPage.jsx'; // Your existing addresses page
import MyOrdersPage from './pages/MyOrdersPage.jsx'; // Placeholder for orders page
import MyProfilePage from './pages/MyProfilePage.jsx'; // Placeholder for profile page
// --- END NEW IMPORTS ---

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="text-center p-8 text-lg text-gray-700">Loading...</div>;
    if (!user) return <Navigate to="/login" state={{ from: window.location.pathname }} replace />;
    return children;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <Header />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/men" element={<MensClothingPage />} />
                    <Route path="/women" element={<WomensClothingPage />} />
                    <Route path="/kids" element={<KidsClothingPage />} />
                    <Route path="/accessories" element={<AccessoriesPage />} />
                    <Route path="/new-arrivals" element={<NewArrivalsPage />} />
                    <Route path="/product/:id" element={<ProductDetailsPage />} />

                    {/* --- PROTECTED ROUTES (Non-Dashboard) --- */}
                    <Route
                        path="/cart"
                        element={
                            <ProtectedRoute>
                                <CartPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/wishlist" // Note: This is a top-level wishlist. Consider if you want /dashboard/wishlist.
                        element={
                            <ProtectedRoute>
                                <WishlistPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/checkout/address"
                        element={
                            <ProtectedRoute>
                                <AddressSelectionPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/checkout/payment"
                        element={
                            <ProtectedRoute>
                                <PaymentPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* --- User Dashboard and Nested Routes with Layout --- */}
                    {/* This route renders the UserDashboardLayout, which contains the Sidebar and an <Outlet /> */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <UserDashboardLayout />
                            </ProtectedRoute>
                        }
                    >
                        {/* The 'index' route renders when /dashboard is accessed directly */}
                        <Route index element={<DashboardOverviewPage />} /> {/* Your main dashboard view */}

                        {/* Nested routes for each dashboard section */}
                        <Route path="orders" element={<MyOrdersPage />} />
                        <Route path="addresses" element={<MyAddressesPage />} />
                        <Route path="profile" element={<MyProfilePage />} />
                        <Route path="help" element={<div>Help & Support Page Content - To be built</div>} />
                        <Route path="wishlist" element={<WishlistPage />} /> {/* Using the existing WishlistPage */}
                        <Route path="reviews" element={<div>My Reviews Page Content - To be built</div>} />
                    </Route>
                    {/* --- END User Dashboard Routes --- */}

                    {/* Catch-all for undefined routes */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
                <Footer />
            </AuthProvider>
        </Router>
    );
}

export default App;