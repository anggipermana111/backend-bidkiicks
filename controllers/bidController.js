const Product = require('../models/product');
const Bid = require('../models/bid');

const placeBid = async (req, res) => {
  const { productId, amount } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (amount <= product.highestBid) {
      return res.status(400).json({ message: 'Bid must be higher than current highest bid' });
    }

    const bid = new Bid({ amount, product: productId, bidder: req.user._id });
    await bid.save();

    product.highestBid = amount;
    product.highestBidder = req.user._id;
    await product.save();

    res.status(201).json(bid);
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
    await product.save();

    req.user.balance -= product.buyoutPrice;
    await req.user.save();

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { placeBid, buyOutProduct };
