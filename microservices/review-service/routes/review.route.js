const express = require('express');
const {
  getReview,
  postReview,
  deleteReview,
  editReview,
} = require('../controllers/review.controller');

const router = express.Router();

router.get('/review', getReview);
router.post('/review', postReview);
router.delete('/review/:id', deleteReview);
router.put('/review/:id', editReview);

module.exports = router;
