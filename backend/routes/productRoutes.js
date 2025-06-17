const express = require("express");
const { getProducts, addProduct, deleteProduct, updateProduct } = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Middleware to ensure superadmin access
const protectSuperAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user || user.role !== 'super-admin') {
      return res.status(403).json({ message: 'Unauthorized: Superadmin access required' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// GET all products (no auth required as per your setup)
router.get("/", getProducts);

// POST add product (superadmin only)
router.post("/add", protectSuperAdmin, addProduct);

// DELETE a product (superadmin only)
router.delete("/:id", protectSuperAdmin, deleteProduct);

// PUT update a product (superadmin only)
router.put("/:id", protectSuperAdmin, updateProduct);

module.exports = router;