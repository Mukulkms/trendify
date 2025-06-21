// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../models/order'); // Adjust path as needed
const Product = require('../models/Product'); // Assuming you have a Product model for stock management
const { protect } = require('../middleware/authMiddleware'); // Your authentication middleware
const Razorpay = require('razorpay');

// Initialize Razorpay
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * @route POST /api/orders/create
 * @desc Create a new order after successful payment verification
 * @access Private
 *
 * This route is called by your frontend's OrderConfirmation page
 * AFTER Razorpay payment is successful and verified.
 */
router.post('/create', protect, async (req, res) => {
  const { items, totalPrice, discount, shippingAddress, razorpayOrderId, paymentId, paymentStatus } = req.body;
  const userId = req.user._id; // `req.user` comes from your `protect` middleware

  // Basic validation
  if (!items || items.length === 0 || !totalPrice || !shippingAddress || !razorpayOrderId || !paymentId || !paymentStatus) {
    return res.status(400).json({ message: 'Missing required order details.' });
  }

  try {
    // Optional: Decrement product stock (Implement carefully with transactions if high concurrency)
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item.productId} not found.` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}.` });
      }
      product.stock -= item.quantity;
      await product.save();
    }

    const newOrder = new Order({
      userId,
      items,
      totalPrice,
      discount,
      shippingAddress,
      razorpayOrderId,
      paymentId,
      paymentStatus, // Should be 'Paid' at this point
      orderStatus: 'Processing', // Initial order status
    });

    const createdOrder = await newOrder.save();

    res.status(201).json({
      message: 'Order placed successfully!',
      order: createdOrder,
    });

  } catch (error) {
    console.error('Error creating order:', error);
    // If stock update failed or order creation failed, consider rolling back stock (advanced)
    res.status(500).json({ message: 'Server error while creating order.' });
  }
});

/**
 * @route GET /api/orders/myorders
 * @desc Get all orders for the authenticated user
 * @access Private
 */
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
                               .populate('items.productId', 'name image'); // Populate product name and image
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Server error while fetching orders.' });
  }
});

/**
 * @route GET /api/orders/:id
 * @desc Get a single order by ID for the authenticated user
 * @access Private
 */
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user._id })
                              .populate('items.productId', 'name image');

    if (!order) {
      return res.status(404).json({ message: 'Order not found or you do not have permission to view it.' });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching single order:', error);
    res.status(500).json({ message: 'Server error while fetching order.' });
  }
});


module.exports = router;