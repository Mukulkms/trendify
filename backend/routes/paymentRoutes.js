// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const { protect } = require('../middleware/authMiddleware'); // Ensure correct path
const crypto = require('crypto'); // Node's built-in crypto module

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create a Razorpay order
router.post('/create', protect, async (req, res) => {
  try {
    const { orderDetails, address } = req.body;

    if (!orderDetails || !orderDetails.totalPrice || !address) {
      return res.status(400).json({ message: 'Order details and address are required' });
    }

    // Access user details from req.user (populated by the 'protect' middleware)
    // IMPORTANT: Ensure your User model has these fields (fullname, email, mobileNumber)
    const user = {
      fullname: req.user.fullname,
      email: req.user.email,
      mobileNumber: req.user.mobileNumber,
    };

    // Validate if essential user details are present in the fetched user object
    if (!user.fullname || !user.email || !user.mobileNumber) {
        // This error message will be caught by the frontend
        return res.status(400).json({ message: 'User data (fullname, email, mobileNumber) is missing or incomplete in your profile. Please update your profile or contact support.' });
    }

    // --- START OF RECEIPT FIX ---
    // The previous receipt: `receipt_${Date.now()}_${req.user._id}` was too long.
    // Razorpay's 'receipt' field has a maximum length of 40 characters.
    // We'll create a shorter, still unique and identifiable receipt.
    // Get the last 8 characters of the user ID (enough for good identification)
    const userIdSuffix = req.user._id.toString().slice(-8);
    // Get the last 8 characters of the current timestamp (to ensure uniqueness)
    const shortTimestamp = Date.now().toString().slice(-8);

    // Combine them into a new receipt string.
    // Example: "rcpt_12345678_abcdefgh" (Length: 5 + 1 + 8 + 1 + 8 = 23 characters, well within 40)
    const receiptString = `rcpt_${shortTimestamp}_${userIdSuffix}`;
    // --- END OF RECEIPT FIX ---

    // Create Razorpay order
    const options = {
      amount: orderDetails.totalPrice * 100, // Amount in paise
      currency: 'INR',
      receipt: receiptString, // Use the newly generated shorter receipt
      notes: { // Notes can be longer than 40 characters, so full IDs are safe here
        userId: req.user._id.toString(), // Keep full user ID here for reference
        orderId: orderDetails._id ? orderDetails._id.toString() : 'N/A', // If you have an internal order ID
      }
    };

    console.log("Attempting to create Razorpay order with options:", options);

    const razorpayOrder = await razorpay.orders.create(options);

    // Return the Razorpay order details and validated user info to the frontend
    res.status(200).json({
      orderId: razorpayOrder.id,
      amount: orderDetails.totalPrice, // Send original total amount for frontend consistency
      currency: 'INR',
      user: user, // Pass the validated and extracted user details
    });
  } catch (err) {
    console.error('Error creating Razorpay order:', err);
    res.status(500).json({ message: 'Failed to create payment', error: err.message });
  }
});

// Verify payment (after successful payment on frontend)
router.post('/verify', protect, async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    // Generate expected signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    // Compare generated signature with the one received from Razorpay
    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed: Signature mismatch' });
    }

    // You can now proceed to update your order status in your database
    // For example:
    // const order = await Order.findOneAndUpdate(
    //   { razorpayOrderId: razorpay_order_id },
    //   { paymentStatus: 'paid', paymentId: razorpay_payment_id },
    //   { new: true }
    // );
    // if (!order) return res.status(404).json({ message: 'Order not found after payment' });

    res.status(200).json({ message: 'Payment verified successfully', orderId: razorpay_order_id, paymentId: razorpay_payment_id });

  } catch (err) {
    console.error('Error verifying payment:', err);
    res.status(500).json({ message: 'Payment verification failed', error: err.message });
  }
});

module.exports = router;