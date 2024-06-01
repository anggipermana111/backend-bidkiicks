const mongoose = require('mongoose');

const BidSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  amount: { type: Number, required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  bidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Bid', BidSchema);