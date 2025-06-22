import React, { useEffect, useState, useMemo } from 'react';
import { Loader2, AlertCircle, TrendingUp, ShoppingBag, Package, Plus, BarChart3, Calendar, Award, Eye, Users, Star } from 'lucide-react';
import { useAuth2 } from '../AuthContext2';
import { FaRupeeSign } from 'react-icons/fa';

const DashboardOverview = () => {
    const { user, loading: authLoading } = useAuth2();
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const backendBaseUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const fetchData = async () => {
            if (!user || (user.role !== 'super-admin' && user.role !== 'admin')) {
                setError("You are not authorized to view this page.");
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);
            const token = localStorage.getItem("trendify_admin_token");

            if (!token) {
                setError('Authentication token not found. Please log in.');
                setIsLoading(false);
                return;
            }

            try {
                // Fetch All Orders
                const ordersResponse = await fetch(`${backendBaseUrl}/orders`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!ordersResponse.ok) {
                    throw new Error('Failed to fetch orders');
                }
                const ordersData = await ordersResponse.json();
                setOrders(ordersData);

                // Fetch All Products
                const productsResponse = await fetch(`${backendBaseUrl}/products`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (productsResponse.ok) {
                    const productsData = await productsResponse.json();
                    setProducts(productsData);
                } else {
                    console.warn("Could not fetch products for stock overview. Product API might be missing or unauthorized.");
                }

            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                setError(err.message || "Failed to load dashboard data.");
            } finally {
                setIsLoading(false);
            }
        };

        if (!authLoading && user && (user.role === 'super-admin' || user.role === 'admin')) {
            fetchData();
        }
    }, [user, authLoading, backendBaseUrl]);

    // Memoized calculations for dashboard metrics
    const {
        totalOrders,
        lastOrderDate,
        lifetimeSpent,
        averageOrderValue,
        totalProductsInStock,
        mostSellingProducts
    } = useMemo(() => {
        let totalOrders = orders.length;
        let lifetimeSpent = 0;
        let lastOrderDate = 'N/A';
        let productSalesCount = {};
        let totalProductsInStock = 0;

        if (orders.length > 0) {
            lifetimeSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);
            const latestOrder = orders.reduce((prev, current) =>
                (new Date(current.orderedAt) > new Date(prev.orderedAt)) ? current : prev
            );
            lastOrderDate = new Date(latestOrder.orderedAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
            });

            // Calculate product sales counts
            orders.forEach(order => {
                order.items.forEach(item => {
                    const productId = item.productId?._id || item.productId;
                    if (productId) {
                        productSalesCount[productId] = (productSalesCount[productId] || 0) + item.quantity;
                    }
                });
            });
        }

        const averageOrderValue = totalOrders > 0 ? lifetimeSpent / totalOrders : 0;

        if (products.length > 0) {
             totalProductsInStock = products.reduce((sum, product) => sum + (product.stock || 0), 0);
        }

        const sortedProductsBySales = Object.entries(productSalesCount)
            .sort(([, countA], [, countB]) => countB - countA)
            .slice(0, 6);

        const mostSellingProducts = sortedProductsBySales.map(([productId, quantitySold]) => {
            const product = products.find(p => p._id === productId);
            return product ? { ...product, quantitySold } : null;
        }).filter(Boolean);

        return {
            totalOrders,
            lastOrderDate,
            lifetimeSpent,
            averageOrderValue,
            totalProductsInStock,
            mostSellingProducts
        };
    }, [orders, products]);

    if (isLoading || authLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
                    <Loader2 className="h-16 w-16 animate-spin text-blue-600 relative z-10" />
                </div>
                <p className="text-2xl font-bold text-slate-700 mt-6">Loading Dashboard</p>
                <p className="text-slate-500 mt-2">Fetching your data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
                    <div className="bg-red-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                        <AlertCircle className="h-10 w-10 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-red-700 mb-4">Oops! Something went wrong</h2>
                    <p className="text-red-600 mb-6">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }
    
    if (!user || (user.role !== 'super-admin' && user.role !== 'admin')) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
                    <div className="bg-orange-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                        <AlertCircle className="h-10 w-10 text-orange-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-orange-700 mb-4">Access Denied</h2>
                    <p className="text-orange-600">You don't have permission to view this dashboard.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Header Section */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Dashboard Overview
                            </h1>
                            <p className="text-slate-600 mt-2">Welcome back! Here's what's happening with your business.</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center bg-green-50 px-4 py-2 rounded-full">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                                <span className="text-green-700 font-medium">Live Data</span>
                            </div>
                            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2">
                                <Eye className="w-4 h-4" />
                                <span>View Reports</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Orders Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100 group hover:scale-105">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl">
                                <ShoppingBag className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">Total</span>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-800 mb-2">{totalOrders}</h3>
                        <p className="text-slate-600 font-medium">Total Orders</p>
                        <p className="text-xs text-slate-500 mt-2">Last order: {lastOrderDate}</p>
                    </div>

                    {/* Revenue Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100 group hover:scale-105">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl">
                                <FaRupeeSign className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Revenue</span>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-800 mb-2">₹{lifetimeSpent.toLocaleString()}</h3>
                        <p className="text-slate-600 font-medium">Lifetime Revenue</p>
                        <p className="text-xs text-green-600 mt-2">↗ Growing steadily</p>
                    </div>

                    {/* Average Order Value Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100 group hover:scale-105">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-xl">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">AOV</span>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-800 mb-2">₹{averageOrderValue.toFixed(0)}</h3>
                        <p className="text-slate-600 font-medium">Avg Order Value</p>
                        <p className="text-xs text-purple-600 mt-2">Per transaction</p>
                    </div>

                    {/* Stock Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100 group hover:scale-105">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-xl">
                                <Package className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">Stock</span>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-800 mb-2">{totalProductsInStock}</h3>
                        <p className="text-slate-600 font-medium">Items in Stock</p>
                        <p className="text-xs text-orange-600 mt-2">Available units</p>
                    </div>
                </div>

                {/* Charts and Analytics Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Sales Analytics */}
                    <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-slate-800 flex items-center">
                                <BarChart3 className="w-6 h-6 mr-3 text-blue-600" />
                                Sales Analytics
                            </h3>
                            <div className="flex space-x-2">
                                <button className="text-blue-600 bg-blue-50 px-3 py-1 rounded-lg text-sm font-medium">7D</button>
                                <button className="text-slate-500 px-3 py-1 rounded-lg text-sm">30D</button>
                                <button className="text-slate-500 px-3 py-1 rounded-lg text-sm">90D</button>
                            </div>
                        </div>
                        <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center border-2 border-dashed border-blue-200">
                            <div className="text-center">
                                <BarChart3 className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                                <p className="text-slate-600 font-medium">Sales Chart Placeholder</p>
                                <p className="text-sm text-slate-500 mt-2">Integrate with Chart.js or Recharts</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100">
                        <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                            <Calendar className="w-6 h-6 mr-3 text-purple-600" />
                            Quick Stats
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                                <div className="flex items-center">
                                    <Users className="w-5 h-5 text-blue-600 mr-3" />
                                    <span className="font-medium text-slate-700">Active Customers</span>
                                </div>
                                <span className="text-xl font-bold text-blue-600">{totalOrders}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                                <div className="flex items-center">
                                    <TrendingUp className="w-5 h-5 text-green-600 mr-3" />
                                    <span className="font-medium text-slate-700">Growth Rate</span>
                                </div>
                                <span className="text-xl font-bold text-green-600">+12.5%</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                                <div className="flex items-center">
                                    <Package className="w-5 h-5 text-purple-600 mr-3" />
                                    <span className="font-medium text-slate-700">Products</span>
                                </div>
                                <span className="text-xl font-bold text-purple-600">{products.length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Most Selling Products */}
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-bold text-slate-800 flex items-center">
                            <Award className="w-6 h-6 mr-3 text-yellow-600" />
                            Top Selling Products
                        </h3>
                        <button
                            onClick={() => console.log('Add products clicked')}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Products</span>
                        </button>
                    </div>
                    
                    {mostSellingProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                            {mostSellingProducts.map((product, index) => (
                                <div key={product._id} className="group relative">
                                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-blue-300 transform hover:scale-105">
                                        {/* Rank Badge */}
                                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                                            {index + 1}
                                        </div>
                                        
                                        <div className="relative mb-4">
                                            <img
                                                src={product.image || `https://via.placeholder.com/200x200?text=${encodeURIComponent(product.name)}`}
                                                alt={product.name}
                                                className="w-full h-32 object-cover rounded-xl group-hover:scale-110 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                                        </div>
                                        
                                        <h4 className="font-bold text-slate-800 text-sm mb-2 line-clamp-2 min-h-[2.5rem]">
                                            {product.name}
                                        </h4>
                                        
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-lg font-bold text-green-600">₹{product.price.toFixed(0)}</span>
                                                <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-full">
                                                    Stock: {product.stock || 0}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center justify-center bg-gradient-to-r from-green-100 to-green-200 rounded-lg py-2">
                                                <Star className="w-4 h-4 text-green-600 mr-1" />
                                                <span className="text-green-700 font-bold text-sm">{product.quantitySold} sold</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-12 max-w-md mx-auto">
                                <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                                <h4 className="text-xl font-bold text-slate-600 mb-2">No Sales Data Yet</h4>
                                <p className="text-slate-500">Start selling to see your top products here!</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;