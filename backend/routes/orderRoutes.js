// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../models/order'); // Adjust path as needed
const Product = require('../models/Product'); // Assuming you have a Product model for stock management
const { protect, adminOnly, superAdminOnly } = require('../middleware/authMiddleware'); // Import your specific middlewares
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
 */
router.post('/create', protect, async (req, res) => {
  const { items, totalPrice, discount, shippingAddress, razorpayOrderId, paymentId, paymentStatus } = req.body;
  const userId = req.user._id;

  if (!items || items.length === 0 || !totalPrice || !shippingAddress || !razorpayOrderId || !paymentId || !paymentStatus) {
    return res.status(400).json({ message: 'Missing required order details.' });
  }

  try {
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
      paymentStatus,
      orderStatus: 'Processing',
    });

    const createdOrder = await newOrder.save();

    res.status(201).json({
      message: 'Order placed successfully!',
      order: createdOrder,
    });

  } catch (error) {
    console.error('Error creating order:', error);
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
                               .populate('items.productId', 'name image');
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Server error while fetching orders.' });
  }
});

/**
 * @route GET /api/orders
 * @desc Get all orders (for admin dashboard)
 * @access Private (Admin or Super-Admin Only)
 *
 * This route now uses both protect and a combined check for admin/super-admin.
 */
router.get('/', protect, (req, res, next) => {
    // This custom middleware checks if the user is either an 'admin' or 'super-admin'
    if (req.user && (req.user.role === 'admin' || req.user.role === 'super-admin')) {
      next(); // Authorized, proceed
    } else {
      res.status(403).json({ message: "Not authorized to access this resource. Admin or Super Admin role required." });
    }
}, async (req, res) => {
  try {
    // We remove the userId filter to get all orders
    // Populate userId for 'fullname', 'email', 'profilePic' and items.productId for 'name', 'image'
    const orders = await Order.find({})
                               .populate('userId', 'fullname email profilePic')
                               .populate('items.productId', 'name image');
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching all orders for admin:', error);
    res.status(500).json({ message: 'Server error while fetching all orders.' });
  }
});

/**
 * @route PUT /api/orders/:id
 * @desc Update order status (for admin)
 * @access Private (Admin or Super-Admin Only)
 *
 * This route handles status updates. Ensure it is placed after more specific
 * routes if any other PUT /api/orders/:id routes exist for different purposes.
 */
router.put('/:id', protect, (req, res, next) => { // <--- THIS IS THE CHANGED LINE
    // This custom middleware checks if the user is either an 'admin' or 'super-admin'
    if (req.user && (req.user.role === 'admin' || req.user.role === 'super-admin')) {
      next(); // Authorized, proceed
    } else {
      res.status(403).json({ message: "Not authorized to access this resource. Admin or Super Admin role required." });
    }
}, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
          return res.status(404).json({ message: 'Order not found.' });
        }

        // Ensure only orderStatus is updated here, as per your frontend's request body
        if (req.body.orderStatus) {
            order.orderStatus = req.body.orderStatus;
        } else {
            // This is a safeguard if the frontend sends a request without orderStatus
            return res.status(400).json({ message: 'Order status field is missing from request body.' });
        }

        await order.save();

        // Re-populate to send back complete data if the frontend expects it
        const updatedOrder = await Order.findById(req.params.id)
                                       .populate('userId', 'fullname email profilePic')
                                       .populate('items.productId', 'name image');

        res.json(updatedOrder); // Send back the fully updated order
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Server error while updating order status.' });
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