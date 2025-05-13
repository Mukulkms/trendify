import React, { Suspense, lazy, useContext } from 'react';
import Sidebar from '../components/dashboardcomp/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaShoppingBag, FaWallet, FaMapMarkerAlt, FaUser, FaHeadset, FaHeart, FaStar } from 'react-icons/fa';
import { AuthContext } from '../components/Auth/AuthContext';

const UserCard = lazy(() => import('../components/dashboardcomp/UserCard'));
const TribeCard = lazy(() => import('../components/dashboardcomp/TribeCard'));
const QuickLinkCard = lazy(() => import('../components/dashboardcomp/QuickLinkCard')); // Corrected import name

const DashboardPage = () => {
  const { user } = useContext(AuthContext);

  const tribeData = {
    title: 'Trendify',
    subtitle: 'Upgrade to the premium experience now',
    benefits: ['Free Shipping', 'Early Access', 'VIP Support'],
  };

  const quickLinksData = [
    { icon: <FaShoppingBag />, title: 'My Orders', description: 'View, Modify And Track Orders' },
    { icon: <FaWallet />, title: 'My Payments', description: 'View And Modify Payment Methods' },
    { icon: <FaWallet />, title: 'My Wallet', description: 'Wallet History And Redeemed Gift Cards' },
    { icon: <FaMapMarkerAlt />, title: 'My Addresses', description: 'Edit, Add Or Remove Addresses' },
    { icon: <FaUser />, title: 'My Profile', description: 'Edit Personal Info And Change Password' },
    { icon: <FaHeadset />, title: 'Help & Support', description: 'Reach Out To Us' },
    { icon: <FaHeart />, title: 'My Wishlist', description: 'View Your Saved Items' },
    { icon: <FaStar />, title: 'My Reviews', description: 'See What You\'ve Said' },
  ];

  const QuickLinksSection = ({ links }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {links.map((link, index) => (
        <Suspense key={index} fallback={<LoadingSpinner />}>
          <QuickLinkCard link={link} />
        </Suspense>
      ))}
    </div>
  );

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar - Hidden on mobile */}
      <div className="hidden md:flex w-64 bg-black text-gray-400 py-6 flex-shrink-0 shadow-md">
        <Sidebar />
      </div>

      {/* Main Content - Full width on mobile */}
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Suspense fallback={<LoadingSpinner />}>
            {user && <UserCard user={user} />}
          </Suspense>
          <Suspense fallback={<LoadingSpinner />}>
            <TribeCard tribe={tribeData} />
          </Suspense>
        </div>
        <Suspense fallback={<LoadingSpinner />}>
          <QuickLinksSection links={quickLinksData} />
        </Suspense>
      </div>
    </div>
  );
};

export default DashboardPage;