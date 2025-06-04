const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// ✅ Helper to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// ✅ Register admin/vendor
router.post('/register-admin-vendor', async (req, res) => {
  try {
    const { fullname, email, password, mobileNumber, role } = req.body;

    if (!['admin', 'vendor'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const newUser = new User({
      fullname,
      email,
      password,
      mobileNumber,
      role,
      status: 'pending', // Needs super admin approval
    });

    await newUser.save();
    return res.status(201).json({
      message: 'Registration successful! Awaiting super admin approval.',
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ✅ Login admin/vendor/super-admin
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    if (!['admin', 'vendor', 'super-admin'].includes(user.role)) {
      return res.status(403).json({ message: 'Unauthorized role' });
    }

    if (user.role !== 'super-admin' && user.status !== 'approved') {
      return res.status(403).json({ message: 'Account not approved by super admin' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // ✅ Generate token after all checks
    const token = generateToken(user);

    // ✅ Send token + user data to frontend
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        fullname: user.fullname,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ✅ Middleware to protect routes
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// ✅ Auth check for dashboard
router.get('/me', protect, (req, res) => {
  const { _id, fullname, email, role, status, isVerified } = req.user;
  res.json({ _id, fullname, email, role, status, isVerified });
});


module.exports = router;
