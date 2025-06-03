import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext2'; // Adjusted path

const UserManagement = () => {
    const { API_BASE_URL } = useAuth();
    const [pendingUsers, setPendingUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchPendingUsers = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem("trendify_token");
            if (!token) {
                setError("Authentication token not found.");
                setLoading(false);
                return;
            }

            const response = await fetch(`${API_BASE_URL}/admin/pending-registrations`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch pending users.');
            }
            setPendingUsers(data);
        } catch (err) {
            console.error('Error fetching pending users:', err);
            setError(err.message || 'Error fetching pending users.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const handleApprove = async (userId, role) => {
        setMessage('');
        setError('');
        try {
            const token = localStorage.getItem("trendify_token");
            if (!token) {
                setError("Authentication token not found. Please log in.");
                return;
            }

            const response = await fetch(`${API_BASE_URL}/admin/approve-registration/${userId}`, {
                method: 'PATCH', // Or PUT, depending on your API
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ role }) // Send the assigned role
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to approve user.');
            }
            setMessage(data.message || `User ${data.fullname} approved as ${role}.`);
            fetchPendingUsers(); // Refresh the list
        } catch (err) {
            console.error('Error approving user:', err);
            setError(err.message || 'Error approving user.');
        }
    };

    const handleDelete = async (userId) => {
        setMessage('');
        setError('');
        if (!window.confirm("Are you sure you want to delete this registration request?")) {
            return;
        }
        try {
            const token = localStorage.getItem("trendify_token");
            if (!token) {
                setError("Authentication token not found. Please log in.");
                return;
            }

            const response = await fetch(`${API_BASE_URL}/admin/delete-registration/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete request.');
            }
            setMessage(data.message || 'Registration request deleted.');
            fetchPendingUsers(); // Refresh the list
        } catch (err) {
            console.error('Error deleting request:', err);
            setError(err.message || 'Error deleting request.');
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">User Management</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {message && <p className="text-green-500 mb-4">{message}</p>}

            <h3 className="text-xl font-semibold mb-4">Pending Registration Requests</h3>
            {loading ? (
                <p>Loading pending users...</p>
            ) : pendingUsers.length === 0 ? (
                <p>No pending registration requests.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                        <thead>
                            <tr className="bg-gray-100 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                                <th className="py-3 px-4 border-b">Full Name</th>
                                <th className="py-3 px-4 border-b">Email</th>
                                <th className="py-3 px-4 border-b">Mobile Number</th>
                                <th className="py-3 px-4 border-b">Requested On</th>
                                <th className="py-3 px-4 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingUsers.map(user => (
                                <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-3 px-4">{user.fullname}</td>
                                    <td className="py-3 px-4">{user.email || 'N/A'}</td>
                                    <td className="py-3 px-4">{user.mobileNumber || 'N/A'}</td>
                                    <td className="py-3 px-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td className="py-3 px-4 flex space-x-2">
                                        <select
                                            onChange={(e) => handleApprove(user._id, e.target.value)}
                                            defaultValue=""
                                            className="px-2 py-1 border rounded-md text-sm"
                                        >
                                            <option value="" disabled>Assign Role</option>
                                            <option value="admin">Admin</option>
                                            <option value="vendor">Vendor</option>
                                            <option value="super-admin">Super Admin</option>
                                        </select>
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* You can also list all active users here with filtering and management options */}
            <h3 className="text-xl font-semibold mt-8 mb-4">All Active Users</h3>
            <p className="text-gray-600">
                (Implementation for listing all users, editing roles, deactivating, etc. will go here)
            </p>
        </div>
    );
};

export default UserManagement;