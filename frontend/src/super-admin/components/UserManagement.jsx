import React, { useState, useEffect } from "react";
import { FaUserCheck, FaHourglassHalf, FaInfoCircle, FaUsers, FaCheck, FaTrash, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const API_BASE_URL = "http://localhost:5000/api/superadmin";
const ITEMS_PER_PAGE = 15;

const UserManagement = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPendingUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("trendify_admin_token");
      if (!token) {
        setError("Authentication token not found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/pending-users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch pending users.");
      }
      setPendingUsers(data);
    } catch (err) {
      console.error("Error fetching pending users:", err);
      setError(err.message || "Error fetching pending users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const handleApprove = async (userId) => {
    setMessage("");
    setError("");
    try {
      const token = localStorage.getItem("trendify_admin_token");
      if (!token) {
        setError("Authentication token not found. Please log in.");
        return;
      }
      const response = await fetch(`${API_BASE_URL}/approve/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to approve user.");
      }

      setMessage("User approved successfully.");
      fetchPendingUsers();
    } catch (err) {
      console.error("Error approving user:", err);
      setError(err.message || "Error approving user.");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this registration request?")) return;
    setMessage("");
    setError("");
    try {
      const token = localStorage.getItem("trendify_admin_token");
      if (!token) {
        setError("Authentication token not found. Please log in.");
        return;
      }
      const response = await fetch(`${API_BASE_URL}/reject/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete request.");
      }

      setMessage("Registration request deleted.");
      fetchPendingUsers();
    } catch (err) {
      console.error("Error deleting request:", err);
      setError(err.message || "Error deleting request.");
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(pendingUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentUsers = pendingUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full mr-4"></div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            User Management
          </h2>
        </div>
        <p className="text-gray-600 ml-5">Manage user registration requests and active accounts</p>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-sm mb-6 animate-pulse">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-red-400 rounded-full mr-3 flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <div>
              <strong className="font-semibold">Error!</strong>
              <span className="block sm:inline ml-2">{error}</span>
            </div>
          </div>
        </div>
      )}
      
      {message && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-100 border-l-4 border-green-400 text-green-700 px-6 py-4 rounded-lg shadow-sm mb-6 animate-pulse">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-green-400 rounded-full mr-3 flex items-center justify-center">
              <FaCheck className="text-white text-xs" />
            </div>
            <div>
              <strong className="font-semibold">Success!</strong>
              <span className="block sm:inline ml-2">{message}</span>
            </div>
          </div>
        </div>
      )}

      {/* Pending Users Section */}
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 mb-8 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
            <FaHourglassHalf className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Pending Registration Requests</h3>
            <p className="text-gray-600">Review and approve new user registrations</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-indigo-300 rounded-full animate-spin animation-delay-150"></div>
            </div>
            <p className="text-xl font-medium text-gray-700">Loading pending requests...</p>
            <p className="text-sm text-gray-500 mt-1">Please wait while we fetch the data</p>
          </div>
        ) : pendingUsers.length === 0 ? (
          <div className="text-center py-16 px-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border border-blue-200">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FaUserCheck className="text-white text-3xl" />
            </div>
            <h4 className="text-3xl font-bold text-blue-800 mb-3">All Clear!</h4>
            <p className="text-gray-700 text-lg mb-2">
              There are currently no new registration requests to review.
            </p>
            <p className="text-gray-600">
              New requests will appear here when users register for access.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-xl border border-gray-200 shadow-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                      <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Full Name</th>
                      <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Email Address</th>
                      <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Mobile Number</th>
                      <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Requested On</th>
                      <th className="py-4 px-6 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentUsers.map((user, index) => (
                      <tr key={user._id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group">
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mr-3 shadow-md">
                              <span className="text-white font-bold text-sm">
                                {user.fullname.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="text-sm font-semibold text-gray-900">{user.fullname}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-600 font-medium">
                          {user.email || <span className="text-gray-400 italic">Not provided</span>}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-600 font-medium">
                          {user.mobileNumber || <span className="text-gray-400 italic">Not provided</span>}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-600 font-medium">
                          {new Date(user.createdAt).toLocaleDateString("en-US", {
                            year: 'numeric', month: 'short', day: 'numeric'
                          })}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex justify-center items-center space-x-3">
                            <button
                              onClick={() => handleApprove(user._id)}
                              className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-sm font-semibold hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                              <FaCheck className="mr-2" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleDelete(user._id)}
                              className="flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg text-sm font-semibold hover:from-red-600 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                              <FaTrash className="mr-2" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center space-x-6">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center px-5 py-3 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <FaChevronLeft className="mr-2" />
                  Previous
                </button>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                    Page <span className="font-bold text-indigo-600">{currentPage}</span> of <span className="font-bold">{totalPages}</span>
                  </span>
                </div>
                
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-5 py-3 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Next
                  <FaChevronRight className="ml-2" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Active Users Section */}
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
            <FaUsers className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">All Active Users</h3>
            <p className="text-gray-600">Manage approved users and their roles</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl border border-blue-200">
          <div className="flex items-start">
            <FaInfoCircle className="text-blue-500 mr-4 mt-1 text-xl flex-shrink-0" />
            <div className="text-gray-700 leading-relaxed">
              <p className="mb-3 font-medium">
                This section will display a comprehensive list of all approved users including Admins, Vendors, and Super Admins.
              </p>
              <p className="text-sm text-gray-600">
                Features coming soon: User filtering, role management, account activation/deactivation, and advanced user analytics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;