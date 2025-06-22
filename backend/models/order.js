// models/Order.js
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Assuming you have a Product model
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: { // Price per unit at the time of purchase
    type: Number,
    required: true,
  },
  image: { // Optional: URL to product image
    type: String,
  },
});

const shippingAddressSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  fullAddress: { // The combined address string
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    default: 'India', // Default to India if not provided
  },
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true,
  },
  items: [orderItemSchema], // Array of products in the order
  totalPrice: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  shippingAddress: {
    type: shippingAddressSchema,
    required: true,
  },
  razorpayOrderId: { // The order ID provided by Razorpay
    type: String,
    required: true,
    unique: true, // Ensure uniqueness for each Razorpay order
  },
  paymentId: { // The payment ID provided by Razorpay upon successful payment
    type: String,
    unique: true, // Ensure uniqueness
    sparse: true, // Allow multiple documents to have null paymentId if not completed
  },
  signature: { // Razorpay signature for verification
    type: String,
    sparse: true,
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending',
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  orderedAt: {
    type: Date,
    default: Date.now,
  },
  deliveredAt: {
    type: Date,
  },
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;