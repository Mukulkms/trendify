const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// Utility to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      mobileNumber: user.mobileNumber,
    },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { fullname, email, mobileNumber, password } = req.body;

    if (!fullname || !mobileNumber || !password) {
      return res.status(400).json({ message: 'Fullname, mobile number, and password are required' });
    }

    const existingUser = await User.findOne({ mobileNumber });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists with this mobile number' });
    }

    const user = await User.create({
      fullname,
      email,
      mobileNumber,
      password,
      provider: 'local',
    });

    const token = generateToken(user);
    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Check login methods for mobile number
router.post('/check-user', async (req, res) => {
  try {
    const { mobileNumber } = req.body;
    if (!mobileNumber) return res.status(400).json({ error: 'Mobile number is required' });

    const user = await User.findOne({ mobileNumber });
    if (!user) return res.status(404).json({ exists: false, error: 'User not found' });

    const loginMethods = [];
    if (user.password) loginMethods.push('password');
    loginMethods.push('otp');

    res.status(200).json({ exists: true, loginMethods });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// Send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { mobileNumber } = req.body;
    if (!mobileNumber) {
      return res.status(400).json({ message: 'Mobile number is required' });
    }
 
    const user = await User.findOne({ mobileNumber });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
 
    // Generate and send OTP (mock implementation)
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    console.log(`OTP for ${mobileNumber}: ${otp}`); // In production, send via SMS/email
    user.otp = otp;
    user.otpExpiresAt = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    await user.save();
 
    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});


// Verify OTP and login
router.post('/verify-otp', async (req, res) => {
  try {
    const { mobileNumber, otp } = req.body;
    if (!mobileNumber || !otp) {
      return res.status(400).json({ message: 'Mobile number and OTP are required' });
    }

    const user = await User.findOne({ mobileNumber });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.otp !== otp || user.otpExpiresAt < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    const token = generateToken(user);
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login with password
router.post('/login', async (req, res) => {
  try {
    const { mobileNumber, password } = req.body;

    if (!mobileNumber || !password) {
      return res.status(400).json({ message: 'Mobile number and password are required' });
    }

    const user = await User.findOne({ mobileNumber });
    if (!user || !user.password) {
      return res.status(404).json({ message: 'User not found or password login unavailable' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid mobile number or password' });

    const token = generateToken(user);
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get user profile using token
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
