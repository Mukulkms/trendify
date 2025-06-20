import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth2 } from '../AuthContext2'; // Assuming AuthContext2 is the correct path
import { toast } from 'react-toastify'; // Assuming react-toastify is configured

export default function SuperAdminOrders() {
  const { user, loading: authLoading } = useAuth2();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10); // <--- This is where 10 orders per page is set

  // Helper function to construct image URL (reused from SuperAdminProducts)
  const getImageUrl = (imagePath) => {
    // If imagePath is already a full URL
    if (imagePath && (imagePath.startsWith('http://') || imagePath.startsWith('https://'))) {
      return imagePath;
    }
    // If imagePath starts with '/images/', prepend the base URL
    if (imagePath && imagePath.startsWith('/images/')) {
        return `http://localhost:5000${imagePath}`;
    }
    // Otherwise, assume it's just the filename and construct the URL
    if (imagePath) {
      return `http://localhost:5000/images/${imagePath}`;
    }
    return 'https://via.placeholder.com/50'; // Default placeholder if no image path
  };

  // Fetch orders from backend on component mount
  useEffect(() => {
    console.log("SuperAdminOrders: useEffect - User object from useAuth2:", user);
    console.log("SuperAdminOrders: useEffect - Auth Loading state:", authLoading);

    if (authLoading) {
      return;
    }

    if (!user || user.role !== 'super-admin') {
      setError('Access Denied: You must be a Super Admin to view orders.');
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('trendify_admin_token'); // Ensure this is the correct token key
        const response = await fetch('http://localhost:5000/api/orders', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data);
        setCurrentPage(1); // Reset to first page on new data fetch
        console.log("SuperAdminOrders: Fetched orders count:", data.length); // Debugging
      } catch (err) {
        setError(err.message);
        toast.error(`Error fetching orders: ${err.message}`);
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [authLoading, user, navigate]);

  // --- Order Actions (Example: Update Status - requires backend endpoint) ---
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    if (!user || user.role !== 'super-admin') {
        toast.error('Unauthorized: Only Super Admin can update order status.');
        return;
    }
    toast.info(`Simulating order ${orderId} status update to: ${newStatus}`);

    setOrders(prevOrders => prevOrders.map(order =>
        order._id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  // --- Pagination Logic ---
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) pageNumbers.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) pageNumbers.push('...');
        pageNumbers.push(totalPages);
    }

    return pageNumbers.map((number, index) => (
      <li key={index} className="mx-1">
        {number === '...' ? (
          <span className="px-3 py-1 text-gray-500">...</span>
        ) : (
          <button
            onClick={() => paginate(number)}
            className={`px-3 py-1 border rounded ${
              currentPage === number ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-100'
            }`}
          >
            {number}
          </button>
        )}
      </li>
    ));
  };


  if (loading) {
    return <p className="text-center text-gray-500 text-lg py-10">Loading orders...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 text-lg py-10">Error: {error}</p>;
  }

  if (!user || user.role !== 'super-admin') {
      return <p className="text-center text-red-500 text-lg py-10">You are not authorized to view this page.</p>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Superadmin Orders</h2>

        {orders.length === 0 ? (
          <p className="text-gray-600">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 border-b border-gray-200">Order ID</th>
                  <th className="py-3 px-6 border-b border-gray-200">Customer</th>
                  <th className="py-3 px-6 border-b border-gray-200">Items</th>
                  <th className="py-3 px-6 border-b border-gray-200">Total Amount</th>
                  <th className="py-3 px-6 border-b border-gray-200">Status</th>
                  <th className="py-3 px-6 border-b border-gray-200">Order Date</th>
                  <th className="py-3 px-6 border-b border-gray-200 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm font-light">
                {currentOrders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 whitespace-nowrap">{order._id}</td>
                    <td className="py-3 px-6">{order.user?.name || order.user?.email || 'N/A'}</td>
                    <td className="py-3 px-6">
                      <ul className="list-disc list-inside">
                        {order.items.map((item, index) => (
                          <li key={index} className="text-xs">
                            <div className="flex items-center">
                                <img
                                    src={getImageUrl(item.image)}
                                    alt={item.name}
                                    className="w-8 h-8 object-cover rounded mr-2"
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/30'; }}
                                    loading="lazy"
                                />
                                {item.name} (x{item.quantity}) - ${item.price.toFixed(2)}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="py-3 px-6">${order.totalAmount}</td>
                    <td className="py-3 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'Delivered' ? 'bg-green-200 text-green-800' :
                          order.status === 'Shipped' ? 'bg-blue-200 text-blue-800' :
                          order.status === 'Cancelled' ? 'bg-red-200 text-red-800' :
                          'bg-yellow-200 text-yellow-800'
                      }`}>
                          {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-6">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-6 text-center">
                      <button
                        onClick={() => navigate(`/superadmin/orders/${order._id}`)}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-1 px-3 rounded text-xs mr-2 transition duration-300"
                      >
                        View Details
                      </button>
                      {order.status === 'Pending' || order.status === 'Processing' ? (
                        <button
                          onClick={() => handleUpdateOrderStatus(order._id, 'Shipped')}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-xs transition duration-300"
                        >
                          Mark Shipped
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {orders.length > ordersPerPage && (
          <nav className="flex justify-center mt-6">
            <ul className="flex items-center space-x-2">
              <li>
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 border rounded ${
                    currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-blue-100'
                  }`}
                >
                  Previous
                </button>
              </li>
              {renderPageNumbers()}
              <li>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 border rounded ${
                    currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-blue-100'
                  }`}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
}
