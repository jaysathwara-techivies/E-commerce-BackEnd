const Product = require('../model/product');
const Wishlist = require('../model/wishlist')
const mongoose = require('mongoose');

const addToWishlist = async (request, h) => {
    try {
        const { user, productId } = request.payload;
        console.log('user: ', user);
        let wishlist = await Wishlist.findOne({ user });
        let products = await Product.findById(productId)

        if (!wishlist) {
            wishlist = new Wishlist({  user, products: products });
        } else {
            if (!wishlist.products.includes(products)) {
                wishlist.products.push(products);
            }
        }
        
        await wishlist.save();
        const populatedWishlist = await Wishlist.findById(wishlist._id).populate('products');
        console.log('populatedWishlist: ', populatedWishlist);

        return h.response(populatedWishlist).code(201);
    } catch (error) {
        return h.response({ error: error.message }).code(400);
    }
};

const getWhishlist = async (request, h) => {
    try {
        const user = request.query.user; // getting user ID from query parameters
        console.log('user: ', user);
        const wishlist = await Wishlist.findOne({user}).populate('products');
        
        if (!wishlist) {
            return h.response({ error: 'Wishlist not found' }).code(404);
        }

        return h.response(wishlist).code(200);
    } catch (error) {
        return h.response({ error: error.message }).code(400);
    }
};

const removeFromWishlist = async (request, h) => {
    try {
        const { user } = request.query;
        const productId = request.params.productId;

        const wishlist = await Wishlist.findOne({ user });
        if (!wishlist) {
            return h.response({ error: 'Wishlist not found' }).code(404);
        }

        console.log('wishlist: ', wishlist);

        const productObjectId = new mongoose.Types.ObjectId(productId);
        console.log('productObjectId: ', productObjectId);
        const productExists = wishlist.products.some(id => id.equals(productObjectId));
        console.log('productExists: ', productExists);


        if (productExists) {
            wishlist.products = wishlist.products.filter(id => !id.equals(productObjectId));
            await wishlist.save();
            return h.response({ message: 'Product removed from wishlist' }).code(200);
        } else {
            return h.response({ error: 'Product not found in wishlist' }).code(404);
        }
    } catch (error) {
        return h.response({ error: error.message }).code(500);
    }
}




  module.exports = {addToWishlist, getWhishlist, removeFromWishlist}