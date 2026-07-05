const Coupon = require('../model/coupon');

const createCoupon = async (req, res) => {
  try {
    const { code, discount, expiryDate, usageLimit } = req.body;
    const coupon = new Coupon({ code, discount, expiryDate, usageLimit });
    await coupon.save();
    return res.status(201).json(coupon);
  } catch (error) {
    console.log('error: ', error);
    return res.status(500).json(error);
  }
};

const applyCouponCode = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code, isActive: true });

    if (!coupon) {
      return res.status(400).json({ message: 'Invalid coupon code' });
    }

    if (coupon.expiryDate < new Date()) {
      return res.status(400).json({ message: 'Coupon has expired' });
    }

    if (coupon.usageLimit <= coupon.timesUsed) {
      return res.status(400).json({ message: 'Coupon usage limit exceeded' });
    }
    coupon.timesUsed += 1;
    await coupon.save();

    return res.status(200).json({ discount: coupon.discount });
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = { createCoupon, applyCouponCode };
