const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const { getAllUsers, getUserById, getUsersFromProductBids, getUserProfile, topUpBalance } = require('../controllers/userController');

const router = express.Router();

router.get('/', getAllUsers);
router.post('/topup', verifyToken, topUpBalance);
router.get('/profile', verifyToken, getUserProfile);
router.get('/product/:productId', getUsersFromProductBids);
router.get('/:id', getUserById);

module.exports = router;
