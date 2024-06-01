const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 0 },
  paymentInfo: {
    cardNumber: { type: String, required: true },
    expirationDate: { type: String, required: true },
    CVV: { type: String, required: true }
  },
  billingAddress: {
    phoneNumber: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true }
  }
});

module.exports = mongoose.model('User', UserSchema);
