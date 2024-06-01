const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const bidRoutes = require('./routes/bids');
const userRoutes = require('./routes/users');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());

app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true // Tambahkan credentials: true agar cookie dapat dikirimkan ke frontend
}));


app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // menyajikan file statis

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/users', userRoutes);

mongoose.connect(process.env.MONGO_URI).then(()=>console.log('MongoDB connected')).catch(err=>console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
