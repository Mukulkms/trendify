// routes/superAdminAuthRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

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

router.get('/me', protectSuperAdmin, (req, res) => {
  res.json(req.user);
});

module.exports = router;
