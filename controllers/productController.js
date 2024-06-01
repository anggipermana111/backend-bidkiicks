const Product = require('../models/product');
const path = require('path');
const User = require('../models/user');
const { ObjectId } = require('bson');

// Menambah barang lelang
const addProduct = async (req, res) => {
  const { name, description, startingPrice, buyoutPrice, brand, season, color, releaseDate, retailPrice, condition } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  if (!imageUrl) {
    return res.status(400).json({ message: 'Image is required' });
  }

  const auctionEndTime = new Date();
  auctionEndTime.setHours(auctionEndTime.getHours() + 24); // Set waktu akhir lelang 24 jam dari sekarang

  try {
    const product = new Product({
      _id: new ObjectId().toString(),
      name,
      description,
      startingPrice,
      buyoutPrice,
      highestBid: 0,
      highestBidder: null,
      owner: req.userId,
      imageUrl,
      auctionEndTime,
      brand,
      views: 0,
      bids: [],
      season,
      color,
      releaseDate,
      retailPrice,
      condition,
      isSold: false
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

// Mendapatkan informasi produk berdasarkan ID produk
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate({
      path: 'bids.bidder',
      select: '-password'
    });

    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Increment views
    product.views += 1;
    await product.save();

    // Sort bids by amount in descending order
    product.bids.sort((a, b) => b.amount - a.amount);

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Membeli produk dengan buyout
const buyoutProduct = async (req, res) => {
  const { productId } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.isSold) {
      return res.status(400).json({ message: 'Product has already been sold' });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.balance < product.buyoutPrice) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Mengurangi saldo pengguna
    user.balance -= product.buyoutPrice;
    await user.save();

    // Mengubah status produk
    product.isSold = true;
    product.highestBid = product.buyoutPrice;
    product.highestBidder = user._id;

    await product.save();

    res.status(200).json({ message: 'Product bought successfully', product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Membayar produk setelah waktu lelang habis
const payForWonProduct = async (req, res) => {
  const { productId } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.isSold) {
      return res.status(400).json({ message: 'Product has already been sold' });
    }

    const currentTime = new Date();
    if (currentTime < product.auctionEndTime) {
      return res.status(400).json({ message: 'Auction time has not ended yet' });
    }

    if (req.userId.toString() !== product.highestBidder.toString()) {
      return res.status(400).json({ message: 'Only the highest bidder can pay for this product' });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.balance < product.highestBid) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Mengurangi saldo pengguna
    user.balance -= product.highestBid;
    await user.save();

    // Mengubah status produk
    product.isSold = true;
    await product.save();

    res.status(200).json({ message: 'Product paid successfully', product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addProduct, searchProducts, getProduct, buyoutProduct, payForWonProduct };
