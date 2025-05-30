import React, { Suspense, lazy, useContext } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaShoppingBag, FaMapMarkerAlt, FaUser, FaHeadset, FaHeart, FaStar, FaTachometerAlt } from 'react-icons/fa'; // Added FaTachometerAlt for consistency
import { AuthContext } from '../components/Auth/AuthContext';

const UserCard = lazy(() => import('../components/dashboardcomp/UserCard'));
const TribeCard = lazy(() => import('../components/dashboardcomp/TribeCard'));
const QuickLinkCard = lazy(() => import('../components/dashboardcomp/QuickLinkCard'));

const DashboardPage = () => {
    const { user } = useContext(AuthContext);

    const tribeData = {
        title: 'Trendify',
        subtitle: 'Upgrade to the premium experience now',
        benefits: ['Free Shipping', 'Early Access', 'VIP Support'],
    };

    const quickLinksData = [
        { icon: <FaTachometerAlt />, title: 'Overview', description: 'See your dashboard summary', path: '/dashboard' }, // Added Overview link
        { icon: <FaShoppingBag />, title: 'My Orders', description: 'View, Modify And Track Orders', path: '/dashboard/orders' },
        { icon: <FaMapMarkerAlt />, title: 'My Addresses', description: 'Edit, Add Or Remove Addresses', path: '/dashboard/addresses' },
        { icon: <FaUser />, title: 'My Profile', description: 'Edit Personal Info And Change Password', path: '/dashboard/profile' },
        { icon: <FaHeadset />, title: 'Help & Support', description: 'Reach Out To Us', path: '/dashboard/help' },
        { icon: <FaHeart />, title: 'My Wishlist', description: 'View Your Saved Items', path: '/dashboard/wishlist' },
        { icon: <FaStar />, title: 'My Reviews', description: 'See What You\'ve Said', path: '/dashboard/reviews' },
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
        <div className="p-0"> 
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Your Dashboard Overview</h2>
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
    );
};

export default DashboardPage;