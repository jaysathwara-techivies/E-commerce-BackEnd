const Product = require('../model/product');
const Wishlist = require('../model/wishlist');
const mongoose = require('mongoose');

const addToWishlist = async (req, res) => {
  try {
    const { user, productId } = req.body;
    let wishlist = await Wishlist.findOne({ user });
    const products = await Product.findById(productId);

    if (!wishlist) {
      wishlist = new Wishlist({ user, products });
    } else if (!wishlist.products.includes(products)) {
      wishlist.products.push(products);
    }

    await wishlist.save();
    const populatedWishlist = await Wishlist.findById(wishlist._id).populate('products');

    return res.status(201).json(populatedWishlist);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getWhishlist = async (req, res) => {
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

    if (productExists) {
      wishlist.products = wishlist.products.filter((id) => !id.equals(productObjectId));
      await wishlist.save();
      return res.status(200).json({ message: 'Product removed from wishlist' });
    }
    return res.status(404).json({ error: 'Product not found in wishlist' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { addToWishlist, getWhishlist, removeFromWishlist };
