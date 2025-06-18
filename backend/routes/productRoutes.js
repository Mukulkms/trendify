const express = require("express"); // <--- REQUIRED: Import express
const Product = require("../models/Product"); // <--- Ensure this path is correct

const router = express.Router(); // <--- REQUIRED: Initialize the router

// GET all products
router.get("/", async (req, res) => { // Removed middleware
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err); // Better error logging
    res.status(500).json({ error: err.message });
  }
});

// POST add product
router.post("/add", async (req, res) => { // Removed middleware
  try {
    console.log('Received product data:', req.body); // Debug log

    // Basic check for required fields, Mongoose schema will also validate
    if (!req.body.name || !req.body.brandname || !req.body.color || !req.body.gender || !req.body.price || !req.body.category) {
        return res.status(400).json({ message: "Missing required product fields." });
    }

    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save(); // Using const savedProduct
    res.status(201).json(savedProduct); // Sending the saved product
  } catch (err) {
    console.error('Product creation error:', err); // Log full error for more details
    // Handle Mongoose validation errors specifically
    if (err.name === 'ValidationError') {
        const errors = Object.keys(err.errors).map(key => err.errors[key].message);
        return res.status(400).json({ error: "Product validation failed", messages: errors.join(', ') });
    }
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// PUT update product by ID (for editing)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params; // Get the product ID from the URL parameters
    console.log(`Received product data for update (ID: ${id}):`, req.body); // Debug log

    // Option 1: Basic validation for update. Mongoose schema will handle deeper validation.
    if (
      !req.body.name ||
      !req.body.brandname ||
      !req.body.color ||
      !req.body.gender ||
      !req.body.price ||
      !req.body.category
    ) {
      return res.status(400).json({ message: "Missing required product fields for update." });
    }

    // Find the product by ID and update it.
    // `new: true` returns the updated document.
    // `runValidators: true` runs schema validators on update.
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json(updatedProduct); // Send back the updated product
  } catch (err) {
    console.error("Product update error:", err);
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid Product ID format." });
    }
    if (err.name === "ValidationError") {
      const errors = Object.keys(err.errors).map((key) => err.errors[key].message);
      return res
        .status(400)
        .json({ error: "Product validation failed during update", messages: errors.join(", ") });
    }
    res.status(500).json({ error: err.message || "Server error during update" });
  }
});

// ---

// DELETE product by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params; // Get the product ID from the URL parameters
    console.log(`Received request to delete product with ID: ${id}`); // Debug log

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json({ message: "Product deleted successfully.", deletedProduct });
  } catch (err) {
    console.error("Product deletion error:", err);
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid Product ID format." });
    }
    res.status(500).json({ error: err.message || "Server error during deletion" });
  }
});

module.exports = router; // <--- Correct: Export only the router