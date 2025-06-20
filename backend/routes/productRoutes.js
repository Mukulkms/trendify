const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error("Error fetching all products:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET single product by ID
// This is the route that was missing!
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      // If product is not found, send a 404 response
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    console.error("Error fetching single product:", err);
    // Specifically handle CastError if the ID format is invalid
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// POST add product
router.post("/add", async (req, res) => {
  try {
    console.log('Received product data:', req.body);

    if (!req.body.name || !req.body.brandname || !req.body.color || !req.body.gender || !req.body.price || !req.body.category) {
        return res.status(400).json({ message: "Missing required product fields." });
    }

    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error('Product creation error:', err);
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
    const { id } = req.params;
    console.log(`Received product data for update (ID: ${id}):`, req.body);

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

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json(updatedProduct);
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

// DELETE product by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Received request to delete product with ID: ${id}`);

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

module.exports = router;