import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/Auth/AuthContext';
import AddressModal from '../components/AddressModal';
import { MapPin } from 'lucide-react';

const AddressSelectionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { orderDetails, pinCode } = location.state || {};

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('trendify_token');
      if (!token) {
        setFetchError('Please log in to view addresses');
        return;
      }

      fetch(`http://localhost:5000/api/addresses`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
})
  .then(async (response) => {
    if (!response.ok) {
      const text = await response.text(); // Log raw response
      console.log('Raw response on GET /api/addresses error:', text);
      const errorMessage = response.status === 401
        ? 'Unauthorized: Please log in again'
        : response.status === 404
        ? 'No addresses found'
        : 'Failed to fetch addresses';
      throw new Error(errorMessage);
    }
    return response.json();
  })
  .then((data) => {
    console.log("Fetched addresses:", data);
    setAddresses(data);
    const defaultAddress = data.find((addr) => addr.isDefault);
    if (defaultAddress) {
      setSelectedAddress(defaultAddress);
    }
  })
  .catch((err) => {
    console.error("Error fetching addresses:", err.message);
    setFetchError(err.message);
    if (err.message.includes('Unauthorized')) {
      localStorage.removeItem('trendify_token');
      navigate('/login', { state: { from: '/checkout/address' }, replace: true });
    }
  });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!loading && !orderDetails) {
      navigate('/cart', { replace: true });
    }
  }, [orderDetails, loading, navigate]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { state: { from: '/checkout/address' }, replace: true });
    }
  }, [user, loading, navigate]);

  const handleAddressSelected = useCallback((address) => {
    setSelectedAddress(address);
    setIsAddressModalOpen(false);
  }, []);

  const handleProceedToPayment = () => {
    if (!selectedAddress) {
      alert('Please select or add a delivery address.');
      return;
    }
    if (pinCode && selectedAddress.pincode !== pinCode) {
      alert('Selected address pincode does not match the entered pincode.');
      return;
    }
    navigate('/checkout/payment', {
      state: {
        orderDetails,
        selectedAddress,
      },
    });
  };

  if (loading) {
    return <div className="text-center p-8 text-lg text-gray-700">Checking authentication...</div>;
  }

  if (!user || !orderDetails) {
    return null;  // Redirect should handle this
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Select Delivery Address</h2>

      {fetchError && <p className="text-red-600 text-center mb-4">{fetchError}</p>}

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">Order Summary</h3>
        <div className="space-y-2 text-gray-700">
          {orderDetails.items?.map((item, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <span>
                {item.name} (x{item.quantity})
              </span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="border-t pt-2 mt-2 flex justify-between font-semibold text-lg text-gray-900">
            <span>Total Amount</span>
            <span>₹{orderDetails.totalPrice}</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">Your Delivery Address</h3>
        {selectedAddress ? (
          <div className="border p-4 rounded-lg bg-blue-50 border-blue-200 mb-4">
            <p className="font-semibold text-gray-800">
              {selectedAddress.fullName} {selectedAddress.isDefault && <span className="text-green-500 text-sm">(Default)</span>}
            </p>
            <p className="text-gray-700">
              {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state} -{' '}
              {selectedAddress.pincode}
            </p>
            <p className="text-gray-700">Mobile: {selectedAddress.mobileNumber}</p>
            <button
              onClick={() => setIsAddressModalOpen(true)}
              className="mt-2 text-blue-600 hover:underline text-sm"
            >
              Change Address
            </button>
          </div>
        ) : (
          <p className="text-gray-600 mb-4">No address selected.</p>
        )}

        <button
          onClick={() => setIsAddressModalOpen(true)}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md flex items-center gap-2"
        >
          <MapPin className="h-5 w-5" />
          {selectedAddress ? 'Add/Manage Addresses' : 'Select Delivery Address'}
        </button>

        <button
          onClick={handleProceedToPayment}
          className={`w-full mt-6 py-3 rounded-md font-semibold text-white transition-colors ${
            selectedAddress
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
          disabled={!selectedAddress}
        >
          Proceed to Payment
        </button>
      </div>

      {isAddressModalOpen && (
        <AddressModal
          isOpen={isAddressModalOpen}
          onClose={() => setIsAddressModalOpen(false)}
          onAddressSelect={handleAddressSelected}
          currentUser={user}
          selectedAddress={selectedAddress}
        />
      )}
    </div>
  );
};

export default AddressSelectionPage;