// your-backend-project/routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const Category = require('../models/Category'); // Adjust path as per your project structure

// Apply authentication middleware to all category routes
// Only authenticated users with 'super-admin' role can manage categories

// @route   GET /api/categories
// @desc    Get all categories
// @access  Private (Super Admin)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err.message);
    res.status(500).json({ message: 'Server Error: Could not retrieve categories.' });
  }
});

// @route   POST /api/categories/add
// @desc    Add a new category
// @access  Private (Super Admin)
router.post('/add', async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'Category name is required.' });
  }

  try {
    // Case-insensitive check for existing category name
    let category = await Category.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } });
    if (category) {
      return res.status(400).json({ message: 'Category with this name already exists.' });
    }

    category = new Category({ name: name.trim() });
    await category.save();
    res.status(201).json(category); // 201 Created
  } catch (err) {
    console.error('Error adding category:', err.message);
    res.status(500).json({ message: 'Server Error: Could not add category.' });
  }
});

// @route   PUT /api/categories/:id
// @desc    Update a category
// @access  Private (Super Admin)
router.put('/:id', async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'Category name is required.' });
  }

  try {
    let category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    // Check if the new name clashes with an existing category (excluding the current one)
    if (name.trim().toLowerCase() !== category.name.toLowerCase()) {
      const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } });
      if (existingCategory && existingCategory._id.toString() !== req.params.id) {
        return res.status(400).json({ message: 'Another category with this name already exists.' });
      }
    }

    category.name = name.trim();
    await category.save(); // save() triggers pre-save hooks (like updatedAt)
    res.json(category);
  } catch (err) {
    console.error('Error updating category:', err.message);
    res.status(500).json({ message: 'Server Error: Could not update category.' });
  }
});

// @route   DELETE /api/categories/:id
// @desc    Delete a category
// @access  Private (Super Admin)
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    await Category.deleteOne({ _id: req.params.id }); // Use deleteOne for clarity
    res.json({ message: 'Category removed successfully.' });
  } catch (err) {
    console.error('Error deleting category:', err.message);
    res.status(500).json({ message: 'Server Error: Could not delete category.' });
  }
});

module.exports = router;