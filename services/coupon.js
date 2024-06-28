
const Coupon = require('../model/coupon')

const createCoupon = async (request, h) =>{
    console.log(' request.payload: ',  request.payload);
    try {
        const {code, discount, expiryDate, usageLimit} = request.payload;
        const coupon = new Coupon({code, discount, expiryDate, usageLimit });
        await coupon.save();
        return h.response(coupon)
    } catch (error) {
        console.log('error: ', error);
        return h.response(error)
        
    }
}

const applyCouponCode = async (request, h) =>{
    try {
        const {code} = request.payload;
        const coupon = await Coupon.findOne({code, isActive: true});
        console.log('coupon: ', coupon);

        if (!coupon) {
            return h.response({ message: 'Invalid coupon code' }).code(400);
        }

        if (coupon.expiryDate < new Date()) {
            return h.response({ message: 'Coupon has expired' }).code(400);
        }

        if (coupon.usageLimit <= coupon.timesUsed) {
            return h.response({ message: 'Coupon usage limit exceeded' }).code(400);
        }
        coupon.timesUsed++
        await coupon.save();

        return h.response({ discount: coupon.discount }).code(200);
    } catch (error) {
        return h.response(error)
    }
}

module.exports = {createCoupon, applyCouponCode}