const Review = require('../models/review');

const getReview = async (req, res) => {
  try {
    const { productId } = req.query;
    const reviews = await Review.find({ productId }).populate('userId');
    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const postReview = async (req, res) => {
  try {
    const { productId, userId, rating, reviewText } = req.body;
    const review = await Review.create({ productId, userId, rating, reviewText });
    return res.status(201).json(review);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).send();
    }
    return res.status(204).json({ msg: 'Review deleted successfully.' });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const editReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json(review);
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = { getReview, postReview, deleteReview, editReview };
