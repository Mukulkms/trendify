// pages/MyOrdersPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/Auth/AuthContext';
import { Package, Calendar, DollarSign, MapPin, Loader2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

const MyOrdersPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null); // State to manage which order is expanded

  // Function to toggle order details expansion
  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  useEffect(() => {
    // Redirect to login if not authenticated after auth loading
    if (!authLoading && !user) {
      navigate('/login', { state: { from: '/my-orders' }, replace: true });
      return;
    }

    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('trendify_token');

      if (!token) {
        setError('Authentication token not found. Please log in.');
        setIsLoading(false);
        navigate('/login', { state: { from: '/my-orders' }, replace: true });
        return;
      }

      try {
        const backendBaseUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';
        const response = await fetch(`${backendBaseUrl}/orders/myorders`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 401 || response.status === 403) {
            setError('Session expired or unauthorized. Please log in again.');
            localStorage.removeItem('trendify_token');
            navigate('/login', { state: { from: '/my-orders' }, replace: true });
          } else {
            throw new Error(errorData.message || `Failed to fetch orders: ${response.status}`);
          }
        }

        const data = await response.json();
        console.log('Fetched orders:', data);
        setOrders(data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message || 'Failed to load your orders.');
      } finally {
        setIsLoading(false);
      }
    };

    if (user && !authLoading) {
      fetchOrders();
    }
  }, [user, authLoading, navigate]);

  // Display loading state
  if (authLoading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20">
          <Loader2 className="h-16 w-16 animate-spin text-indigo-500 mb-6 mx-auto" />
          <p className="text-2xl font-bold text-gray-800 text-center">Loading your orders...</p>
          <div className="mt-4 w-32 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto animate-pulse"></div>
        </div>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 p-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20 max-w-lg">
          <AlertCircle className="h-16 w-16 text-red-500 mb-6 mx-auto" />
          <p className="text-3xl  text-red-700 text-center mb-4">Oops!</p>
          <p className="text-lg text-red-600 text-center mb-8">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="w-full px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // Main content display
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <p className="text-5xl font-black bg-gradient-to-r from-slate-800 via-indigo-800 to-purple-800 bg-clip-text text-transparent mb-4">
            Your Orders
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Track, manage, and review your order history</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-16 text-center">
            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-8">
              <Package className="h-16 w-16 text-indigo-500" />
            </div>
            <p className="text-3xl font-bold text-gray-800 mb-4">No Orders Yet</p>
            <p className="text-gray-600 text-lg mb-10 max-w-md mx-auto">
              Start your shopping journey today and discover amazing products!
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-10 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
              >
                {/* Compact Order Header */}
                <div
                  className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 px-6 py-5 border-b border-white/20 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleOrderDetails(order._id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl p-2">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        #{order._id.substring(order._id.length - 6)}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.orderedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-800">₹{order.totalPrice.toFixed(2)}</span>
                    
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                        order.paymentStatus === 'Paid'
                          ? 'bg-emerald-100 text-emerald-700'
                          : order.paymentStatus === 'Pending'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                    
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                        order.orderStatus === 'Delivered'
                          ? 'bg-blue-100 text-blue-700'
                          : order.orderStatus === 'Processing'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                    
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg p-2">
                      {expandedOrder === order._id ? (
                        <ChevronUp className="w-4 h-4 text-white" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Compact Order Details */}
                <div
                  className={`transition-all duration-500 ease-in-out ${
                    expandedOrder === order._id ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                  }`}
                >
                  <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Items - Takes more space */}
                    <div className="lg:col-span-2">
                      <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                        Items Ordered
                      </h4>
                      <div className="space-y-3">
                        {order.items.map((item, itemIdx) => (
                          <div key={itemIdx} className="flex items-center justify-between bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-white/30">
                            <div className="flex items-center gap-3">
                              {item.productId?.image && (
                                <img
                                  src={item.productId.image}
                                  alt={item.productId.name || item.name}
                                  className="w-12 h-12 object-cover rounded-lg shadow-md"
                                />
                              )}
                              <div>
                                <p className="font-semibold text-gray-800">
                                  {item.productId?.name || item.name}
                                </p>
                                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <p className="font-bold text-gray-800">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Address & Payment */}
                    <div className="space-y-6">
                      {/* Shipping Address */}
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                        <h4 className="font-bold text-gray-800 flex items-center gap-2 mb-3">
                          <MapPin className="w-4 h-4 text-indigo-500" /> 
                          Delivery Address
                        </h4>
                        <div className="text-sm text-gray-700 space-y-1">
                          <p className="font-semibold text-gray-800">{order.shippingAddress.fullName}</p>
                          <p>{order.shippingAddress.fullAddress}</p>
                          <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                          <p>📱 {order.shippingAddress.mobileNumber}</p>
                        </div>
                      </div>

                      {/* Payment Summary */}
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                        <h4 className="font-bold text-gray-800 flex items-center gap-2 mb-3">
                          <DollarSign className="w-4 h-4 text-emerald-500" /> 
                          Payment Details
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between text-gray-700">
                            <span>Subtotal</span>
                            <span>₹{(order.totalPrice + order.discount).toFixed(2)}</span>
                          </div>
                          {order.discount > 0 && (
                            <div className="flex justify-between text-emerald-600">
                              <span>Discount</span>
                              <span>-₹{order.discount.toFixed(2)}</span>
                            </div>
                          )}
                          <div className="flex justify-between pt-2 border-t border-gray-200 font-bold text-lg text-gray-800">
                            <span>Total Paid</span>
                            <span>₹{order.totalPrice.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;