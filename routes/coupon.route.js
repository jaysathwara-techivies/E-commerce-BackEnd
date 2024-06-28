const {createCoupon, applyCouponCode} = require('../services//coupon')

module.exports = [
    {
        method: 'POST',
        path: '/coupons',
        handler: createCoupon
    },
    {
        method: 'POST',
        path: '/apply-coupon',
        handler: applyCouponCode
    }
]