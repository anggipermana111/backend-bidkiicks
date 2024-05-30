const express = require('express');
const { placeBid, buyOutProduct } = require('../controllers/bidController');
const auth = require('../middlewares/auth');
const router = express.Router();

router.post('/place', auth, placeBid);
router.post('/buyout', auth, buyOutProduct);

module.exports = router;
