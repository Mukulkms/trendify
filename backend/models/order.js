// models/order.js
const mongoose = require('mongoose');

// Order Item Schema
const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    validate: {
      validator: Number.isInteger,
      message: 'Quantity must be an integer'
    }
  },
  image: {
    type: String,
    default: ''
  },
  total: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

// Shipping Address Schema
const shippingAddressSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^\+?[\d\s\-\(\)]{10,15}$/.test(v);
      },
      message: 'Please enter a valid mobile number'
    }
  },
  fullAddress: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  city: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  state: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  pincode: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^\d{6}$/.test(v); // Indian pincode format
      },
      message: 'Please enter a valid 6-digit pincode'
    }
  },
  country: {
    type: String,
    default: 'India',
    trim: true,
    maxlength: 50
  }
}, { _id: false });

// Main Order Schema
const orderSchema = new mongoose.Schema({
  // User Information
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // Order Items
  items: {
    type: [orderItemSchema],
    required: true,
    validate: {
      validator: function(items) {
        return items && items.length > 0;
      },
      message: 'Order must contain at least one item'
    }
  },

  // Pricing Information
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Shipping Information
  shippingAddress: {
    type: shippingAddressSchema,
    required: true
  },

  // Order Status
  orderStatus: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
    index: true
  },

  // Payment Information
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending',
    index: true
  },
  
  razorpayOrderId: {
    type: String,
    trim: true,
    index: true
  },
  
  paymentId: {
    type: String,
    trim: true
  },

  // Refund Information
  refundStatus: {
    type: String,
    enum: ['None', 'Pending', 'Processed', 'Failed'],
    default: 'None'
  },
  
  refundId: {
    type: String,
    trim: true
  },

  // Tracking Information
  trackingNumber: {
    type: String,
    trim: true
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  paidAt: {
    type: Date
  },
  
  shippedAt: {
    type: Date
  },
  
  deliveredAt: {
    type: Date
  },
  
  cancelledAt: {
    type: Date
  },

  // Additional Notes
  orderNotes: {
    type: String,
    maxlength: 1000,
    trim: true
  },

  // Admin Notes
  adminNotes: {
    type: String,
    maxlength: 1000,
    trim: true
  }
}, {
  timestamps: true, // This adds createdAt and updatedAt automatically
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1, createdAt: -1 });
orderSchema.index({ razorpayOrderId: 1 });
orderSchema.index({ 'items.productId': 1 });

// Virtual for order total items count
orderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for order age in days
orderSchema.virtual('orderAge').get(function() {
  return Math.floor((Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24));
});

// Virtual for formatted order status
orderSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    'Pending': 'Order Placed',
    'Confirmed': 'Order Confirmed',
    'Processing': 'Being Prepared',
    'Shipped': 'Out for Delivery',
    'Delivered': 'Delivered',
    'Cancelled': 'Cancelled'
  };
  return statusMap[this.orderStatus] || this.orderStatus;
});

// Pre-save middleware to validate total price
orderSchema.pre('save', function(next) {
  if (this.items && this.items.length > 0) {
    const calculatedTotal = this.items.reduce((sum, item) => sum + item.total, 0);
    
    // Allow small rounding differences
    if (Math.abs(calculatedTotal - this.totalPrice) > 0.01) {
      return next(new Error(`Total price mismatch. Calculated: ${calculatedTotal}, Provided: ${this.totalPrice}`));
    }
  }
  next();
});

// Pre-save middleware to set timestamps based on status changes
orderSchema.pre('save', function(next) {
  if (this.isModified('orderStatus')) {
    const now = new Date();
    
    switch (this.orderStatus) {
      case 'Shipped':
        if (!this.shippedAt) this.shippedAt = now;
        break;
      case 'Delivered':
        if (!this.deliveredAt) this.deliveredAt = now;
        break;
      case 'Cancelled':
        if (!this.cancelledAt) this.cancelledAt = now;
        break;
    }
  }
  
  if (this.isModified('paymentStatus') && this.paymentStatus === 'Paid' && !this.paidAt) {
    this.paidAt = new Date();
  }
  
  next();
});

// Static method to get order statistics
orderSchema.statics.getOrderStats = async function(userId = null) {
  const matchStage = userId ? { userId: new mongoose.Types.ObjectId(userId) } : {};
  
  const stats = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$orderStatus',
        count: { $sum: 1 },
        totalValue: { $sum: '$totalPrice' }
      }
    }
  ]);
  
  return stats;
};

// Static method to get recent orders
orderSchema.statics.getRecentOrders = async function(limit = 10, userId = null) {
  const query = userId ? { userId } : {};
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('userId', 'fullname email')
    .populate('items.productId', 'name images category');
};

// Instance method to check if order can be cancelled
orderSchema.methods.canBeCancelled = function() {
  return !['Shipped', 'Delivered', 'Cancelled'].includes(this.orderStatus);
};

// Instance method to check if order can be returned
orderSchema.methods.canBeReturned = function(returnWindowDays = 7) {
  if (this.orderStatus !== 'Delivered' || !this.deliveredAt) {
    return false;
  }
  
  const daysSinceDelivery = (Date.now() - this.deliveredAt.getTime()) / (1000 * 60 * 60 * 24);
  return daysSinceDelivery <= returnWindowDays;
};

// Instance method to get formatted address
orderSchema.methods.getFormattedAddress = function() {
  const addr = this.shippingAddress;
  return `${addr.fullName}\n${addr.fullAddress}\n${addr.city}, ${addr.state} - ${addr.pincode}\n${addr.country}\nMobile: ${addr.mobileNumber}`;
};

// Export the model
module.exports = mongoose.model('Order', orderSchema);