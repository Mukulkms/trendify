import React, { useState, useEffect } from "react";
import { FaUserCheck, FaHourglassHalf, FaInfoCircle } from 'react-icons/fa'; // Importing icons for better UI

const API_BASE_URL = "http://localhost:5000/api/superadmin";
const ITEMS_PER_PAGE = 15;

const UserManagement = () => {
  // const { API_BASE_URL } = useAuth(); // Uncomment and use if you want to get API_BASE_URL from AuthContext
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
      fetchPendingUsers(); // Refresh the list
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
      fetchPendingUsers(); // Refresh the list
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font text-gray-800 mb-6 border-b pb-4">
        User Management
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
          <strong className="font-bold mr-2">Error!</strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
          <strong className="font-bold mr-2">Success!</strong>
          <span className="block sm:inline">{message}</span>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h3 className="text-xl font-semibold text-gray-700 flex items-center mb-5">
          <FaHourglassHalf className="text-yellow-500 mr-3 text-2xl" />
          Pending Registration Requests
        </h3>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <svg className="animate-spin h-8 w-8 text-blue-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg">Loading pending user requests...</p>
          </div>
        ) : pendingUsers.length === 0 ? (
          <div className="text-center py-12 px-4 bg-blue-50 rounded-lg flex flex-col items-center justify-center">
            <FaUserCheck className="text-blue-400 text-5xl mb-4" />
            <p className="text-2xl font-medium text-blue-800 mb-2">All Clear!</p>
            <p className="text-gray-600 text-lg">
              There are currently no new registration requests to review.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              We'll notify you if any new users register.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto shadow-md rounded-lg">
              <table className="min-w-full bg-white divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Full Name</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Email</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Mobile Number</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Requested On</th>
                    <th className="py-3 px-4 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-900">{user.fullname}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-600">{user.email || "N/A"}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-600">{user.mobileNumber || "N/A"}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </td>
                      <td className="py-3 px-4 flex justify-center items-center space-x-2">
                        <button
                          onClick={() => handleApprove(user._id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-200"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center items-center space-x-4">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Previous
                </button>
                <span className="text-md font-medium text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Placeholder for All Active Users - added some minimal styling */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-gray-700 flex items-center mb-4">
          <FaInfoCircle className="text-blue-500 mr-3 text-2xl" />
          All Active Users
        </h3>
        <p className="text-gray-600 text-base leading-relaxed">
          This section will display a comprehensive list of all approved users (Admins, Vendors, Super Admins).
          Here, you will be able to filter, sort, edit user roles, activate/deactivate accounts, and perform other management tasks.
          <br />
          (Implementation for listing all users, editing roles, deactivating, etc. will go here)
        </p>
      </div>
    </div>
  );
};

export default UserManagement;