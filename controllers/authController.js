const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('bson');

// Signup user
const signupUser = async (req, res) => {
  const { firstName, lastName, email, password, balance, paymentInfo, billingAddress } = req.body;

  try {
    // Cek jika user sudah ada berdasarkan email
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Buat user baru dengan _id yang dihasilkan secara otomatis
    const newUser = new User({
      _id: new ObjectId().toString(), // Generate a new ObjectId
      firstName,
      lastName,
      email,
      password: hashedPassword,
      balance,
      paymentInfo,
      billingAddress
    });

    // Simpan user baru
    const savedUser = await newUser.save();

    // Buat token
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Cari user berdasarkan email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    // Cek password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    // Buat token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { signupUser, loginUser };
