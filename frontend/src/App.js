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
import UserDashboard from './Dashboard/UserDash.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

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
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <WishlistPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <UserDashboard />
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
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;