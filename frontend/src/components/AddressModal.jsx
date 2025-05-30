import React, { useState, useEffect } from 'react';

const AddressModal = ({ isOpen, onClose, onAddressSelect, currentUser, selectedAddress }) => {
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    mobileNumber: '',
    fullAddress: '', // Renamed from street to fullAddress
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    isDefault: false,
  });
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (isOpen && currentUser) {
      const token = localStorage.getItem('trendify_token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      fetch('http://localhost:5000/api/addresses', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(async (response) => {
          if (!response.ok) {
            const text = await response.text();
            console.log('Raw response on GET /api/addresses error (modal):', text);
            if (response.status === 401) {
              localStorage.removeItem('trendify_token');
              window.location.href = '/login';
              return;
            }
            throw new Error('Failed to fetch addresses');
          }
          return response.json();
        })
        .then((data) => {
          setAddresses(data);
        })
        .catch((err) => {
          setError(err.message);
        });
    }
  }, [isOpen, currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    setNewAddress((prev) => ({ ...prev, isDefault: e.target.checked }));
  };

  const handleAddAddress = async () => {
    if (!newAddress.fullName) {
      setError('Full name is required');
      return;
    }
    if (!newAddress.mobileNumber || !/^\d{10}$/.test(newAddress.mobileNumber)) {
      setError('A valid 10-digit mobile number is required');
      return;
    }
    if (!newAddress.fullAddress) { // Updated validation
      setError('Full address is required');
      return;
    }
    if (!newAddress.city) {
      setError('City is required');
      return;
    }
    if (!newAddress.state) {
      setError('State is required');
      return;
    }
    if (!newAddress.pincode || !/^\d{6}$/.test(newAddress.pincode)) {
      setError('Pincode must be a valid 6-digit number');
      return;
    }
    if (!newAddress.country) {
      setError('Country is required');
      return;
    }

    const token = localStorage.getItem('trendify_token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    if (!currentUser || !currentUser._id) {
      setError('User not authenticated');
      window.location.href = '/login';
      return;
    }

    // Add userId to the address data
    const addressData = {
      ...newAddress,
      userId: currentUser._id, // Add userId from currentUser
    };

    try {
      const response = await fetch('http://localhost:5000/api/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addressData), // Send updated address data with userId
      });

      if (!response.ok) {
        const text = await response.text();
        console.log('Raw response on POST /api/addresses error:', text);
        if (response.status === 401) {
          localStorage.removeItem('trendify_token');
          window.location.href = '/login';
          return;
        }
        let errorMessage = 'Failed to add address';
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setAddresses((prev) => [...prev, data]);
      setNewAddress({
        fullName: '',
        mobileNumber: '',
        fullAddress: '', // Updated
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        isDefault: false,
      });
      setShowForm(false);
      setError('');
      onAddressSelect(data);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">
          {showForm ? 'Add New Address' : 'Select an Address'}
        </h3>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {!showForm ? (
          <>
            {addresses.length === 0 ? (
              <p className="text-gray-600 mb-4">No addresses found. Add a new address below.</p>
            ) : (
              <div className="space-y-4 max-h-60 overflow-y-auto">
                {addresses.map((address) => (
                  <div
                    key={address._id}
                    className={`border p-4 rounded-lg cursor-pointer ${
                      selectedAddress?._id === address._id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200'
                    }`}
                    onClick={() => onAddressSelect(address)}
                  >
                    <p className="font-semibold text-gray-800">
                      {address.fullName} {address.isDefault && <span className="text-green-500 text-sm">(Default)</span>}
                    </p>
                    <p className="text-gray-700">
                      {address.fullAddress}, {address.city}, {address.state} - {address.pincode}
                    </p>
                    <p className="text-gray-700">Mobile: {address.mobileNumber}</p>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-blue-600 hover:underline"
            >
              + Add New Address
            </button>
          </>
        ) : (
          <div className="space-y-4">
            <input
              type="text"
              name="fullName"
              value={newAddress.fullName}
              onChange={handleInputChange}
              placeholder="Full Name"
              className="border rounded-md p-2 w-full"
            />
            <input
              type="text"
              name="mobileNumber"
              value={newAddress.mobileNumber}
              onChange={handleInputChange}
              placeholder="Mobile Number"
              className="border rounded-md p-2 w-full"
              maxLength={10}
            />
            <input
              type="text"
              name="fullAddress" // Updated from street to fullAddress
              value={newAddress.fullAddress}
              onChange={handleInputChange}
              placeholder="Full Address"
              className="border rounded-md p-2 w-full"
            />
            <input
              type="text"
              name="pincode"
              value={newAddress.pincode}
              onChange={handleInputChange}
              placeholder="Pincode"
              className="border rounded-md p-2 w-full"
              maxLength={6}
            />
            <input
              type="text"
              name="city"
              value={newAddress.city}
              onChange={handleInputChange}
              placeholder="City"
              className="border rounded-md p-2 w-full"
            />
            <input
              type="text"
              name="state"
              value={newAddress.state}
              onChange={handleInputChange}
              placeholder="State"
              className="border rounded-md p-2 w-full"
            />
            <input
              type="text"
              name="country"
              value={newAddress.country}
              onChange={handleInputChange}
              placeholder="Country"
              className="border rounded-md p-2 w-full"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isDefault"
                checked={newAddress.isDefault}
                onChange={handleCheckboxChange}
                className="h-5 w-5 text-blue-600"
              />
              Set as Default Address
            </label>
            <div className="flex gap-4">
              <button
                onClick={handleAddAddress}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
              >
                Add Address
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md"
              >
                Back
              </button>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AddressModal;