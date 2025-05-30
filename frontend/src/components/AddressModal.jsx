import React, { useState, useEffect } from "react";

const AddressModal = ({
  isOpen,
  onClose,
  onAddressSubmit, // This prop handles both add and edit success
  onAddressSelect, // This prop is specifically for selecting an address (used by AddressSelectionPage)
  currentUser,
  addressToEdit = null, // New prop: the address object to pre-fill for editing
  mode = "select", // New prop: 'select', 'add', or 'edit'
  selectedAddress, // Existing prop for marking selected address in 'select' mode
}) => {
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState({
    // Renamed from newAddress to formData for versatility
    fullName: "",
    mobileNumber: "",
    fullAddress: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    isDefault: false,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false); // Controls showing the form vs. address list

  // Effect to fetch addresses when the modal is opened AND in 'select' mode
  useEffect(() => {
    if (isOpen && currentUser && mode === "select") {
      const token = localStorage.getItem("trendify_token");
      if (!token) {
        // If no token, redirect to login (consider using navigate hook from react-router-dom)
        window.location.href = "/login";
        return;
      }

      setLoading(true);
      setError(null);

      fetch("http://localhost:5000/api/addresses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(async (response) => {
          if (!response.ok) {
            const text = await response.text();
            console.error(
              "Raw response on GET /api/addresses error (modal):",
              text
            );
            if (response.status === 401) {
              localStorage.removeItem("trendify_token");
              window.location.href = "/login";
              throw new Error("Unauthorized: Please log in again.");
            }
            throw new Error("Failed to fetch addresses.");
          }
          return response.json();
        })
        .then((data) => {
          setAddresses(data);
        })
        .catch((err) => {
          setError(err.message);
          console.error("Error fetching addresses in modal:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, currentUser, mode]);

  // Effect to set form data for editing or reset for adding
  useEffect(() => {
    if (isOpen) {
      setError(null); // Clear errors on open
      if (mode === "edit" && addressToEdit) {
        setFormData({
          fullName: addressToEdit.fullName || "",
          mobileNumber: addressToEdit.mobileNumber || "",
          fullAddress: addressToEdit.fullAddress || "",
          city: addressToEdit.city || "",
          state: addressToEdit.state || "",
          pincode: addressToEdit.pincode || "",
          country: addressToEdit.country || "India",
          isDefault: addressToEdit.isDefault || false,
        });
        setShowForm(true); // Always show form if in 'edit' mode
      } else if (mode === "add") {
        // Reset form for new address
        setFormData({
          fullName: "",
          mobileNumber: "",
          fullAddress: "",
          city: "",
          state: "",
          pincode: "",
          country: "India",
          isDefault: false,
        });
        setShowForm(true); // Always show form if in 'add' mode
      } else if (mode === "select") {
        // In select mode, start by showing list, allow user to click 'Add New'
        setShowForm(false);
      }
    }
  }, [isOpen, mode, addressToEdit]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    setFormData((prev) => ({ ...prev, isDefault: e.target.checked }));
  };

  const validateForm = () => {
    if (!formData.fullName) return "Full name is required";
    if (!formData.mobileNumber || !/^\d{10}$/.test(formData.mobileNumber))
      return "A valid 10-digit mobile number is required";
    if (!formData.fullAddress) return "Full address is required";
    if (!formData.city) return "City is required";
    if (!formData.state) return "State is required";
    if (!formData.pincode || !/^\d{6}$/.test(formData.pincode))
      return "Pincode must be a valid 6-digit number";
    if (!formData.country) return "Country is required";
    return null; // No error
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    const token = localStorage.getItem("trendify_token");
    if (!token) {
      window.location.href = "/login";
      setLoading(false);
      return;
    }

    // Add userId if it's not already handled by backend middleware from token
    const addressData = {
      ...formData,
      // userId: currentUser?._id, // Generally handled by auth middleware on backend
    };

    const url =
      mode === "add"
        ? "http://localhost:5000/api/addresses"
        : `http://localhost:5000/api/addresses/${addressToEdit._id}`;
    const method = mode === "add" ? "POST" : "PUT";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addressData),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error(`Raw response on ${method} /api/addresses error:`, text);
        if (response.status === 401) {
          localStorage.removeItem("trendify_token");
          window.location.href = "/login";
          throw new Error("Unauthorized: Please log in again.");
        }
        let errorMessage = `Failed to ${mode} address`;
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          console.error("Error parsing error response:", parseError);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      alert(`Address ${mode === "add" ? "added" : "updated"} successfully!`);

      // Trigger the parent's callback to refresh addresses (for MyAddressesPage)
      // or select the new address (for AddressSelectionPage in 'add' scenario)
      if (onAddressSubmit) {
        onAddressSubmit(data);
      } else if (onAddressSelect && mode === "add") {
        // For AddressSelectionPage adding a new address
        onAddressSelect(data);
      }

      onClose(); // Close modal on success
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAddressAndClose = (address) => {
    if (onAddressSelect) {
      onAddressSelect(address);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          &times;
        </button>
        <h3 className="text-xl font-semibold mb-4 text-gray-900 text-center">
          {mode === "select" && !showForm
            ? "Select an Address"
            : mode === "add" || showForm
            ? "Add New Address"
            : "Edit Address"}
        </h3>

        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        {loading && mode === "select" && !showForm ? (
          <p className="text-gray-600 text-center">Loading addresses...</p>
        ) : // Logic for displaying existing addresses (only in 'select' mode)
        mode === "select" && !showForm ? (
          <>
            {addresses.length === 0 ? (
              <p className="text-gray-600 mb-4">
                No addresses found. Add a new address below.
              </p>
            ) : (
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                {" "}
                {/* Added pr-2 for scrollbar */}
                {addresses.map((address) => (
                  <div
                    key={address._id}
                    className={`border p-4 rounded-lg cursor-pointer transition-all duration-200 ease-in-out ${
                      selectedAddress?._id === address._id
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                    onClick={() => handleSelectAddressAndClose(address)}
                  >
                    <p className="font-semibold text-gray-800">
                      {address.fullName}{" "}
                      {address.isDefault && (
                        <span className="text-green-500 text-sm font-medium">
                          (Default)
                        </span>
                      )}
                    </p>
                    <p className="text-gray-700 text-sm">
                      {address.fullAddress}, {address.city}, {address.state} -{" "}
                      {address.pincode}
                    </p>
                    <p className="text-gray-700 text-sm">
                      Mobile: {address.mobileNumber}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => setShowForm(true)} // Allow adding new address from select mode
              className="mt-4 text-blue-600 hover:underline font-medium flex items-center gap-1"
            >
              + Add New Address
            </button>
          </>
        ) : (
          // Logic for displaying the Add/Edit form
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Full Name"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="mobileNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Mobile Number
              </label>
              <input
                type="text"
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                placeholder="Mobile Number"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                maxLength={10}
                required
              />
            </div>
            <div>
              <label
                htmlFor="fullAddress"
                className="block text-sm font-medium text-gray-700"
              >
                Full Address (House No, Building, Street, Area)
              </label>
              <input
                type="text"
                id="fullAddress"
                name="fullAddress"
                value={formData.fullAddress}
                onChange={handleInputChange}
                placeholder="House No, Building, Street, Area"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="pincode"
                  className="block text-sm font-medium text-gray-700"
                >
                  Pincode
                </label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  placeholder="Pincode"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  maxLength={6}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700"
                >
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700"
                >
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="State"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700"
                >
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Country"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-gray-900">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              Set as Default Address
            </label>
            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                className={`flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-white font-semibold ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                disabled={loading}
              >
                {loading
                  ? mode === "add" || showForm
                    ? "Adding..."
                    : "Updating..."
                  : mode === "add" || showForm
                  ? "Add Address"
                  : "Update Address"}
              </button>
              {((mode === "select" && showForm) || mode === "edit") && (
                <button
                  type="button"
                  onClick={() => {
                    if (mode === "select") {
                      setShowForm(false); // Go back to list in select mode
                    } else {
                      onClose(); // Close directly in add/edit mode from MyAddressesPage
                    }
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md font-semibold"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}

        {/* Only show "Close" button if not in form view in select mode */}
        {mode === "select" && !showForm && (
          <button
            onClick={onClose}
            className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md font-semibold"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default AddressModal;
