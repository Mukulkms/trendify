import { AuthProvider } from './components/Auth/AuthContext';
import Header from './components/header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home';
import LoginPage from './pages/login';
import MenClothingPage from './pages/Menclothing';
import Womenclothing from './pages/Womenclothing';
import Footer from './components/footer';
import KidsClothing from './pages/KidsClothing';
import Accessories from './pages/Accessories';
import NewArrivals from './pages/NewArrivals';
import CartPage from './pages/CartPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import WishlistPage from './pages/Wishlist';
import UserDash from './Dashboard/UserDash'
function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/men" element={<MenClothingPage />} />
          <Route path="/women" element={<Womenclothing />} />
          <Route path="/kids" element={<KidsClothing />} />
          <Route path="/accessories" element={<Accessories />} />
          <Route path="/new-arrival" element={<NewArrivals />} />
          <Route path="/add-to-cart" element={<CartPage/>} />
          <Route path="/product/:id" element={<ProductDetailsPage/>} />
          <Route path='/my-wishlist' element={<WishlistPage/>}/>
          <Route path='/my-account' element={<UserDash/>}/>
        </Routes>
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;