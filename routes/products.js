const express = require('express');
const { addProduct, searchProducts } = require('../controllers/productController');
const auth = require('../middlewares/auth');
const multer = require('multer');
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

router.post('/add', auth, upload.single('image'), addProduct);
router.get('/search', searchProducts);

module.exports = router;
