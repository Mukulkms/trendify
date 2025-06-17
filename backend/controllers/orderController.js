const Order = require('../models/order');
const Product = require('../models/Product');
const User = require('../models/User');

// Helper to format order for frontend
const formatOrderForFrontend = (order) => {
  const userName = order.user ? (order.user.fullname || order.user.email) : 'N/A';

  const items = order.items.map(pItem => {
    const productData = pItem.productId || {};
    return {
      productId: productData._id || null,
      name: productData.name || 'Unknown Product',
      price: productData.price || 0,
      quantity: pItem.quantity,
      image: productData.image || 'https://via.placeholder.com/30',
    };
  });

  return {
    _id: order._id,
    user: {
      _id: order.user ? order.user._id : null,
      name: userName,
      email: order.user ? order.user.email : 'N/A'
    },
    items,
    totalAmount: parseFloat(order.totalPrice).toFixed(2),
    status: order.paymentStatus || 'Pending',
    createdAt: order.createdAt,
    shippingAddress: order.shippingAddress || {
      fullName: 'N/A',
      fullAddress: 'N/A',
      city: 'N/A',
      state: 'N/A',
      pincode: 'N/A',
      country: 'N/A',
      mobileNumber: 'N/A'
    }
  };
};

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (User)
exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      totalPrice,
      shippingAddress,
      razorpayOrderId
    } = req.body;

    const newOrder = new Order({
      userId: req.user._id,
      items,
      totalPrice,
      shippingAddress,
      razorpayOrderId,
      paymentStatus: 'Pending'
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Could not create order' });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('userId', 'fullname email')
      .populate('items.productId', 'name price image')
      .sort({ createdAt: -1 });

    const formattedOrders = orders.map(formatOrderForFrontend);
    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Could not fetch orders' });
  }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my
// @access  Private (User)
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('userId', 'fullname email')
      .populate('items.productId', 'name price image')
      .sort({ createdAt: -1 });

    const formattedOrders = orders.map(formatOrderForFrontend);
    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Could not fetch your orders' });
  }
};

// @desc    Update order with payment success
// @route   PUT /api/orders/:id/pay
// @access  Private (User or Webhook)
exports.updateOrderPaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentId, paymentStatus } = req.body;

    if (!paymentId || !paymentStatus) {
      return res.status(400).json({ message: 'Missing paymentId or paymentStatus' });
    }

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.paymentId = paymentId;
    order.paymentStatus = paymentStatus;

    const updatedOrder = await order.save();
    res.status(200).json({ message: 'Payment updated successfully', order: updatedOrder });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ message: 'Could not update payment status' });
  }
};
