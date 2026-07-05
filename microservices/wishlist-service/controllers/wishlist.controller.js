const Product = require('../models/product');
const Wishlist = require('../models/wishlist');
const mongoose = require('mongoose');

const addToWishlist = async (req, res) => {
  try {
    const { user, productId } = req.body;
    let wishlist = await Wishlist.findOne({ user });
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (!wishlist) {
      wishlist = new Wishlist({ user, products: [product._id] });
    } else if (!wishlist.products.some((id) => id.equals(product._id))) {
      wishlist.products.push(product._id);
    }

    await wishlist.save();
    const populatedWishlist = await Wishlist.findById(wishlist._id).populate('products');
    return res.status(201).json(populatedWishlist);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getWishlist = async (req, res) => {
  try {
    const { user } = req.query;
    const wishlist = await Wishlist.findOne({ user }).populate('products');
    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }
    return res.status(200).json(wishlist);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { user } = req.query;
    const { productId } = req.params;
    const wishlist = await Wishlist.findOne({ user });

    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }

    const productObjectId = new mongoose.Types.ObjectId(productId);
    const productExists = wishlist.products.some((id) => id.equals(productObjectId));

    if (!productExists) {
      return res.status(404).json({ error: 'Product not found in wishlist' });
    }

    wishlist.products = wishlist.products.filter((id) => !id.equals(productObjectId));
    await wishlist.save();

    return res.status(200).json({ message: 'Product removed from wishlist' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { addToWishlist, getWishlist, removeFromWishlist };
