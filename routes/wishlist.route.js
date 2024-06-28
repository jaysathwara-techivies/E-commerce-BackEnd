const {addToWishlist, getWhishlist, removeFromWishlist} = require('../services/wishlist')

module.exports = [
    {
        path:'/wishlist',
        method: 'POST',
        handler:addToWishlist
    },
    {
        path: '/wishlist',
        method: 'GET',
        handler: getWhishlist
    },
    {
        path: '/wishlist/{productId}',
        method: 'DELETE',
        handler: removeFromWishlist
    }
]