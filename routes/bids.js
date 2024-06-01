const express = require('express');
const { placeBid, buyOutProduct } = require('../controllers/bidController');
const auth = require('../middlewares/auth');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();

router.post('/place', verifyToken, placeBid);
// router.post('/place', auth, placeBid);
router.post('/buyout', auth, buyOutProduct);

module.exports = router;
