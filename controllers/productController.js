const Product = require('../models/product');
const path = require('path');

const addProduct = async (req, res) => {
  const { name, description, startingPrice, buyoutPrice } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  if (!imageUrl) {
    return res.status(400).json({ message: 'Image is required' });
  }

  try {
    const product = new Product({
      name,
      description,
      startingPrice,
      buyoutPrice,
      owner: req.user._id,
      imageUrl
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const searchProducts = async (req, res) => {
  const { query } = req.query;

  try {
    const products = await Product.find({ name: new RegExp(query, 'i') });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addProduct, searchProducts };
