const express = require('express');
const { createCoupon, applyCouponCode } = require('../controllers/coupon.controller');

const router = express.Router();

router.post('/coupons', createCoupon);
router.post('/apply-coupon', applyCouponCode);

module.exports = router;
