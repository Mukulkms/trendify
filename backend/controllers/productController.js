const Product = require("../models/Product");

const getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

const addProduct = async (req, res) => {
  const { name, price, category, image, stock } = req.body;
  const product = new Product({ name, price, category, image, stock });
  await product.save();
  res.status(201).json(product);
};

module.exports = {
  getProducts,
  addProduct,
};
