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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {links.map((link, index) => (
                <Suspense key={index} fallback={<LoadingSpinner />}>
                    <QuickLinkCard link={link} />
                </Suspense>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6 lg:p-8">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-indigo-200 to-pink-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute bottom-20 left-1/4 w-28 h-28 bg-gradient-to-br from-green-200 to-blue-200 rounded-full opacity-20 animate-pulse delay-2000"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Enhanced Header */}
                <div className="text-center mb-12">
                    <div className="inline-block">
                        <h3 className="text-5xl font-black mb-4 bg-gradient-to-r from-gray-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                             Dashboard Overview
                        </h3>
                        <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mx-auto"></div>
                    </div>
                    <p className="text-gray-600 mt-4 text-lg font-medium">Welcome back! Here's what's happening with your account.</p>
                </div>

                {/* User and Tribe Cards Section */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
                    <div className="transform hover:scale-105 transition-all duration-300">
                        <Suspense fallback={<LoadingSpinner />}>
                            {user && <UserCard user={user} />}
                        </Suspense>
                    </div>
                    <div className="transform hover:scale-105 transition-all duration-300">
                        <Suspense fallback={<LoadingSpinner />}>
                            <TribeCard tribe={tribeData} />
                        </Suspense>
                    </div>
                </div>

                {/* Quick Links Section */}
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 lg:p-10">
                    <div className="text-center mb-10">
                        <h3 className="text-3xl font-bold text-gray-800 mb-3">Quick Actions</h3>
                        <p className="text-gray-600 font-medium">Everything you need, just a click away</p>
                        <div className="h-0.5 w-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mx-auto mt-4"></div>
                    </div>
                    
                    <Suspense fallback={<LoadingSpinner />}>
                        <QuickLinksSection links={quickLinksData} />
                    </Suspense>
                </div>

                {/* Bottom decorative spacing */}
                <div className="h-16"></div>
            </div>
        </div>
    );
};

export default DashboardPage;