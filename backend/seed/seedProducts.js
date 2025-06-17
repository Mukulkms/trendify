const mongoose = require('mongoose');
const Product = require('../models/Product');
const path = require('path'); // Add this line to use path.join if needed, though we'll simplify the image paths directly

const allProducts = [
  // Men Products
  { name: "Casual Printed T-Shirt", price: 799, category: "T-Shirt", image: "/images/t-shirt.webp", stock: 50, ratings: 4 },
  { name: "Slim Fit Jeans", price: 1499, category: "Jeans", image: "/images/men-jeans.jpg", stock: 50, ratings: 3 },
  { name: "Oversized Hoodie", price: 1799, category: "Hoodie", image: "/images/hoodie1.webp", stock: 50, ratings: 5 },
  { name: "Basic Round Neck Tee", price: 499, category: "T-Shirt", image: "/images/tshirt2.webp", stock: 50, ratings: 4 },
  { name: "Graphic T-Shirt", price: 999, category: "T-Shirt", image: "/images/tshirt3.webp", stock: 50, ratings: 5 },
  { name: "Reebok Sportswear Hoodie", price: 1899, category: "Hoodie", image: "/images/hoodie2.webp", stock: 50, ratings: 3 },
  { name: "Puma Joggers", price: 1299, category: "Joggers", image: "/images/joggers.webp", stock: 50, ratings: 4 },
  { name: "R-Hoodie", price: 1859, category: "Hoodie", image: "/images/sporthoodie.webp", stock: 50, ratings: 3 },

  // Women Products
  { name: "Floral Casual T-Shirt", price: 899, category: "Tops", image: "/images/w1.jpg", stock: 50, ratings: 4 },
  { name: "Lavender Sports Hoodie", price: 1699, category: "Hoodie", image: "/images/w2.jpg", stock: 50, ratings: 5 },
  { name: "Crop Fit Joggers", price: 1299, category: "Joggers", image: "/images/w3.jpg", stock: 50, ratings: 4 },
  { name: "Faded Denim Jeans", price: 1599, category: "Jeans", image: "/images/w4.jpg", stock: 50, ratings: 4 },
  { name: "Graphic Tee", price: 699, category: "Tops", image: "/images/w5.jpg", stock: 50, ratings: 3 },
  { name: "Soft Knit Hoodie", price: 1499, category: "Hoodie", image: "/images/w6.jpg", stock: 50, ratings: 4 },
  { name: "Athleisure Leggings", price: 1199, category: "Leggings", image: "/images/w7.jpg", stock: 50, ratings: 5 },
  { name: "Vintage Wash T-Shirt", price: 749, category: "Tops", image: "/images/w8.jpg", stock: 50, ratings: 4 },

  // Kids Products
  { name: "Boys Cartoon Print T-Shirt", price: 499, category: "T-Shirt", image: "/images/kids_boy_tee1.webp", stock: 50, ratings: 4 },
  { name: "Girls Polka Dot Dress", price: 799, category: "Dress", image: "/images/kids_girl_dress1.webp", stock: 50, ratings: 5 },
  { name: "Boys Shirt", price: 699, category: "Shirt", image: "/images/kids_boy_shirt1.webp", stock: 50, ratings: 3 },
  { name: "Girls Graphic Print Fishes", price: 399, category: "T-Shirt", image: "/images/kids_girl_tee1.webp", stock: 50, ratings: 5 },
  { name: "Boys Solid Hoodie", price: 999, category: "Hoodie", image: "/images/kids_boy_hoodie1.webp", stock: 50, ratings: 4 },
  { name: "Girls Hoodie", price: 549, category: "Top", image: "/images/kids_girl_top1.webp", stock: 50, ratings: 3 },

  // Men Accessories
  { name: "Men's Leather Wallet", price: 999, category: "wallets", image: "/images/a3.jpg", stock: 50, ratings: 4 },
  { name: "Men's Casual Belt", price: 799, category: "belts", image: "/images/a1.webp", stock: 50, ratings: 5 }, // <-- FIXED THIS PATH
  { name: "Men's Luxury Watch", price: 2999, category: "watches", image: "/images/a4.jpg", stock: 50, ratings: 2 },
  { name: "Men's Aviator Sunglasses", price: 1499, category: "sunglasses", image: "/images/a2.jpg", stock: 50, ratings: 4 },
  { name: "Men's Travel Backpack", price: 1799, category: "bags", image: "/images/a5.jpg", stock: 50, ratings: 4 },

  // Women Accessories
  { name: "Women's Leather Wallet", price: 999, category: "wallets", image: "/images/a7.jpg", stock: 50, ratings: 4 },
  { name: "Women's Hat", price: 399, category: "hats", image: "/images/a6.jpg", stock: 50, ratings: 4 },
  { name: "Women's Elegant Watch", price: 2499, category: "watches", image: "/images/a9.jpg", stock: 50, ratings: 4 },
  { name: "Women's Cat-Eye Sunglasses", price: 1599, category: "sunglasses", image: "/images/a8.jpg", stock: 50, ratings: 4 },
  { name: "Women's Leather Tote Bag", price: 2999, category: "bags", image: "/images/a10.jpg", stock: 50, ratings: 5 },

  // New Arrivals
  { name: "Men's Jacket", price: 699, category: "Jacket", image: "/images/men-jacket.jpg", stock: 50, ratings: 4 },
  { name: "Men's Slim Fit Shirt", price: 1199, category: "Shirt", image: "/images/men-shirt.jpg", stock: 50, ratings: 5 },
  { name: "Men's Regular Fit Jeans", price: 1499, category: "Jeans", image: "/images/men-jeans.jpg", stock: 50, ratings: 4 },
  { name: "Men's Pullover Hoodie", price: 1299, category: "Hoodie", image: "/images/men-hoodie.jpg", stock: 50, ratings: 5 },
  { name: "Women's Ruffle Sleeve Top", price: 849, category: "Top", image: "/images/women-top.jpg", stock: 50, ratings: 2 },
  { name: "Women’s Blazer", price: 999, category: "Blazer", image: "/images/women-blazer.jpg", stock: 50, ratings: 5 },
  { name: "Women’s Summer Midi Dress", price: 1399, category: "Dress", image: "/images/women-dress.jpg", stock: 50, ratings: 4 },
  { name: "Women’s Skirt", price: 1199, category: "Cardigan", image: "/images/women-skirt.jpg", stock: 50, ratings: 5 },
  { name: "Boys Zip-Up Jacket", price: 899, category: "Jacket", image: "/images/kids-jacket.jpg", stock: 50, ratings: 4 },
  { name: "Boys Dino Print Set", price: 749, category: "Set", image: "/images/boys-set.jpg", stock: 50, ratings: 5 },
  { name: "Girls Floral Skirt Set", price: 999, category: "Skirt Set", image: "/images/girls-set.jpg", stock: 50, ratings: 5 },
  { name: "Girls Birthday Frock", price: 1299, category: "Dress", image: "/images/girls-frock.jpg", stock: 50, ratings: 4 },
];

mongoose.connect('mongodb://localhost:27017/Trendify')
  .then(async () => {
    console.log('Connected to MongoDB');
    // Clear existing products
    await Product.deleteMany({});
    // Insert new products
    await Product.insertMany(allProducts);
    console.log('Products seeded successfully');
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });