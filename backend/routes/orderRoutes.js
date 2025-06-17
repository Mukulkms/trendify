// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Order = require('../models/order'); // Assume you have an Order model
const Product = require('../models/Product'); // Assume you have a Product model

// Create a new order
router.post('/create', protect, async (req, res) => {
  try {
    const { items, address, totalPrice, razorpayOrderId } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order items are required' });
    }

    if (!address || !address.fullName || !address.fullAddress) {
      return res.status(400).json({ message: 'Complete shipping address is required' });
    }

    if (!totalPrice || totalPrice <= 0) {
      return res.status(400).json({ message: 'Valid total price is required' });
    }

    // Validate and calculate total from items
    let calculatedTotal = 0;
    const validatedItems = [];

    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({ message: 'Invalid item data' });
      }

      // Fetch product to verify price and availability
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` 
        });
      }

      const itemTotal = product.price * item.quantity;
      calculatedTotal += itemTotal;

      validatedItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images?.[0] || '',
        total: itemTotal
      });
    }

    // Verify calculated total matches provided total (with small tolerance for rounding)
    if (Math.abs(calculatedTotal - totalPrice) > 0.01) {
      return res.status(400).json({ 
        message: `Price mismatch. Calculated: ${calculatedTotal}, Provided: ${totalPrice}` 
      });
    }

    // Create order
    const order = new Order({
      userId: req.user._id,
      items: validatedItems,
      totalPrice: totalPrice,
      shippingAddress: {
        fullName: address.fullName,
        mobileNumber: address.mobileNumber,
        fullAddress: address.fullAddress,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        country: address.country || 'India'
      },
      razorpayOrderId: razorpayOrderId,
      orderStatus: 'Pending',
      paymentStatus: 'Pending',
      createdAt: new Date()
    });

    const savedOrder = await order.save();

    // Update product stock (reserve items)
    for (const item of validatedItems) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      );
    }

    res.status(201).json({
      message: 'Order created successfully',
      order: savedOrder
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
});

// Get all orders for the authenticated user
router.get('/my-orders', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('items.productId', 'name images category');

    const total = await Order.countDocuments({ userId: req.user._id });

    res.status(200).json({
      orders,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

// Get a specific order by ID
router.get('/:orderId', protect, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      userId: req.user._id
    }).populate('items.productId', 'name images category description');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ order });

  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Failed to fetch order', error: error.message });
  }
});

// Cancel an order (only if payment is pending or order is not shipped)
router.patch('/:orderId/cancel', protect, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      userId: req.user._id
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order can be cancelled
    if (order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered') {
      return res.status(400).json({ 
        message: 'Cannot cancel order that has been shipped or delivered' 
      });
    }

    if (order.orderStatus === 'Cancelled') {
      return res.status(400).json({ message: 'Order is already cancelled' });
    }

    // Update order status
    order.orderStatus = 'Cancelled';
    order.cancelledAt = new Date();

    // If payment was made, mark for refund
    if (order.paymentStatus === 'Paid') {
      order.refundStatus = 'Pending';
    }

    await order.save();

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: item.quantity } }
      );
    }

    res.status(200).json({
      message: 'Order cancelled successfully',
      order
    });

  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: 'Failed to cancel order', error: error.message });
  }
});

// Update order after successful payment (called from payment verification)
router.patch('/:orderId/payment-success', protect, async (req, res) => {
  try {
    const { paymentId, razorpayOrderId } = req.body;

    const order = await Order.findOneAndUpdate(
      {
        _id: req.params.orderId,
        userId: req.user._id,
        razorpayOrderId: razorpayOrderId
      },
      {
        paymentStatus: 'Paid',
        paymentId: paymentId,
        paidAt: new Date(),
        orderStatus: 'Confirmed'
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
      message: 'Order payment updated successfully',
      order
    });

  } catch (error) {
    console.error('Error updating order payment:', error);
    res.status(500).json({ message: 'Failed to update order payment', error: error.message });
  }
});

// Admin routes (if needed)
// Get all orders (admin only)
router.get('/admin/all', protect, async (req, res) => {
  try {
    // Add admin check middleware here if needed
    // if (req.user.role !== 'admin') {
    //   return res.status(403).json({ message: 'Access denied' });
    // }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    let query = {};
    if (status) {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'fullname email')
      .populate('items.productId', 'name images');

    const total = await Order.countDocuments(query);

    res.status(200).json({
      orders,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

// Update order status (admin only)
router.patch('/admin/:orderId/status', protect, async (req, res) => {
  try {
    // Add admin check middleware here if needed
    // if (req.user.role !== 'admin') {
    //   return res.status(403).json({ message: 'Access denied' });
    // }

    const { orderStatus, trackingNumber } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const updateData = { orderStatus };
    
    if (orderStatus === 'Shipped' && trackingNumber) {
      updateData.trackingNumber = trackingNumber;
      updateData.shippedAt = new Date();
    }
    
    if (orderStatus === 'Delivered') {
      updateData.deliveredAt = new Date();
    }

    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      updateData,
      { new: true }
    ).populate('userId', 'fullname email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
      message: 'Order status updated successfully',
      order
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Failed to update order status', error: error.message });
  }
});

module.exports = router;