const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
  description: { type: String, required: true },
  startingPrice: { type: Number, required: true },
  buyoutPrice: { type: Number },
  highestBid: { type: Number, default: 0 },
  highestBidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String, required: true },
  auctionEndTime: { type: Date, required: true },
  brand: { type: String, required: true },
  views: { type: Number, default: 0 },
  bids: [{
    amount: { type: Number, required: true },
    bidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    time: { type: Date, default: Date.now }
  }],
  season: { type: String, required: true },
  color: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  retailPrice: { type: Number, required: true },
  condition: { type: String, required: true },
  isSold: { type: Boolean, default: false } // Field untuk condition // Array untuk menyimpan semua penawaran
});

module.exports = mongoose.model('Product', ProductSchema);
