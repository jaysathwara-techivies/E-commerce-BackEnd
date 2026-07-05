const express = require('express');
const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} = require('../controllers/wishlist.controller');

const router = express.Router();

router.post('/wishlist', addToWishlist);
router.get('/get-wishlist', getWishlist);
router.delete('/wishlist/:productId', removeFromWishlist);

module.exports = router;
