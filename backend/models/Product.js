const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },

    // NEW: Description field added here
    description: { type: String, required: true, trim: true }, // Added description field

    size: {
      type: [String],
      enum: [
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL",
        "26",
        "28",
        "30",
        "32",
        "34",
        "36",
        "38",
      ],
      default: undefined,
    },

    size_shoes: {
      type: [String],
      enum: ["6", "7", "8", "9", "10"],
      default: undefined,
    },

    size_kids: {
      type: [String],
      enum: [
        "0-1yrs",
        "1-2yrs",
        "2-3yrs",
        "3-4yrs",
        "4-5yrs",
        "5-6yrs",
        "6-7yrs",
        "7-8yrs",
        "8-9yrs",
        "10-12yrs",
      ],
      default: undefined,
    },

    category: {
      type: String,
      enum: [
        "T-Shirt",
        "Shoes",
        "Jeans",
        "Hoodie",
        "Joggers",
        "Tops",
        "Leggings",
        "Top",
        "Dress",
        "Shirt",
        "Jacket",
        "Set",
        "Skirt Set",
        "Blazer",
        "Skirt",
        "Wallets",
        "Belts",
        "Watches",
        "Sunglasses",
        "Bags",
        "Hats",
      ],
      required: true,
      trim: true,
    },

    gender: {
      type: String,
      enum: ["men", "women", "kids"],
      required: true,
      trim: true,
    },

    color: {
      type: String,
      required: true,
      trim: true,
    },
    brandname: {
      type: String,
      required: true,
      trim: true,
    },

    ratings: { type: Number, default: 0, min: 0, max: 5 },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);