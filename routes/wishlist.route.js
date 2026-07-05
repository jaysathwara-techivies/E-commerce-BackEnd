const express = require('express');
const {
  addToWishlist,
  getWhishlist,
  removeFromWishlist,
} = require('../services/wishlist');

const router = express.Router();

router.post('/wishlist', addToWishlist);
router.get('/get-wishlist', getWhishlist);
router.delete('/wishlist/:productId', removeFromWishlist);

module.exports = router;
