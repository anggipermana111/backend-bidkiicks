const express = require('express');
const { addProduct, searchProducts, getProduct, buyoutProduct, payForWonProduct } = require('../controllers/productController');
const auth = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();

// Konfigurasi Multer untuk upload gambar
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // menambahkan timestamp untuk menghindari duplikasi nama
  }
});
const upload = multer({ storage: storage });

router.post('/add', verifyToken, upload.single('image'), addProduct);
router.post('/buyout', verifyToken, buyoutProduct);
router.post('/pay', verifyToken, payForWonProduct);
router.get('/search', searchProducts);
router.get('/:id', getProduct); // Middleware untuk validasi ID

module.exports = router;
