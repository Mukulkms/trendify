// your-backend-project/models/Category.js
const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true, // Ensures category names are unique (case-insensitive check will be in routes)
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  // Mongoose will automatically manage createdAt and updatedAt if you use this.
  // If you want more control, keep your manual ones, but 'timestamps: true' is cleaner.
  timestamps: true
});

// Optional: Add a pre-save hook to ensure `updatedAt` is always current
CategorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Category', CategorySchema);