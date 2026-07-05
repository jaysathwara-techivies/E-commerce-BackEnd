const Order = require('../models/order');
const User = require('../models/user');
const Product = require('../models/product');

const getTotalRevenue = async (req, res) => {
  try {
    const order = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$total' }, totalOrders: { $count: {} } } },
    ]);

    const user = await User.aggregate([
      { $match: { role: 'user' } },
      { $count: 'totalUsers' },
    ]);

    const product = await Product.aggregate([
      { $match: { stock: { $lt: 10 } } },
      { $count: 'totalLowStockProduct' },
    ]);

    const totalProduct = await Product.aggregate([{ $count: 'totalProducts' }]);
    const summary = order[0] || { totalRevenue: 0, totalOrders: 0 };
    const totalUsers = user[0]?.totalUsers || 0;
    const totalLowStockProduct = product[0]?.totalLowStockProduct || 0;
    const totalProducts = totalProduct[0]?.totalProducts || 0;

    return res.status(200).json({
      success: true,
      totalRevenue: summary.totalRevenue,
      totalOrders: summary.totalOrders,
      totalUsers,
      totalLowStockProduct,
      totalProducts,
    });
  } catch (error) {
    console.error('ERROR =>', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const recentOrders = async (req, res) => {
  try {
    const order = await Order.aggregate([
      { $sort: { createdAt: -1 } },
      { $limit: 5 },
    ]);
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getTotalRevenue, recentOrders };
