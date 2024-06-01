const User = require('../models/user');
const Product = require('../models/product');

// Mendapatkan semua user
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mendapatkan user berdasarkan ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mendapatkan semua user berdasarkan ID produk
const getUsersFromProductBids = async (req, res) => {
    try {
      const productId = req.params.productId;
  
      // Cari produk berdasarkan ID dan ambil hanya field bids
      const product = await Product.findById(productId).select('bids');
      if (!product) return res.status(404).json({ message: 'Product not found' });
  
      // Kumpulkan semua bidder IDs dari bids
      const bidderIds = product.bids.map(bid => bid.bidder.toString());
  
      // Hapus duplikat
      const uniqueBidderIds = [...new Set(bidderIds)];
  
      // Cari semua user berdasarkan unique bidder IDs
      let users = await User.find({ _id: { $in: uniqueBidderIds } });
  
      // Sortir pengguna berdasarkan urutan ID di bidderIds
      users = users.sort((a, b) => {
        return bidderIds.indexOf(a._id.toString()) - bidderIds.indexOf(b._id.toString());
      });
  
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  // Mendapatkan informasi pengguna berdasarkan _id
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password'); // Mengambil data pengguna kecuali password
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Menambah saldo pengguna
const topUpBalance = async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Invalid amount' });
  }

  try {
    console.log(req.userId);
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.balance += amount;
    await user.save();

    res.status(200).json({ message: 'Balance topped up successfully', balance: user.balance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllUsers, getUserById, getUsersFromProductBids,getUserProfile,topUpBalance };
