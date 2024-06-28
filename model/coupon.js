const mongoose = require('mongoose');

const couponSchema = mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    discount: {
        type: Number,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    usageLimit: {
        type: Number,
    },
    timesUsed: {
        type: Number,
        default: 0
    }
})

const Coupon = mongoose.model('coupon', couponSchema);
module.exports = Coupon;