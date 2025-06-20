const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register Vendor/Admin
exports.registerUser = async (req, res) => {
  try {
    const { fullname, email, password, mobileNumber, role } = req.body;

    if (!['vendor', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const user = new User({
      fullname,
      email,
      password, // plain password, will be hashed by pre-save middleware
      mobileNumber,
      role,
      isVerified: false,
    });

    await user.save();
    res.status(201).json({ message: 'Registration request sent for approval.' });
  } catch (err) {
    console.error('❌ Register Error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    if ((user.role === 'vendor' || user.role === 'admin') && !user.isVerified) {
      return res.status(403).json({ message: 'Account pending approval' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        fullname: user.fullname,
        isVerified: user.isVerified,
        status: user.status, 
      },
    });
  } catch (err) {
    console.error('❌ Login Error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get pending users
exports.getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({
      isVerified: false,
      role: { $in: ['vendor', 'admin'] },
    });
    res.json(users);
  } catch (err) {
    console.error('❌ Get Pending Users Error:', err.message);
    res.status(500).json({ message: 'Failed to fetch pending users', error: err.message });
  }
};

// Approve user
exports.approveUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        isVerified: true,
        status: 'approved', // ✅ Add this line
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found for approval' });
    }

    res.json({ message: 'User approved successfully', user: updatedUser });
  } catch (err) {
    console.error('❌ Approve Error:', err.message);
    res.status(500).json({ message: 'Failed to approve user', error: err.message });
  }
};


// Reject user
exports.rejectUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found for deletion' });
    }

    res.json({ message: 'User rejected and deleted' });
  } catch (err) {
    console.error('❌ Reject Error:', err.message);
    res.status(500).json({ message: 'Failed to reject user', error: err.message });
  }
};
