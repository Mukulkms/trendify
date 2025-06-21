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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-700">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-500 mb-4" />
        <p className="text-xl font-semibold">Loading your orders...</p>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-700 p-4">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-2xl font-semibold text-red-700 text-center">Error Loading Orders</p>
        <p className="text-lg text-red-600 mt-3 text-center max-w-lg">{error}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-md"
        >
          Go to Home
        </button>
      </div>
    );
  }

  // Main content display
  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-10 border-b-2 border-indigo-300 pb-4">
          Your Order History
        </h2>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-md border border-gray-200">
            <Package className="h-20 w-20 text-gray-400 mb-6" />
            <p className="text-xl text-gray-600 font-medium mb-3">No Orders Found</p>
            <p className="text-gray-500 text-center max-w-md">
              It looks like you haven't placed any orders yet. Start shopping now!
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-md"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl"
              >
                {/* Order Header - Clickable for expansion */}
                <div
                  className="bg-indigo-50 px-6 py-4 border-b border-indigo-100 cursor-pointer flex justify-between items-center flex-wrap gap-3"
                  onClick={() => toggleOrderDetails(order._id)}
                >
                  <h3 className="text-lg font-bold text-indigo-700 flex items-center gap-2">
                    <Package className="w-5 h-5" /> Order #
                    {order._id.substring(order._id.length - 6)} {/* Display last 6 chars of ID */}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Calendar className="w-4 h-4" />
                    {new Date(order.orderedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      order.paymentStatus === 'Paid'
                        ? 'bg-green-100 text-green-800'
                        : order.paymentStatus === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      order.orderStatus === 'Delivered'
                        ? 'bg-blue-100 text-blue-800'
                        : order.orderStatus === 'Processing'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                  {expandedOrder === order._id ? (
                    <ChevronUp className="w-5 h-5 text-indigo-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-indigo-600" />
                  )}
                </div>

                {/* Order Details - Conditionally rendered */}
                <div
                  className={`grid grid-cols-1 md:grid-cols-2 gap-6 p-6 transition-all duration-300 ease-in-out ${
                    expandedOrder === order._id ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                  }`}
                >
                  {/* Left Column: Order Items */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-800 mb-4">Items:</h4>
                    <div className="space-y-3">
                      {order.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <div className="flex items-center gap-3">
                            {item.productId?.image && (
                              <img
                                src={item.productId.image}
                                alt={item.productId.name || item.name}
                                className="w-12 h-12 object-cover rounded-md"
                              />
                            )}
                            <div>
                              <p className="text-gray-900 font-medium text-base">
                                {item.productId?.name || item.name}
                              </p>
                              <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="font-semibold text-gray-900 text-lg">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Shipping & Payment */}
                  <div className="space-y-6">
                    {/* Shipping Address */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2 mb-3">
                        <MapPin className="w-5 h-5 text-indigo-500" /> Shipping Address
                      </h4>
                      <div className="space-y-1 text-sm text-gray-700">
                        <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
                        <p>{order.shippingAddress.fullAddress}</p>
                        <p>
                          {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                          <span className="font-semibold">{order.shippingAddress.pincode}</span>
                        </p>
                        <p>Mobile: {order.shippingAddress.mobileNumber}</p>
                        <p>Country: {order.shippingAddress.country || 'India'}</p>
                      </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2 mb-3">
                        <DollarSign className="w-5 h-5 text-green-500" /> Payment Summary
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center text-gray-700">
                          <span>Subtotal</span>
                          <span className="font-medium">₹{(order.totalPrice + order.discount).toFixed(2)}</span>
                        </div>
                        {order.discount > 0 && (
                          <div className="flex justify-between items-center text-green-600">
                            <span>Discount</span>
                            <span className="font-medium">-₹{order.discount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center pt-2 border-t border-gray-200 font-bold text-lg text-indigo-700">
                          <span>Total Paid</span>
                          <span>₹{order.totalPrice.toFixed(2)}</span>
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