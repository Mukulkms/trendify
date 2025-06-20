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
    ratings: 4,
    discount: 8,
    description: "A comfortable and stylish black t-shirt featuring a unique graphic print, perfect for everyday casual wear."
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
    ratings: 3,
    discount: 12,
    description: "Classic dark blue slim-fit jeans, offering a modern silhouette and supreme comfort for any occasion."
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
    ratings: 5,
    discount: 15,
    description: "Stay warm and stylish with this soft, oversized grey hoodie, ideal for lounging or a relaxed street look."
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
    ratings: 4,
    discount: 6,
    description: "The ultimate basic white round neck t-shirt, a versatile staple for any wardrobe."
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
    ratings: 5,
    discount: 10,
    description: "Explore the galaxy in style with this navy blue graphic t-shirt featuring a 'Cosmic Explorer' design."
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
    ratings: 3,
    discount: 14,
    description: "Elevate your athletic style with this black Reebok sportswear hoodie, designed for comfort and performance."
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
    ratings: 4,
    discount: 9,
    description: "Achieve peak performance and comfort with these charcoal grey Puma joggers, perfect for your workouts or casual outings."
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
    ratings: 3,
    discount: 11,
    description: "An olive green R-Hoodie from the Athletic Series, combining urban style with sports functionality."
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
    ratings: 4,
    discount: 13,
    description: "A timeless light wash denim jacket, a versatile piece for layering and adding a rugged edge to your look."
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
    ratings: 5,
    discount: 7,
    description: "A crisp sky blue Oxford button-down shirt, perfect for both formal and smart-casual occasions."
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
    ratings: 5,
    discount: 5,
    description: "Embrace the outdoors with this forest green pullover hoodie from the 'Adventure Series', built for comfort and durability."
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
    ratings: 4,
    discount: 12,
    description: "A beautiful white t-shirt adorned with a vibrant floral print, perfect for a fresh and casual look."
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
    ratings: 5,
    discount: 8,
    description: "Stay cozy and fashionable in this lavender sports hoodie, designed for active women who value style."
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
    ratings: 4,
    discount: 15,
    description: "Light grey crop fit joggers, offering ultimate comfort and a trendy look for your loungewear collection."
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
    ratings: 4,
    discount: 10,
    description: "Stylish faded blue denim jeans for women, a must-have for a relaxed yet fashionable outfit."
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
    ratings: 3,
    discount: 6,
    description: "Embrace your adventurous spirit with this cream graphic tee featuring a 'Wanderlust' design."
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
    ratings: 4,
    discount: 14,
    description: "Indulge in the softness of this blush pink knit hoodie, perfect for cozy evenings."
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
    ratings: 5,
    discount: 9,
    description: "High-performance black athleisure leggings, providing flexibility and support for all your activities."
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
    ratings: 4,
    discount: 11,
    description: "A trendy mustard yellow vintage wash t-shirt, giving a cool, retro vibe to your outfit."
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
    ratings: 2,
    discount: 7,
    description: "An elegant dusty rose top with delicate ruffle sleeves, perfect for a sophisticated look."
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
    ratings: 5,
    discount: 13,
    description: "A smart navy blazer, an essential piece for a polished and professional office attire."
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
    ratings: 4,
    discount: 5,
    description: "Floaty and feminine, this bohemian floral print midi dress is perfect for warm summer days."
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
    ratings: 5,
    discount: 12,
    description: "A versatile blue denim A-line skirt, a timeless piece that can be dressed up or down."
  },

  // Kids Products
  {
    name: "Boys Cartoon Print T-Shirt 'Dino Fun'",
    image: "/images/kids_boy_tee1.webp",
    size: ["XS", "S", "M", "L"], // Keeping this for general sizing, but `size_kids` will be used by frontend logic
    size_kids: ["2-3yrs", "4-5yrs", "6-7yrs", "8-9yrs"],
    category: "T-Shirt",
    gender: "kids",
    color: "Blue",
    price: 499,
    brandname: "KidsPlay",
    stock: 60,
    ratings: 4,
    discount: 8,
    description: "A playful blue t-shirt for boys, featuring an exciting 'Dino Fun' cartoon print, perfect for everyday adventures."
  },
  {
    name: "Girls Polka Dot Party Dress",
    image: "/images/kids_girl_dress1.webp",
    size: ["S", "M", "L"], // Keeping this for general sizing
    size_kids: ["3-4yrs", "5-6yrs", "7-8yrs"],
    category: "Dress",
    gender: "kids",
    color: "Red with White Dots",
    price: 799,
    brandname: "LittlePrincess",
    stock: 40,
    ratings: 5,
    discount: 15,
    description: "A charming red polka dot party dress for girls, designed to make every occasion special."
  },
  {
    name: "Boys Casual Plaid Shirt",
    image: "/images/kids_boy_shirt1.webp",
    size: ["S", "M", "L"], // Keeping this for general sizing
    size_kids: ["4-5yrs", "6-7yrs", "8-9yrs"],
    category: "Shirt",
    gender: "kids",
    color: "Red Plaid",
    price: 699,
    brandname: "RoughNReady",
    stock: 35,
    ratings: 3,
    discount: 10,
    description: "A comfortable red plaid shirt for boys, ideal for a casual yet smart look."
  },
  {
    name: "Girls Graphic Print T-Shirt 'Fishes'",
    image: "/images/kids_girl_tee1.webp",
    size: ["XS", "S", "M"], // Keeping this for general sizing
    size_kids: ["2-3yrs", "4-5yrs", "6-7yrs"],
    category: "T-Shirt",
    gender: "kids",
    color: "Pink",
    price: 399,
    brandname: "OceanKids",
    stock: 70,
    ratings: 5,
    discount: 6,
    description: "Dive into fun with this pink graphic t-shirt for girls, featuring an adorable 'Fishes' print."
  },
  {
    name: "Boys Solid Fleece Hoodie",
    image: "/images/kids_boy_hoodie1.webp",
    size: ["M", "L", "XL"], // Keeping this for general sizing
    size_kids: ["6-7yrs", "8-9yrs", "10-12yrs"],
    category: "Hoodie",
    gender: "kids",
    color: "Navy Blue",
    price: 999,
    brandname: "WarmKids",
    stock: 30,
    ratings: 4,
    discount: 14,
    description: "A warm and cozy navy blue fleece hoodie for boys, perfect for chilly days and outdoor play."
  },
  {
    name: "Girls Soft Knit Top with Bow",
    image: "/images/kids_girl_top1.webp",
    size: ["XS", "S", "M"], // Keeping this for general sizing
    size_kids: ["3-4yrs", "5-6yrs", "7-8yrs"],
    category: "Top",
    gender: "kids",
    color: "Peach",
    price: 549,
    brandname: "CuteAttire",
    stock: 45,
    ratings: 3,
    discount: 9,
    description: "A charming peach soft knit top for girls, adorned with a cute bow for an extra touch of sweetness."
  },
  {
    name: "Boys Zip-Up Jacket 'Sports Edition'",
    image: "/images/kids-jacket.jpg",
    size: ["M", "L", "XL"], // Keeping this for general sizing
    size_kids: ["6-7yrs", "8-9yrs", "10-12yrs"],
    category: "Jacket",
    gender: "kids",
    color: "Red",
    price: 899,
    brandname: "ActiveKids",
    stock: 28,
    ratings: 4,
    discount: 11,
    description: "A sporty red zip-up jacket for boys from the 'Sports Edition', designed for comfort and ease of movement."
  },
  {
    name: "Boys Dino Print T-Shirt & Shorts Set",
    image: "/images/boys-set.jpg",
    size: ["S", "M", "L"], // Keeping this for general sizing
    size_kids: ["3-4yrs", "5-6yrs", "7-8yrs"],
    category: "Set",
    gender: "kids",
    color: "Green",
    price: 749,
    brandname: "AdventureWear",
    stock: 35,
    ratings: 5,
    discount: 7,
    description: "A fun green t-shirt and shorts set for boys, featuring an exciting dino print, perfect for playtime."
  },
  {
    name: "Girls Floral Print Skirt & Top Set",
    image: "/images/girls-set.jpg",
    size: ["S", "M", "L"], // Keeping this for general sizing
    size_kids: ["4-5yrs", "6-7yrs", "8-9yrs"],
    category: "Skirt Set",
    gender: "kids",
    color: "Multi-color Floral",
    price: 999,
    brandname: "GardenParty",
    stock: 30,
    ratings: 5,
    discount: 13,
    description: "A delightful multi-color floral print skirt and top set for girls, ideal for a garden party or special outing."
  },
  {
    name: "Girls Princess Birthday Frock",
    image: "/images/girls-frock.jpg",
    size: ["S", "M", "L"], // Keeping this for general sizing
    size_kids: ["3-4yrs", "5-6yrs", "7-8yrs"],
    category: "Dress",
    gender: "kids",
    color: "Pink",
    price: 1299,
    brandname: "DreamyDresses",
    stock: 25,
    ratings: 4,
    discount: 5,
    description: "A beautiful pink princess frock for girls, perfect for birthdays and making dreams come true."
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
    ratings: 4,
    discount: 12,
    description: "A timeless brown bi-fold leather wallet, combining classic style with practical functionality."
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
    ratings: 5,
    discount: 8,
    description: "A durable genuine leather casual belt in black, an essential accessory for any man's wardrobe."
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
    ratings: 2,
    discount: 15,
    description: "A sophisticated silver stainless steel luxury watch, perfect for adding a touch of elegance to any attire."
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
    ratings: 4,
    discount: 10,
    description: "Protect your eyes in style with these classic black aviator sunglasses, a timeless accessory."
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
    ratings: 4,
    discount: 6,
    description: "A sturdy navy blue travel backpack, designed for durability and ample storage on your adventures."
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
    ratings: 4,
    discount: 14,
    description: "A vibrant red zip-around leather wallet for women, combining chic design with practical organization."
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
    ratings: 4,
    discount: 9,
    description: "An elegant wide-brim hat in beige, offering stylish sun protection for any outdoor occasion."
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
    ratings: 4,
    discount: 11,
    description: "A stunning rose gold watch embellished with crystals, perfect for adding a touch of glamour to your wrist."
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
    ratings: 4,
    discount: 7,
    description: "Embrace a retro look with these tortoise shell vintage cat-eye sunglasses, a chic and timeless accessory."
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
    ratings: 5,
    discount: 13,
    description: "A spacious and stylish tan premium leather tote bag, ideal for daily use and carrying all your essentials."
  },
];

mongoose.connect('mongodb://localhost:27017/Trendify')
  .then(async () => {
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('\nCleared existing products');

    // Insert new products with descriptions and discounts
    await Product.insertMany(allProducts);
    console.log(`\n✅ Successfully seeded ${allProducts.length} products with descriptions and discounts!`);

    mongoose.connection.close();
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });