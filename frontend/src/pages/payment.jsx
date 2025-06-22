import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MapPin,
  Package,
  CreditCard,
  AlertCircle,
  Loader2,
} from "lucide-react";

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { orderDetails, selectedAddress } = state || {};
  const [paymentError, setPaymentError] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (!orderDetails || !selectedAddress) {
      setPaymentError(
        "Order details or delivery address are missing. Please go back to cart."
      );
    }
  }, [orderDetails, selectedAddress, navigate]);

  const handleCompletePayment = async () => {
    setPaymentError(null);
    setIsProcessingPayment(true);

    try {
      const token = localStorage.getItem("trendify_token");
      if (!token) {
        setPaymentError(
          "Authentication token not found. Please log in to proceed with payment."
        );
        setIsProcessingPayment(false);
        return;
      }

      // 1. Create Payment Order on Backend
      const createResponse = await fetch(
        "http://localhost:5000/api/payment/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            orderDetails,
            address: selectedAddress,
          }),
        }
      );

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        if (createResponse.status === 401) {
          setPaymentError("Session expired. Please log in again.");
          localStorage.removeItem("trendify_token");
          navigate("/login", {
            state: { from: "/checkout/payment" },
            replace: true,
          });
        } else {
          throw new Error(
            errorData.message || "Failed to create payment order."
          );
        }
        return;
      }

      const {
        orderId, // This is Razorpay's order_id from the backend
        amount,
        currency,
        user: userDataFromBackend,
      } = await createResponse.json();

      if (
        !userDataFromBackend ||
        !userDataFromBackend.fullname ||
        !userDataFromBackend.email ||
        !userDataFromBackend.mobileNumber
      ) {
        throw new Error(
          "User data is missing or incomplete for payment prefill. Please update your profile."
        );
      }

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: currency,
        name: "Trendify E-commerce",
        description: `Payment for Order ID: ${orderId}`,
        order_id: orderId, // Pass the Razorpay order ID to the checkout
        prefill: {
          name: userDataFromBackend.fullname,
          email: userDataFromBackend.email,
          contact: userDataFromBackend.mobileNumber,
        },
        handler: async function (response) {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
            response;

          // 3. Verify Payment on Backend
          try {
            const verifyResponse = await fetch(
              "http://localhost:5000/api/payment/verify",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  razorpay_payment_id,
                  razorpay_order_id,
                  razorpay_signature,
                }),
              }
            );

            if (!verifyResponse.ok) {
              const verifyErrorData = await verifyResponse.json();
              throw new Error(
                verifyErrorData.message || "Payment verification failed."
              );
            }

            // Payment successfully verified
            alert("Payment successful! Your order has been placed.");
            navigate("/order-confirmation", {
              state: {
                // --- THE KEY FIX IS HERE ---
                // Pass Razorpay IDs using the keys expected by OrderConfirmation.jsx
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
                // Pass other essential data
                orderDetails,
                selectedAddress,
                paymentDate: new Date().toISOString(),
              },
            });
          } catch (verifyErr) {
            setPaymentError(
              verifyErr.message ||
                "Error verifying payment. Please contact support."
            );
            console.error("Payment verification error:", verifyErr);
            navigate("/payment-failed"); // Navigate to a dedicated failed page
          } finally {
            setIsProcessingPayment(false);
          }
        },
        theme: {
          color: "#4F46E5",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        setPaymentError(
          `Payment failed: ${response.error.description || "Unknown error."}`
        );
        console.error("Razorpay Payment Failed:", response.error);
        setIsProcessingPayment(false); // Reset processing state on failure
        // Optionally, navigate to a payment failed page or display a persistent error
        navigate("/payment-failed", {
            state: { errorMessage: response.error.description || "Payment failed. Please try again." }
        });
      });
      rzp.open();
    } catch (err) {
      setPaymentError(
        err.message ||
          "An unexpected error occurred during payment. Please try again."
      );
      console.error("Payment process error:", err);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // ... (rest of your component remains the same)
  if (!orderDetails || !selectedAddress) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-700">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
        <p className="text-xl font-semibold">Loading order details...</p>
        {paymentError && (
          <div
            className="mt-4 bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg flex items-center gap-3 shadow-sm"
            role="alert"
          >
            <AlertCircle className="h-6 w-6" />
            <p className="font-medium">{paymentError}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl text-gray-900 text-center mb-10 border-b-2 border-indigo-200 pb-4">
          Complete Your Payment
        </h2>

        {paymentError && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg flex items-center gap-3 mb-6 shadow-sm"
            role="alert"
          >
            <AlertCircle className="h-6 w-6" />
            <p className="font-medium">{paymentError}</p>
          </div>
        )}

        <div className="bg-white p-8 rounded-xl shadow-lg mb-8 border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-3 mb-6">
            <Package className="h-7 w-7 text-indigo-600" />
            Order Summary
          </h3>
          <div className="space-y-3 text-gray-700 text-base">
            {orderDetails.items?.length > 0 ? (
              orderDetails.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center pb-2 border-b border-gray-100 last:border-b-0 last:pb-0"
                >
                  <span className="flex-1 truncate pr-2">
                    {item.name}{" "}
                    <span className="font-medium text-gray-600">
                      (x{item.quantity})
                    </span>
                  </span>
                  <span className="font-semibold text-gray-900">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">
                No items found in this order.
              </p>
            )}

            {orderDetails.discount > 0 && (
              <div className="flex justify-between text-base font-medium text-green-600 pt-2">
                <span>Discount Applied</span>
                <span>-₹{orderDetails.discount.toFixed(2)}</span>
              </div>
            )}

            <div className="pt-4 mt-4 flex justify-between items-center font-bold text-2xl text-indigo-700 border-t-2 border-gray-100">
              <span>Total Amount</span>
              <span>₹{orderDetails.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg mb-8 border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-3 mb-6">
            <MapPin className="h-7 w-7 text-indigo-600" />
            Delivery Address
          </h3>
          <div className="p-5 rounded-lg border-2 border-indigo-500 bg-indigo-50 shadow-sm transition-all duration-300 transform hover:scale-[1.01]">
            <p className="font-bold text-gray-900 mb-1">
              {selectedAddress.fullName}
            </p>
            <p className="text-gray-700 text-sm leading-relaxed">
              {selectedAddress.fullAddress}, {selectedAddress.city},{" "}
              {selectedAddress.state} -{" "}
              <span className="font-semibold">{selectedAddress.pincode}</span>
            </p>
            <p className="text-gray-700 text-sm">
              Mobile: {selectedAddress.mobileNumber}
            </p>
          </div>
        </div>

        <button
          onClick={handleCompletePayment}
          className={`w-full mt-6 py-4 rounded-md font-bold text-white transition-all duration-300 transform shadow-lg
            ${
              isProcessingPayment
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.01]"
            }`}
          disabled={isProcessingPayment}
        >
          {isProcessingPayment ? (
            <span className="flex items-center justify-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin" /> Processing Payment...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-3">
              <CreditCard className="h-7 w-7" /> Pay with Razorpay
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;