const mongoose = require('mongoose');
const Product = require('../models/Product');
const path = require('path');

const allProducts = [
  // Men Products
  {
    name: "Men's Casual Printed T-Shirt",
    image: "/images/t-shirt.webp",
    size: ["S", "M", "L", "XL"],
    category: "T-Shirt",
    gender: "men",
    color: "Black",
    price: 799,
    brandname: "UrbanAttire",
    stock: 50,
    ratings: 4
  },
  {
    name: "Men's Slim Fit Jeans",
    image: "/images/men-jeans.jpg",
    size: ["28", "30", "32", "34", "36"],
    category: "Jeans",
    gender: "men",
    color: "Dark Blue",
    price: 1499,
    brandname: "DenimCo",
    stock: 45,
    ratings: 3
  },
  {
    name: "Men's Oversized Hoodie",
    image: "/images/hoodie1.webp",
    size: ["M", "L", "XL", "XXL"],
    category: "Hoodie",
    gender: "men",
    color: "Grey",
    price: 1799,
    brandname: "ComfyWear",
    stock: 30,
    ratings: 5
  },
  {
    name: "Men's Basic Round Neck Tee",
    image: "/images/tshirt2.webp",
    size: ["S", "M", "L"],
    category: "T-Shirt",
    gender: "men",
    color: "White",
    price: 499,
    brandname: "EverydayEssentials",
    stock: 60,
    ratings: 4
  },
  {
    name: "Men's Graphic T-Shirt 'Cosmic Explorer'",
    image: "/images/tshirt3.webp",
    size: ["M", "L", "XL"],
    category: "T-Shirt",
    gender: "men",
    color: "Navy Blue",
    price: 999,
    brandname: "ArtisticThreads",
    stock: 40,
    ratings: 5
  },
  {
    name: "Men's Reebok Sportswear Hoodie",
    image: "/images/hoodie2.webp",
    size: ["L", "XL", "XXL"],
    category: "Hoodie",
    gender: "men",
    color: "Black",
    price: 1899,
    brandname: "Reebok",
    stock: 25,
    ratings: 3
  },
  {
    name: "Men's Puma Performance Joggers",
    image: "/images/joggers.webp",
    size: ["S", "M", "L", "XL"],
    category: "Joggers",
    gender: "men",
    color: "Charcoal Grey",
    price: 1299,
    brandname: "Puma",
    stock: 35,
    ratings: 4
  },
  {
    name: "Men's R-Hoodie Athletic Series",
    image: "/images/sporthoodie.webp",
    size: ["M", "L", "XL"],
    category: "Hoodie",
    gender: "men",
    color: "Olive Green",
    price: 1859,
    brandname: "AthleisurePro",
    stock: 28,
    ratings: 3
  },
  {
    name: "Men's Classic Denim Jacket",
    image: "/images/men-jacket.jpg",
    size: ["M", "L", "XL"],
    category: "Jacket",
    gender: "men",
    color: "Light Wash",
    price: 2199,
    brandname: "VintageWear",
    stock: 20,
    ratings: 4
  },
  {
    name: "Men's Oxford Button-Down Shirt",
    image: "/images/men-shirt.jpg",
    size: ["S", "M", "L", "XL"],
    category: "Shirt",
    gender: "men",
    color: "Sky Blue",
    price: 1199,
    brandname: "FormalEase",
    stock: 38,
    ratings: 5
  },
  {
    name: "Men's Pullover Hoodie 'Adventure Series'",
    image: "/images/men-hoodie.jpg",
    size: ["M", "L", "XL"],
    category: "Hoodie",
    gender: "men",
    color: "Forest Green",
    price: 1299,
    brandname: "OutdoorLife",
    stock: 30,
    ratings: 5
  },

  // Women Products
  {
    name: "Women's Floral Casual T-Shirt",
    image: "/images/w1.jpg",
    size: ["XS", "S", "M", "L"],
    category: "Tops",
    gender: "women",
    color: "White with Floral Print",
    price: 899,
    brandname: "BloomFashion",
    stock: 55,
    ratings: 4
  },
  {
    name: "Women's Lavender Sports Hoodie",
    image: "/images/w2.jpg",
    size: ["S", "M", "L"],
    category: "Hoodie",
    gender: "women",
    color: "Lavender",
    price: 1699,
    brandname: "ActiveChic",
    stock: 32,
    ratings: 5
  },
  {
    name: "Women's Crop Fit Joggers",
    image: "/images/w3.jpg",
    size: ["S", "M", "L"],
    category: "Joggers",
    gender: "women",
    color: "Light Grey",
    price: 1299,
    brandname: "LoungeWear",
    stock: 40,
    ratings: 4
  },
  {
    name: "Women's Faded Denim Jeans",
    image: "/images/w4.jpg",
    size: ["26", "28", "30", "32"],
    category: "Jeans",
    gender: "women",
    color: "Faded Blue",
    price: 1599,
    brandname: "TrueDenim",
    stock: 38,
    ratings: 4
  },
  {
    name: "Women's Graphic Tee 'Wanderlust'",
    image: "/images/w5.jpg",
    size: ["XS", "S", "M"],
    category: "Tops",
    gender: "women",
    color: "Cream",
    price: 699,
    brandname: "BohoVibes",
    stock: 50,
    ratings: 3
  },
  {
    name: "Women's Soft Knit Hoodie",
    image: "/images/w6.jpg",
    size: ["S", "M", "L"],
    category: "Hoodie",
    gender: "women",
    color: "Blush Pink",
    price: 1499,
    brandname: "CozyComfort",
    stock: 35,
    ratings: 4
  },
  {
    name: "Women's Athleisure Leggings",
    image: "/images/w7.jpg",
    size: ["XS", "S", "M", "L"],
    category: "Leggings",
    gender: "women",
    color: "Black",
    price: 1199,
    brandname: "FlexFit",
    stock: 48,
    ratings: 5
  },
  {
    name: "Women's Vintage Wash T-Shirt",
    image: "/images/w8.jpg",
    size: ["S", "M", "L"],
    category: "Tops",
    gender: "women",
    color: "Mustard Yellow",
    price: 749,
    brandname: "RetroStyle",
    stock: 42,
    ratings: 4
  },
  {
    name: "Women's Ruffle Sleeve Top",
    image: "/images/women-top.jpg",
    size: ["S", "M", "L"],
    category: "Top",
    gender: "women",
    color: "Dusty Rose",
    price: 849,
    brandname: "ElegantWear",
    stock: 30,
    ratings: 2
  },
  {
    name: "Women's Chic Office Blazer",
    image: "/images/women-blazer.jpg",
    size: ["S", "M", "L"],
    category: "Blazer",
    gender: "women",
    color: "Navy",
    price: 999,
    brandname: "PowerDress",
    stock: 25,
    ratings: 5
  },
  {
    name: "Women's Summer Midi Dress 'Bohemian'",
    image: "/images/women-dress.jpg",
    size: ["S", "M", "L"],
    category: "Dress",
    gender: "women",
    color: "Floral Print",
    price: 1399,
    brandname: "SummerBreeze",
    stock: 33,
    ratings: 4
  },
  {
    name: "Women's A-Line Denim Skirt",
    image: "/images/women-skirt.jpg",
    size: ["S", "M", "L"],
    category: "Skirt",
    gender: "women",
    color: "Blue Denim",
    price: 1199,
    brandname: "DenimChic",
    stock: 28,
    ratings: 5
  },

  // Kids Products
  {
    name: "Boys Cartoon Print T-Shirt 'Dino Fun'",
    image: "/images/kids_boy_tee1.webp",
    size: ["XS", "S", "M", "L"],
    size_kids: ["2-3yrs", "4-5yrs", "6-7yrs", "8-9yrs"],
    category: "T-Shirt",
    gender: "kids",
    color: "Blue",
    price: 499,
    brandname: "KidsPlay",
    stock: 60,
    ratings: 4
  },
  {
    name: "Girls Polka Dot Party Dress",
    image: "/images/kids_girl_dress1.webp",
    size: ["S", "M", "L"],
    size_kids: ["3-4yrs", "5-6yrs", "7-8yrs"],
    category: "Dress",
    gender: "kids",
    color: "Red with White Dots",
    price: 799,
    brandname: "LittlePrincess",
    stock: 40,
    ratings: 5
  },
  {
    name: "Boys Casual Plaid Shirt",
    image: "/images/kids_boy_shirt1.webp",
    size: ["S", "M", "L"],
    size_kids: ["4-5yrs", "6-7yrs", "8-9yrs"],
    category: "Shirt",
    gender: "kids",
    color: "Red Plaid",
    price: 699,
    brandname: "RoughNReady",
    stock: 35,
    ratings: 3
  },
  {
    name: "Girls Graphic Print T-Shirt 'Fishes'",
    image: "/images/kids_girl_tee1.webp",
    size: ["XS", "S", "M"],
    size_kids: ["2-3yrs", "4-5yrs", "6-7yrs"],
    category: "T-Shirt",
    gender: "kids",
    color: "Pink",
    price: 399,
    brandname: "OceanKids",
    stock: 70,
    ratings: 5
  },
  {
    name: "Boys Solid Fleece Hoodie",
    image: "/images/kids_boy_hoodie1.webp",
    size: ["M", "L", "XL"],
    size_kids: ["6-7yrs", "8-9yrs", "10-12yrs"],
    category: "Hoodie",
    gender: "kids",
    color: "Navy Blue",
    price: 999,
    brandname: "WarmKids",
    stock: 30,
    ratings: 4
  },
  {
    name: "Girls Soft Knit Top with Bow",
    image: "/images/kids_girl_top1.webp",
    size: ["XS", "S", "M"],
    size_kids: ["3-4yrs", "5-6yrs", "7-8yrs"],
    category: "Top",
    gender: "kids",
    color: "Peach",
    price: 549,
    brandname: "CuteAttire",
    stock: 45,
    ratings: 3
  },
  {
    name: "Boys Zip-Up Jacket 'Sports Edition'",
    image: "/images/kids-jacket.jpg",
    size: ["M", "L", "XL"],
    size_kids: ["6-7yrs", "8-9yrs", "10-12yrs"],
    category: "Jacket",
    gender: "kids",
    color: "Red",
    price: 899,
    brandname: "ActiveKids",
    stock: 28,
    ratings: 4
  },
  {
    name: "Boys Dino Print T-Shirt & Shorts Set",
    image: "/images/boys-set.jpg",
    size: ["S", "M", "L"],
    size_kids: ["3-4yrs", "5-6yrs", "7-8yrs"],
    category: "Set",
    gender: "kids",
    color: "Green",
    price: 749,
    brandname: "AdventureWear",
    stock: 35,
    ratings: 5
  },
  {
    name: "Girls Floral Print Skirt & Top Set",
    image: "/images/girls-set.jpg",
    size: ["S", "M", "L"],
    size_kids: ["4-5yrs", "6-7yrs", "8-9yrs"],
    category: "Skirt Set",
    gender: "kids",
    color: "Multi-color Floral",
    price: 999,
    brandname: "GardenParty",
    stock: 30,
    ratings: 5
  },
  {
    name: "Girls Princess Birthday Frock",
    image: "/images/girls-frock.jpg",
    size: ["S", "M", "L"],
    size_kids: ["3-4yrs", "5-6yrs", "7-8yrs"],
    category: "Dress",
    gender: "kids",
    color: "Pink",
    price: 1299,
    brandname: "DreamyDresses",
    stock: 25,
    ratings: 4
  },

  // Men Accessories
  {
    name: "Men's Classic Bi-Fold Leather Wallet",
    image: "/images/a3.jpg",
    category: "Wallets",
    gender: "men",
    color: "Brown",
    price: 999,
    brandname: "LeatherCraft",
    stock: 50,
    ratings: 4
  },
  {
    name: "Men's Genuine Leather Casual Belt",
    image: "/images/a1.webp",
    size: ["30", "32", "34", "36", "38"],
    category: "Belts",
    gender: "men",
    color: "Black",
    price: 799,
    brandname: "BuckleUp",
    stock: 45,
    ratings: 5
  },
  {
    name: "Men's Stainless Steel Luxury Watch",
    image: "/images/a4.jpg",
    category: "Watches",
    gender: "men",
    color: "Silver",
    price: 2999,
    brandname: "Timeless",
    stock: 20,
    ratings: 2
  },
  {
    name: "Men's Stylish Aviator Sunglasses",
    image: "/images/a2.jpg",
    category: "Sunglasses",
    gender: "men",
    color: "Black",
    price: 1499,
    brandname: "ShadeMaster",
    stock: 30,
    ratings: 4
  },
  {
    name: "Men's Durable Travel Backpack",
    image: "/images/a5.jpg",
    category: "Bags",
    gender: "men",
    color: "Navy Blue",
    price: 1799,
    brandname: "ExplorerGear",
    stock: 25,
    ratings: 4
  },

  // Women Accessories
  {
    name: "Women's Chic Zip-Around Leather Wallet",
    image: "/images/a7.jpg",
    category: "Wallets",
    gender: "women",
    color: "Red",
    price: 999,
    brandname: "FashionPouch",
    stock: 50,
    ratings: 4
  },
  {
    name: "Women's Elegant Wide-Brim Hat",
    image: "/images/a6.jpg",
    category: "Hats",
    gender: "women",
    color: "Beige",
    price: 399,
    brandname: "SunSmart",
    stock: 40,
    ratings: 4
  },
  {
    name: "Women's Crystal Embellished Watch",
    image: "/images/a9.jpg",
    category: "Watches",
    gender: "women",
    color: "Rose Gold",
    price: 2499,
    brandname: "GlamTime",
    stock: 22,
    ratings: 4
  },
  {
    name: "Women's Vintage Cat-Eye Sunglasses",
    image: "/images/a8.jpg",
    category: "Sunglasses",
    gender: "women",
    color: "Tortoise Shell",
    price: 1599,
    brandname: "RetroShades",
    stock: 35,
    ratings: 4
  },
  {
    name: "Women's Premium Leather Tote Bag",
    image: "/images/a10.jpg",
    category: "Bags",
    gender: "women",
    color: "Tan",
    price: 2999,
    brandname: "CarryAll",
    stock: 18,
    ratings: 5
  },
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