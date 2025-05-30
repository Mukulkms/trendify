// src/pages/MyAddressesPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/Auth/AuthContext'; // Adjust path if necessary
import AddressModal from '../components/AddressModal'; // Adjust path if necessary
import { MapPin, PlusCircle, Edit, Trash2, CheckCircle } from 'lucide-react';

const MyAddressesPage = () => {
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    const [addresses, setAddresses] = useState([]);
    const [fetchError, setFetchError] = useState(null);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [addressToEdit, setAddressToEdit] = useState(null); // For editing
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'

    const fetchAddresses = useCallback(async () => {
        if (!user) {
            setFetchError('Please log in to view addresses');
            return;
        }

        const token = localStorage.getItem('trendify_token');
        if (!token) {
            setFetchError('You are not logged in. Redirecting to login...');
            // Use navigate with replace to prevent going back to this page if not logged in
            navigate('/login', { state: { from: '/dashboard/addresses' }, replace: true });
            return;
        }

        setFetchError(null); // Clear previous errors
        try {
            const response = await fetch(`http://localhost:5000/api/addresses`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const text = await response.text();
                console.error('Raw response on GET /api/addresses error:', text);
                let errorMessage = 'Failed to fetch addresses';
                if (response.status === 401) {
                    errorMessage = 'Session expired. Please log in again.';
                    localStorage.removeItem('trendify_token');
                    navigate('/login', { state: { from: '/dashboard/addresses' }, replace: true });
                } else if (response.status === 404) {
                    // This can happen if a user has no addresses, which is fine
                    setAddresses([]); // Clear addresses if none found
                    return; // Exit early, no error to display for 404 in this context
                } else {
                    try {
                        const errorData = JSON.parse(text);
                        errorMessage = errorData.message || errorMessage;
                    } catch (parseError) {
                        // If response is not JSON, use the raw text or default message
                        errorMessage = text || errorMessage;
                    }
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log("Fetched addresses for My Addresses page:", data);
            setAddresses(data);
        } catch (err) {
            console.error("Error fetching addresses:", err.message);
            setFetchError(err.message);
        }
    }, [user, navigate]);

    useEffect(() => {
        // Only fetch if user is not loading and user is defined
        if (!loading && user) {
            fetchAddresses();
        }
    }, [user, loading, fetchAddresses]);

    // Ensure redirection to login if not authenticated
    useEffect(() => {
        if (!loading && !user) {
            navigate('/login', { state: { from: '/dashboard/addresses' }, replace: true });
        }
    }, [user, loading, navigate]);

    const handleOpenAddModal = () => {
        setAddressToEdit(null); // Clear any address being edited
        setModalMode('add');
        setIsAddressModalOpen(true);
    };

    const handleOpenEditModal = (address) => {
        setAddressToEdit(address);
        setModalMode('edit');
        setIsAddressModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsAddressModalOpen(false);
        setAddressToEdit(null); // Ensure addressToEdit is cleared when modal closes
    };

    const handleAddressChange = () => {
        // This function is called by AddressModal on successful add/edit
        fetchAddresses(); // Refresh the list of addresses
        handleCloseModal(); // Close modal
    };

    const handleDeleteAddress = async (addressId) => {
        if (!window.confirm("Are you sure you want to delete this address?")) {
            return;
        }

        const token = localStorage.getItem('trendify_token');
        if (!token) {
            alert('You need to be logged in to delete addresses.');
            navigate('/login', { state: { from: '/dashboard/addresses' }, replace: true });
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/addresses/${addressId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete address');
            }

            alert('Address deleted successfully!');
            fetchAddresses(); // Refresh the list
        } catch (error) {
            console.error('Error deleting address:', error);
            setFetchError(`Error deleting address: ${error.message}`); // Display error to user
        }
    };

    const handleSetDefaultAddress = async (addressId) => {
        const token = localStorage.getItem('trendify_token');
        if (!token) {
            alert('You need to be logged in to set default address.');
            navigate('/login', { state: { from: '/dashboard/addresses' }, replace: true });
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/addresses/${addressId}/set-default`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to set default address');
            }

            alert('Default address updated successfully!');
            fetchAddresses(); // Refresh the list
        } catch (error) {
            console.error('Error setting default address:', error);
            setFetchError(`Error setting default address: ${error.message}`); // Display error to user
        }
    };

    if (loading) {
        return <div className="text-center p-8 text-lg text-gray-700">Loading addresses...</div>;
    }

    // Only render if user is available; redirection is handled by useEffect
    if (!user) {
        return null;
    }

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">My Addresses</h2>

            {fetchError && <p className="text-red-600 text-center mb-4">{fetchError}</p>}

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Your Saved Addresses</h3>
                    <button
                        onClick={handleOpenAddModal}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center gap-2 transition-colors"
                    >
                        <PlusCircle className="h-5 w-5" />
                        Add New Address
                    </button>
                </div>

                {addresses.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">You haven't added any addresses yet. Click "Add New Address" to get started!</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {addresses.map((address) => (
                            <div
                                key={address._id}
                                className={`border p-5 rounded-lg shadow-sm ${address.isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <p className="font-semibold text-lg text-gray-800">
                                        {address.fullName}
                                    </p>
                                    {address.isDefault && (
                                        <span className="flex items-center text-green-600 text-sm font-medium bg-green-100 px-2 py-0.5 rounded-full">
                                            <CheckCircle className="h-4 w-4 mr-1" /> Default
                                        </span>
                                    )}
                                </div>
                                {/* FIX: Changed address.street to address.fullAddress */}
                                <p className="text-gray-700 text-sm">
                                    {address.fullAddress}, {address.city}, {address.state} -{' '}
                                    {address.pincode}
                                </p>
                                <p className="text-gray-700 text-sm mb-3">Mobile: {address.mobileNumber}</p>

                                <div className="flex space-x-3 mt-4">
                                    <button
                                        onClick={() => handleOpenEditModal(address)}
                                        className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm font-medium"
                                    >
                                        <Edit className="h-4 w-4 mr-1" /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteAddress(address._id)}
                                        className="text-red-600 hover:text-red-800 flex items-center text-sm font-medium"
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                                    </button>
                                    {!address.isDefault && (
                                        <button
                                            onClick={() => handleSetDefaultAddress(address._id)}
                                            className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
                                        >
                                            <MapPin className="h-4 w-4 mr-1" /> Set Default
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Address Modal for Add/Edit */}
            {isAddressModalOpen && (
                <AddressModal
                    isOpen={isAddressModalOpen}
                    onClose={handleCloseModal}
                    onAddressSubmit={handleAddressChange} // This will trigger refetch and close modal
                    currentUser={user}
                    addressToEdit={addressToEdit} // Pass the address for editing
                    mode={modalMode} // Pass the mode ('add' or 'edit')
                />
            )}
        </div>
    );
};

export default MyAddressesPage;