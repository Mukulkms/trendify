const dotenv = require('dotenv');
const connectDB = require('../config/db'); // Adjust path to your DB connection
const Category = require('../models/Category'); // Adjust path to your Category model

dotenv.config({ path: '../.env' }); // Load environment variables from .env
connectDB(); // Connect to your database

const categoriesToInsert = [
  "T-Shirt", "Shoes", "Jeans", "Hoodie", "Joggers", "Tops", "Leggings", "Top",
  "Dress", "Shirt", "Jacket", "Set", "Skirt Set", "Blazer", "Skirt",
  "Wallets", "Belts", "Watches", "Sunglasses", "Bags", "Hats",
];

const importCategories = async () => {
  try {
    console.log('--- Populating Categories Database ---');

    // Optional: Clear existing categories before re-populating to avoid duplicates if run multiple times
    // Be careful with this in production! Only use if you want to completely refresh the categories.
    console.log('Clearing existing categories...');
    await Category.deleteMany({});
    console.log('Existing categories cleared.');

    console.log('Inserting new categories...');
    const insertedCategories = await Category.insertMany(
      categoriesToInsert.map(name => ({ name }))
    );

    console.log(`${insertedCategories.length} categories imported successfully!`);
    console.log('--- Population Complete ---');
    process.exit(); // Exit the script gracefully
  } catch (error) {
    console.error('Error importing categories:', error);
    console.error(error.stack); // Log full stack trace for debugging
    process.exit(1); // Exit with an error code
  }
};

importCategories();