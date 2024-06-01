const Product = require('../models/product');
const Bid = require('../models/bid');
const User = require('../models/user');

// const placeBid = async (req, res) => {
//   const { productId, amount } = req.body;

//   try {
//     const product = await Product.findById(productId);
//     if (!product) return res.status(404).json({ message: 'Product not found' });

//     // Periksa apakah lelang sudah berakhir
//     if (new Date() > product.auctionEndTime) {
//       return res.status(400).json({ message: 'Auction has ended' });
//     }

//     if (amount <= product.highestBid) {
//       return res.status(400).json({ message: 'Bid must be higher than current highest bid' });
//     }

//     const bid = new Bid({ amount, product: productId, bidder: req.user._id });
//     await bid.save();

//     product.highestBid = amount;
//     product.highestBidder = req.user._id;
//     product.bids.push({ amount, bidder: req.user._id, time: new Date() }); // Simpan data penawaran
//     await product.save();

//     res.status(201).json(bid);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// Menambah bid pada produk
const placeBid = async (req, res) => {
  const { productId, bidAmount } = req.body;

  try {
    const product = await Product.findById(productId).populate('bids.bidder');
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.isSold) {
      return res.status(400).json({ message: 'Product has already been sold' });
    }

    if (bidAmount <= product.highestBid) {
      return res.status(400).json({ message: 'Bid amount must be higher than the current highest bid' });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Tambah bid ke produk
    product.bids.push({
      amount: bidAmount,
      bidder: user._id,
      time: new Date()
    });

    // Update highestBid dan highestBidder
    product.highestBid = bidAmount;
    product.highestBidder = user._id;

    await product.save();

    res.status(200).json({ message: 'Bid placed successfully', product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const buyOutProduct = async (req, res) => {
  const { productId } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (!product.buyoutPrice) {
      return res.status(400).json({ message: 'Product does not have a buyout price' });
    }

    if (req.user.balance < product.buyoutPrice) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    product.highestBid = product.buyoutPrice;
    product.highestBidder = req.user._id;
    product.bids.push({ amount: product.buyoutPrice, bidder: req.user._id, time: new Date() }); // Simpan data penawaran
    await product.save();

    req.user.balance -= product.buyoutPrice;
    await req.user.save();

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { placeBid, buyOutProduct };
