import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/Auth/AuthContext';
import AddressModal from '../components/AddressModal';
import {
  MapPin,
  ShoppingBag,
  CheckCircle,
  PlusCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react';

const AddressSelectionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { orderDetails, pinCode } = location.state || {};

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [isFetchingAddresses, setIsFetchingAddresses] = useState(true);

  // Helper function to format address for consistency across pages
  const formatAddressForCheckout = useCallback((address) => {
    if (!address) return null;

    // *** CRITICAL FIX HERE: Directly use address.fullAddress ***
    // Your backend provides 'fullAddress' as the single comprehensive field.
    // Do NOT try to rebuild it from 'houseNumber', 'street', 'landmark' if those
    // fields do not exist in your actual address objects from the backend.
    const formattedFullAddress = address.fullAddress || '';

    return {
      ...address, // Keep all original properties
      fullName: address.fullName || address.name || '', // Ensure fullName is present
      fullAddress: formattedFullAddress.trim(), // Use the existing fullAddress directly
      mobileNumber: address.mobileNumber || address.mobile || address.phone || '', // Ensure mobileNumber is consistent
      city: address.city || '',
      state: address.state || '',
      pincode: address.pincode || '',
      country: address.country || 'India', // Ensure country is present
    };
  }, []); // Dependencies for useCallback. If these default values ever change, add them here.

  useEffect(() => {
    if (user) {
      setIsFetchingAddresses(true);
      setFetchError(null);
      const token = localStorage.getItem('trendify_token');

      if (!token) {
        setFetchError('Authentication token not found. Please log in to view addresses.');
        setIsFetchingAddresses(false);
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
            const text = await response.text();
            console.error('Raw response on GET /api/addresses error:', text);
            let errorMessage = 'Failed to fetch addresses. Please try again.';
            if (response.status === 401) {
              errorMessage = 'Session expired. Please log in again.';
            } else if (response.status === 404) {
              errorMessage = 'No addresses found for your account.';
            }
            throw new Error(errorMessage);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Fetched raw addresses from backend:", data); // Log raw data
          // Format all fetched addresses using the simplified function
          const formattedAddresses = data.map(formatAddressForCheckout);
          setAddresses(formattedAddresses); // Store formatted addresses
          const defaultAddr = formattedAddresses.find((addr) => addr.isDefault) || (formattedAddresses.length > 0 ? formattedAddresses[0] : null);
          setSelectedAddress(defaultAddr);
          console.log("Selected formatted address for checkout:", defaultAddr); // Log formatted selected address
        })
        .catch((err) => {
          console.error("Error fetching addresses:", err.message);
          setFetchError(err.message);
          if (err.message.includes('Session expired') || err.message.includes('Unauthorized')) {
            localStorage.removeItem('trendify_token');
            navigate('/login', { state: { from: '/checkout/address' }, replace: true });
          }
        })
        .finally(() => {
          setIsFetchingAddresses(false);
        });
    }
  }, [user, navigate, formatAddressForCheckout]);

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
    // Ensure the selected address from modal is also formatted
    setSelectedAddress(formatAddressForCheckout(address));
    setIsAddressModalOpen(false);
  }, [formatAddressForCheckout]);

  const handleProceedToPayment = () => {
    if (!selectedAddress) {
      setFetchError('Please select or add a delivery address to proceed.');
      return;
    }
    // Optional: Pincode validation based on initial pincode entered
    if (pinCode && selectedAddress.pincode.toString() !== pinCode.toString()) {
      setFetchError(`Selected address pincode (${selectedAddress.pincode}) does not match the entered pincode (${pinCode}). Please choose an address with the matching pincode.`);
      return;
    }

    // THIS IS THE CRITICAL NAVIGATION POINT
    console.log("Navigating to payment with selectedAddress:", selectedAddress); // Final check before navigation
    navigate('/checkout/payment', {
      state: {
        orderDetails,
        selectedAddress, // This 'selectedAddress' object now has 'fullAddress'
      },
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-700">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
        <p className="text-xl font-semibold">Loading authentication data...</p>
      </div>
    );
  }

  if (!user || !orderDetails) {
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl  text-gray-900 text-center mb-10 border-b-2 border-indigo-200 pb-4">
          Select Delivery Address
        </h2>

        {fetchError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg flex items-center gap-3 mb-6 shadow-sm" role="alert">
            <AlertCircle className="h-6 w-6" />
            <p className="font-medium">{fetchError}</p>
          </div>
        )}

        {/* Order Summary Card */}
        <div className="bg-white p-7 rounded-xl shadow-lg mb-8 border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-3 mb-6">
            <ShoppingBag className="h-7 w-7 text-indigo-600" />
            Order Summary
          </h3>
          <div className="space-y-3 text-gray-700 text-base">
            {orderDetails.items?.length > 0 ? (
              orderDetails.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center pb-2 border-b border-gray-100 last:border-b-0 last:pb-0">
                  <span className="flex-1 truncate pr-2">
                    {item.name} <span className="font-medium text-gray-600">(x{item.quantity})</span>
                  </span>
                  <span className="font-semibold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No items in the order summary.</p>
            )}
            <div className="pt-4 mt-4 flex justify-between items-center font-bold text-xl text-blue-700 border-t-2 border-gray-100">
              <span>Total Amount</span>
              <span>₹{orderDetails.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Delivery Address Selection Card */}
        <div className="bg-white p-7 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-3 mb-6">
            <MapPin className="h-7 w-7 text-indigo-600" />
            Your Delivery Address
          </h3>

          {isFetchingAddresses ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-3" />
              <p className="text-lg">Fetching your addresses...</p>
            </div>
          ) : selectedAddress ? (
            // Display using formatted fields
            <div className="relative p-5 rounded-lg border-2 border-indigo-500 bg-indigo-50 shadow-sm mb-6 transition-all duration-300 transform hover:scale-[1.01]">
              <CheckCircle className="absolute top-3 right-3 h-6 w-6 text-indigo-600" />
              <p className="font-bold text-gray-900 mb-1 flex items-center">
                {selectedAddress.fullName}
                {selectedAddress.isDefault && (
                  <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-xs font-medium text-green-700">
                    Default
                  </span>
                )}
              </p>
              <p className="text-gray-700 text-sm leading-relaxed">
                {/* Now confidently use selectedAddress.fullAddress here */}
                {selectedAddress.fullAddress}, {selectedAddress.city}, {selectedAddress.state} -{' '}
                <span className="font-semibold">{selectedAddress.pincode}</span>
              </p>
              <p className="text-gray-700 text-sm">Mobile: {selectedAddress.mobileNumber}</p>
              <button
                onClick={() => setIsAddressModalOpen(true)}
                className="mt-4 text-indigo-600 hover:underline text-sm font-medium inline-flex items-center gap-1"
              >
                <MapPin className="h-4 w-4" /> Change Address
              </button>
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-600 flex flex-col items-center justify-center mb-6 border border-dashed border-gray-300">
              <MapPin className="text-gray-400 text-5xl mb-4" />
              <p className="text-xl font-medium mb-2">No Address Selected or Found</p>
              <p className="text-base text-gray-500">
                Please add a new address or select an existing one to proceed with your order.
              </p>
            </div>
          )}

          <button
            onClick={() => setIsAddressModalOpen(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md flex items-center justify-center gap-3 text-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <PlusCircle className="h-6 w-6" />
            {selectedAddress ? 'Add or Manage Addresses' : 'Select or Add Delivery Address'}
          </button>

          <button
            onClick={handleProceedToPayment}
            className={`w-full mt-6 py-4 rounded-md font-bold text-white transition-all duration-300 transform ${
              selectedAddress
                ? 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:scale-[1.01]'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
            disabled={!selectedAddress}
          >
            Proceed to Payment
          </button>
        </div>
      </div>

      {/* Address Modal */}
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