// pages/AdminOrdersPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth2 } from '../AuthContext2'; // <--- CHANGED: Import useAuth2
import { Loader2, AlertCircle, Package, User, Clock, CheckCircle } from 'lucide-react';

const AdminOrdersPage = () => {
  const { user, loading: authLoading } = useAuth2(); // <--- CHANGED: Use useAuth2
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const orderStatusOptions = [
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled',
    'Refunded',
    'On Hold'
  ];

  useEffect(() => {
    // Redirect if not authenticated or not an admin/super-admin
    if (!authLoading && (!user || (user.role !== 'admin' && user.role !== 'super-admin'))) { // <--- CHANGED: Check for admin or super-admin role
      console.log("AdminOrdersPage: Access Denied. User role:", user?.role);
      navigate('/unauthorized', { replace: true });
      return;
    }

    const fetchAllOrders = async () => {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("trendify_admin_token"); // <--- CHANGED: Use trendify_admin_token

      if (!token) {
        setError('Authentication token not found. Please log in as an admin.');
        setIsLoading(false);
        navigate('/admin-login', { state: { from: '/admin/orders' }, replace: true }); // <--- Optional: Redirect to specific admin login
        return;
      }

      try {
        const backendBaseUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';
        const response = await fetch(`${backendBaseUrl}/orders`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          if (response.status === 401 || response.status === 403) {
            setError('Unauthorized access. Please log in as an admin.');
            localStorage.removeItem("trendify_admin_token"); // <--- CHANGED: Clear admin token
            navigate('/admin-login', { state: { from: '/admin/orders' }, replace: true }); // <--- Optional: Redirect to specific admin login
          } else {
            throw new Error(errorData.message || `Failed to fetch orders: ${response.status}`);
          }
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error('Error fetching all orders:', err);
        setError(err.message || 'Failed to load all orders.');
      } finally {
        setIsLoading(false);
      }
    };

    if (user && (user.role === 'admin' || user.role === 'super-admin') && !authLoading) { // <--- CHANGED: Check for admin or super-admin
      fetchAllOrders();
    }
  }, [user, authLoading, navigate]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    const token = localStorage.getItem("trendify_admin_token"); // <--- CHANGED: Use trendify_admin_token

    try {
      const backendBaseUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';
      const response = await fetch(`${backendBaseUrl}/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ orderStatus: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update order status');
      }

      const updatedOrder = await response.json();
      setOrders(prevOrders =>
        prevOrders.map(order => (order._id === orderId ? updatedOrder : order))
      );
      alert(`Order ${orderId.substring(orderId.length - 6)} status updated to ${newStatus}`);
    } catch (err) {
      console.error('Error updating order status:', err);
      alert(`Failed to update status for order ${orderId.substring(orderId.length - 6)}: ${err.message}`);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // --- Loading, Error, and Access Denied UI remains largely the same ---
  if (authLoading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-700">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-500 mb-4" />
        <p className="text-xl font-semibold">Loading all orders for admin...</p>
      </div>
    );
  }

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

  // Final check for role after all loading/error states
  if (!user || (user.role !== 'admin' && user.role !== 'super-admin')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-700 p-4">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-2xl font-semibold text-red-700 text-center">Access Denied</p>
        <p className="text-lg text-gray-600 mt-3 text-center max-w-lg">
          You do not have administrative privileges to view this page.
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-md"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-10 border-b-2 border-indigo-300 pb-4">
          All Orders (Admin View)
        </h2>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-md border border-gray-200">
            <Package className="h-20 w-20 text-gray-400 mb-6" />
            <p className="text-xl text-gray-600 font-medium mb-3">No Orders Placed Yet</p>
            <p className="text-gray-500 text-center max-w-md">
              There are no orders in the system to display.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ordered By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ordered On
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order._id.substring(order._id.length - 6)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-8 w-8 rounded-full object-cover mr-2"
                          src={order.userId?.profilePic || 'https://via.placeholder.com/40'}
                          alt={order.userId?.fullname || 'User'}
                        />
                        <div className="text-sm font-medium text-gray-900">
                          {order.userId?.fullname || 'N/A'}
                          <div className="text-gray-500">{order.userId?.email || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {order.items.map((item, idx) => (
                        <p key={idx}>
                          {item.productId?.name || 'Unknown Product'} (x{item.quantity})
                        </p>
                      ))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                      ₹{order.totalPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.orderedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.paymentStatus === 'Paid'
                            ? 'bg-green-100 text-green-800'
                            : order.paymentStatus === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        disabled={updatingOrderId === order._id}
                      >
                        {orderStatusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {updatingOrderId === order._id ? (
                        <Loader2 className="animate-spin h-5 w-5 text-indigo-500" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;