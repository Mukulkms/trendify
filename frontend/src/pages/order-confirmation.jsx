// pages/OrderConfirmationPage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, MapPin, CreditCard, Calendar, ArrowLeft, Download, Mail, Loader2, AlertCircle } from 'lucide-react';

const OrderConfirmationPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // State to manage the process of saving the order to the backend
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle', 'saving', 'success', 'error'
  const [backendOrderId, setBackendOrderId] = useState(null);
  const [orderPaymentStatus, setOrderPaymentStatus] = useState('Pending'); // Initial status, will be updated from backend
  const [errorMessage, setErrorMessage] = useState('');

  // Destructure the order data passed from PaymentPage
  const {
    orderDetails, // Contains items, totalPrice, discount
    selectedAddress, // This object should now consistently have `fullAddress`
    paymentDate: providedPaymentDate, // Date when payment was completed
    razorpayOrderId: initialRazorpayOrderId, // From Razorpay success callback
    razorpayPaymentId: initialRazorpayPaymentId, // From Razorpay success callback
  } = state || {};

  // --- Debugging Logs (can remove in production) ---
  useEffect(() => {
    console.log('OrderConfirmationPage: State received:', state);
    console.log('OrderConfirmationPage: orderDetails:', orderDetails);
    console.log('OrderConfirmationPage: selectedAddress:', selectedAddress);
    console.log('OrderConfirmationPage: Razorpay Order ID:', initialRazorpayOrderId);
    console.log('OrderConfirmationPage: Razorpay Payment ID:', initialRazorpayPaymentId);
  }, [state, orderDetails, selectedAddress, initialRazorpayOrderId, initialRazorpayPaymentId]);
  // --- End Debugging Logs ---

  // Function to process and save the order to your backend
  const processOrder = useCallback(async () => {
    setSaveStatus('saving');
    setErrorMessage(''); // Clear previous errors

    try {
      const token = localStorage.getItem('trendify_token');
      if (!token) {
        console.error('Authentication token not found. User might not be logged in.');
        setErrorMessage('Authentication required. Please log in.');
        setSaveStatus('error');
        // Optionally redirect to login
        navigate('/login', { state: { from: '/order-confirmation' }, replace: true });
        return;
      }

      const backendBaseUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';

      // Validate essential data before sending to backend
      if (!orderDetails || !selectedAddress || !initialRazorpayOrderId || !initialRazorpayPaymentId) {
        throw new Error('Crucial order data is missing. Cannot save order.');
      }

      // Ensure selectedAddress has the necessary fields for the backend
      const requiredAddressFields = ['fullName', 'fullAddress', 'city', 'state', 'pincode', 'mobileNumber', 'country'];
      const missingAddressFields = requiredAddressFields.filter(field => 
        !selectedAddress[field] || String(selectedAddress[field]).trim() === ''
      );

      if (missingAddressFields.length > 0) {
        throw new Error(`Incomplete shipping address provided. Missing: ${missingAddressFields.join(', ')}.`);
      }

      // Prepare the order data to send to your backend
      const orderData = {
        items: orderDetails.items.map(item => ({
          productId: item.productId, // Make sure this exists and is correct
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        totalPrice: orderDetails.totalPrice,
        discount: orderDetails.discount || 0,
        shippingAddress: {
          fullName: selectedAddress.fullName,
          mobileNumber: selectedAddress.mobileNumber,
          fullAddress: selectedAddress.fullAddress,
          city: selectedAddress.city,
          state: selectedAddress.state,
          pincode: selectedAddress.pincode,
          country: selectedAddress.country || 'India', // Default to India if not explicitly set
        },
        razorpayOrderId: initialRazorpayOrderId,
        paymentId: initialRazorpayPaymentId,
        paymentStatus: 'Paid', // Assuming Razorpay confirmed payment
      };

      console.log('Sending final order data to backend:', orderData);

      const createOrderResponse = await fetch(`${backendBaseUrl}/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const createOrderData = await createOrderResponse.json();

      if (!createOrderResponse.ok) {
        const backendError = createOrderData.message || `Failed to create order on backend: ${createOrderResponse.status}`;
        throw new Error(backendError);
      }

      console.log('Order successfully saved on backend:', createOrderData);

      // Update state with backend's order ID and status
      if (createOrderData.order && createOrderData.order._id) {
        setBackendOrderId(createOrderData.order._id);
        setOrderPaymentStatus(createOrderData.order.paymentStatus || 'Paid'); // Use status from backend
        setSaveStatus('success');
      } else {
        throw new Error('Backend did not return a valid order ID.');
      }

    } catch (error) {
      console.error('Error during order confirmation process:', error);
      setErrorMessage(error.message || 'An unexpected error occurred while confirming your order.');
      setSaveStatus('error');
    }
  }, [orderDetails, selectedAddress, initialRazorpayOrderId, initialRazorpayPaymentId, navigate]);

  // Effect to trigger `processOrder` when component mounts or dependencies change
  useEffect(() => {
    // Only attempt to save if essential data is present and we haven't tried saving yet
    if (
      orderDetails &&
      selectedAddress &&
      initialRazorpayOrderId &&
      initialRazorpayPaymentId &&
      saveStatus === 'idle'
    ) {
      processOrder();
    }
  }, [orderDetails, selectedAddress, initialRazorpayOrderId, initialRazorpayPaymentId, saveStatus, processOrder]);


  // Effect to redirect if essential data is missing from state (e.g., direct access)
  useEffect(() => {
    if (!orderDetails || !selectedAddress || !initialRazorpayOrderId || !initialRazorpayPaymentId) {
      console.warn("OrderConfirmationPage: Missing critical order data. Redirecting to cart.");
      navigate('/cart', { replace: true }); // Use replace to prevent back navigation loop
    }
  }, [orderDetails, selectedAddress, initialRazorpayOrderId, initialRazorpayPaymentId, navigate]);

  // Determine which order/payment IDs to display
  const displayOrderId = backendOrderId || initialRazorpayOrderId || 'N/A';
  const displayPaymentId = initialRazorpayPaymentId || 'N/A';
  const displayPaymentDate = providedPaymentDate ? new Date(providedPaymentDate).toLocaleString() : new Date().toLocaleString();


  // --- Render logic for different states ---
  if (!orderDetails || !selectedAddress || !initialRazorpayOrderId || !initialRazorpayPaymentId || saveStatus === 'saving') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4 text-gray-700">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
        <p className="text-xl font-semibold">
          {saveStatus === 'saving' ? 'Finalizing your order...' : 'Loading order details...'}
        </p>
        {errorMessage && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg flex items-center gap-3 shadow-sm" role="alert">
            <AlertCircle className="h-6 w-6" />
            <p className="font-medium">{errorMessage}</p>
          </div>
        )}
      </div>
    );
  }

  // Main content after successful load/save
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Success Animation Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <div className="relative">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-lg text-gray-600">Thank you for your purchase. Your order is being processed.</p>
          {saveStatus === 'success' && (
            <p className="text-sm text-green-500 mt-2">Order successfully recorded in our system!</p>
          )}
          {errorMessage && (
            <p className="text-sm text-red-500 mt-2 font-semibold">Error: {errorMessage}</p>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Details
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Your Order ID</p>
                    <p className="font-mono text-sm font-semibold text-gray-900">{displayOrderId}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Razorpay Payment ID</p>
                    <p className="font-mono text-sm font-semibold text-gray-900">{displayPaymentId}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {displayPaymentDate}
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${orderPaymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    <div className={`w-2 h-2 ${orderPaymentStatus === 'Paid' ? 'bg-green-400' : 'bg-yellow-400'} rounded-full mr-2`}></div>
                    {orderPaymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            {orderDetails && orderDetails.items?.length > 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Items in Your Order</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {orderDetails.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-4">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-sm text-gray-600">₹{item.price.toFixed(2)} each</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    {orderDetails.discount > 0 && (
                      <div className="flex justify-between items-center mb-2 text-green-600 font-medium">
                        <span>Discount Applied</span>
                        <span>-₹{orderDetails.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Total Amount Paid</span>
                      <span className="text-2xl font-bold text-indigo-600">₹{orderDetails.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center text-gray-600">
                <p>No items found for this order. This shouldn't happen, please contact support.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Shipping Address */}
            {selectedAddress ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Shipping Address
                  </h3>
                </div>
                <div className="p-4">
                  <div className="space-y-1 text-sm">
                    <p className="font-medium text-gray-900">{selectedAddress.fullName}</p>
                    <p className="text-gray-600">{selectedAddress.fullAddress}</p>
                    <p className="text-gray-600">{selectedAddress.city}, {selectedAddress.state} - <span className="font-semibold">{selectedAddress.pincode}</span></p>
                    <p className="text-gray-600">Mobile: {selectedAddress.mobileNumber}</p>
                    <p className="text-gray-600">Country: {selectedAddress.country || 'India'}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center text-gray-600">
                <p>No shipping address details found.</p>
              </div>
            )}

            {/* Payment Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Payment Information
                </h3>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`text-sm font-medium ${orderPaymentStatus === 'Paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {orderPaymentStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-600">Method</span>
                  <span className="text-sm font-medium text-gray-900">Razorpay (Online Payment)</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => alert('Invoice download not implemented yet!')} // Placeholder for actual download logic
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Invoice
              </button>
              <button
                onClick={() => alert('Email receipt not implemented yet!')} // Placeholder for actual email logic
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Email Receipt
              </button>
              <button
                onClick={() => navigate('/my-orders')} // Navigate to a page showing all user orders
                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 border border-gray-300"
              >
                <ArrowLeft className="w-4 h-4" />
                Go to My Orders
              </button>
              <button
                onClick={() => navigate('/')} // Navigate back to home
                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 border border-gray-300"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;