const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    items: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],
    total: {
        type: Number,
        required: true
    },
    shippingAddress: {
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'shipped', 'delivered', 'canceled'],
        default: 'pending'
    },
    orderCanceledAt: {
         type: Date,
         default: null
    },
    orderShippedAt: {
        type: Date,
        default: null
    },
    deliverdAt: {
        type: Date,
        default: null
    }
    
});

module.exports = mongoose.model('Order', orderSchema);
