const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// ✅ Middleware to protect super admin routes
const protectSuperAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user || user.role !== 'super-admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Token error:', err);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// ✅ Token generator (used later)
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// ✅ Login super admin
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.role !== 'super-admin') {
      return res.status(401).json({ message: 'Invalid credentials or not a super admin' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);

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
    console.error('Super admin login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ✅ Get current super admin
router.get('/me', protectSuperAdmin, (req, res) => {
  res.json(req.user);
});

// --- THIS IS THE CRITICAL LINE TO CHANGE ---
// It needs to export both the router AND the protectSuperAdmin middleware
module.exports = { router, protectSuperAdmin };
