const Order = require('../model/order');
const Product = require('../model/product');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const stripe = require('stripe')(process.env.strip_key);

async function createOrder(req, res) {
  try {
    const orderData = req.body;
    const data = new Order(orderData);
    const order = await data.save();
    await decreaseStock(orderData.items);
    return res.status(201).json(order);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
}

async function decreaseStock(items) {
  for (const item of items) {
    const product = await Product.findById(item._id);
    if (product) {
      product.stock -= item.quantity;
      await product.save();
    }
  }
}
async function getAccount() {
  const account = await stripe.accounts.retrieve();
  console.log(account);
}

const getOrderHistory = async (req, res) => {
  try {
    const userId = req.user;
    const { page = 1, limit = 5 } = req.query;
    const orders = await Order.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId._id) } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items._id',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      { $unwind: '$productDetails' },
      {
        $group: {
          _id: '$_id',
          user: { $first: '$user' },
          total: { $first: '$total' },
          shippingAddress: { $first: '$shippingAddress' },
          status: { $first: '$status' },
          createdAt: { $first: '$createdAt' },
          items: {
            $push: {
              product: '$productDetails',
              quantity: '$items.quantity',
              price: '$items.price',
            },
          },
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit, 10) },
    ]);

    const totalOrders = await Order.countDocuments({ user: new mongoose.Types.ObjectId(userId._id) });
    const totalPages = Math.ceil(totalOrders / limit);

    return res.status(200).json({
      orders,
      page: parseInt(page, 10),
      limit,
      totalPages,
      totalOrders,
    });
  } catch (error) {
    console.error('Error fetching order history:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const mostSellingProducts = async (req, res) => {
  try {
    await getAccount()

    const aggregateQUery = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items._id',
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      { $unwind: '$productDetails' },
    ]);
    return res.status(200).json(aggregateQUery);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const stripePayment = async (req, res) => {
  try {
    const { token, amount } = req.body;
    const charge = await stripe.charges.create({
      amount: amount * 100,
      currency: 'inr',
      source: token,
      description: 'Your Order Description',
    });

    return res.status(200).json({ success: true, charge });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const totalSaleOfEachProduct = async (req, res) => {
  try {
    const result = await Order.aggregate([
      { $unwind: { path: '$items' } },
      {
        $group: {
          _id: '$items._id',
          totalQuantity: { $sum: '$items.quantity' },
          totalSales: {
            $sum: { $multiply: ['$items.quantity', '$items.price'] },
          },
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
    ]);
    return res.status(200).json({ data: result });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const revenuePerUser = async (req, res) => {
  try {
    const result = await Order.aggregate([
      { $match: { status: { $in: ['delivered', 'shipped'] } } },
      {
        $group: {
          _id: '$user',
          totalRevenue: { $sum: '$total' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 },
    ]);
    return res.status(200).json({ data: result });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const ordersByDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const result = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
    ]);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('items._id');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const currentTime = new Date();
    const orderTime = new Date(order.createdAt);
    const differenceInTime = currentTime - orderTime;
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    if (differenceInDays > 7) {
      return res.status(400).json({ error: 'Order cannot be canceled after 7 days' });
    }

    order.status = 'canceled';
    order.orderCanceledAt = currentTime;

    for (const item of order.items) {
      const product = item._id;
      product.stock += item.quantity;
      await product.save();
    }

    await order.save();
    const chargeId = order.chargeId;
    if (chargeId) {
      const refund = await stripe.refunds.create({ charge: chargeId });
      return res.status(200).json({
        message: 'Order canceled successfully, products restocked, and payment refunded',
        refund,
      });
    }
    return res.status(200).json({
      message: 'Order canceled successfully and products restocked, but no charge ID found for refund',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const result = await Order.aggregate([
      { $match: { status } },
      { $unwind: { path: '$items' } },
      {
        $lookup: {
          from: 'products',
          localField: 'items._id',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $addFields: {
          user: { $arrayElemAt: ['$userDetails', 0] },
        },
      },
      {
        $group: {
          _id: '$_id',
          status: { $first: '$status' },
          total: { $first: '$total' },
          user: { $first: '$userDetails' },
          createdAt: { $first: '$createdAt' },
          orderCanceledAt: { $first: '$orderCanceledAt' },
          orderShippedAt: { $first: '$orderShippedAt' },
          deliverdAt: { $first: '$deliverdAt' },
          productDetails: { $push: '$productDetails' },
        },
      },
      { $project: { userDetails: 0 } },
    ]);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const shipOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const currentTime = new Date();
    order.status = 'shipped';
    order.orderShippedAt = currentTime;
    await order.save();

    return res.status(200).json({ message: 'Order marked as shipped successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deliverOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const currentTime = new Date();
    order.status = 'delivered';
    order.deliverdAt = currentTime;
    await order.save();

    return res.status(200).json({ message: 'Order Has Been Deliverd Successfully :)' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createOrder,
  getOrderHistory,
  mostSellingProducts,
  stripePayment,
  totalSaleOfEachProduct,
  revenuePerUser,
  ordersByDate,
  cancelOrder,
  getOrders,
  shipOrder,
  deliverOrder,
};
