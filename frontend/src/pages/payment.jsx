import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { orderDetails, selectedAddress } = state || {};

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!orderDetails || !selectedAddress) {
    return <div className="text-center p-8 text-lg text-gray-700">Invalid order details</div>;
  }

  const handleCompletePayment = async () => {
    try {
      const token = localStorage.getItem('trendify_token');
      if (!token) {
        alert('Please log in to proceed with payment');
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderDetails,
          address: selectedAddress,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 401) {
          alert('Session expired. Please log in again.');
          localStorage.removeItem('trendify_token');
          navigate('/login');
          return;
        }
        throw new Error(data.message || 'Failed to create payment');
      }

      const data = await response.json();
      const { orderId, amount, currency, user } = data;

      // Validate user object
      if (!user || !user.fullname || !user.email || !user.mobileNumber) {
        throw new Error('User data is missing or incomplete');
      }

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: currency,
        name: 'Trendify',
        description: 'Order Payment',
        order_id: orderId,
        prefill: {
          name: user.fullname,
          email: user.email,
          contact: user.mobileNumber,
        },
        handler: async function (response) {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;

          const verifyResponse = await fetch('http://localhost:5000/api/payment/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              razorpay_payment_id,
              razorpay_order_id,
              razorpay_signature,
            }),
          });

          if (!verifyResponse.ok) {
            const verifyData = await verifyResponse.json();
            throw new Error(verifyData.message || 'Payment verification failed');
          }

          alert('Payment successful! Order ID: ' + razorpay_order_id);
          navigate('/');
        },
        theme: {
          color: '#3B82F6',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        alert('Payment failed: ' + response.error.description);
      });
      rzp.open();
    } catch (err) {
      alert('Payment failed: ' + err.message);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Payment</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
        <div className="space-y-2 text-gray-700">
          {orderDetails.items?.map((item, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <span>
                {item.name} (x{item.quantity})
              </span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          {orderDetails.discount > 0 && (
            <div className="flex justify-between text-sm">
              <span>Discount</span>
              <span className="text-green-500">-₹{orderDetails.discount}</span>
            </div>
          )}
          <div className="border-t pt-2 mt-2 flex justify-between font-semibold text-lg text-gray-900">
            <span>Total Amount</span>
            <span>₹{orderDetails.totalPrice}</span>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-4">Delivery Address</h3>
        <div className="border p-4 rounded-lg bg-blue-50 border-blue-200">
          <p className="font-semibold text-gray-800">{selectedAddress.fullName}</p>
          <p className="text-gray-700">
            {selectedAddress.fullAddress}, {selectedAddress.city}, {selectedAddress.state} -{' '}
            {selectedAddress.pincode}
          </p>
          <p className="text-gray-700">Mobile: {selectedAddress.mobileNumber}</p>
        </div>

        <button
          onClick={handleCompletePayment}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md"
        >
          Pay with Razorpay
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;