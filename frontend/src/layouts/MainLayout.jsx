// src/layouts/MainLayout.jsx
import Header from '../components/header';
import Footer from '../components/footer';
import { Outlet } from 'react-router-dom';

const MainLayout = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
  </>
);

export default MainLayout;
