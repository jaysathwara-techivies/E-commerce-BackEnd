const Order = require('../model/order')
const Product = require('../model/product')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const stripe = require('stripe')(process.env.strip_key);

async function createOrder(request, h) {
    try {
        const orderData = request.payload;
        await decreaseStock(orderData.items);
        const data = new Order(orderData);
        const order = await data.save()
        return h.response(order)
      } catch (error) {
        console.error(error);
        return h.response(error)
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

const getOrderHistory = async (request, h) => {
  try {
    const userId = request.auth.credentials.user;
    const { page = 1, limit = 5 } = request.query;
    const orders = await Order.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId._id) } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items._id',
          foreignField: '_id',
          as: 'productDetails'
        }
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
              price: '$items.price'
            }
          }
        }
      },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) }
    ]);

    const totalOrders = await Order.countDocuments({ user: new mongoose.Types.ObjectId(userId._id) });
    const totalPages = Math.ceil(totalOrders / limit);

    return h.response({
      orders,
      page:parseInt(page),
      limit,
      totalPages,
      totalOrders
    }).code(200);
  } catch (error) {
    console.error('Error fetching order history:', error);
    return h.response({ message: 'Server error' }).code(500);
  }
};

const mostSellingProducts = async (request, h) =>{
  try {
    const aggregateQUery = await Order.aggregate([
      { $unwind: "$items" },
      { $group: {
          _id: "$items._id", 
          totalQuantity: { $sum: "$items.quantity" }, 
          totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } } 
        }
      },
      { $sort: { totalQuantity: -1 } }, 
      { $limit: 5 }, 
      {
        $lookup: {
          from: "products", 
          localField: "_id", 
          foreignField: "_id", 
          as: "productDetails"
        }
      },
      { $unwind: "$productDetails" }
    ])
    return h.response(aggregateQUery)
  } catch (error) {
    return h.response(error)
  }
}

const stripePayment = async (request, h) =>{
  try {
    const {token ,amount} = request.payload
    const charge = await stripe.charges.create({
      amount: amount * 100, 
      currency: 'inr',
      source: token,
      description: 'Your Order Description'
    });

    return h.response({ success: true, charge });
  } catch (error) {
    return h.response({ success: false, error: error.message }).code(500);
    
  }
}

const totalSaleOfEachProduct = async (request, h) =>{
  try {
    const result = await Order.aggregate(
      [
        {
          $unwind: {
            path: "$items"
          }
        },
        {
          $group: {
            _id: "$items._id",
            totalQuantity: { $sum: "$items.quantity" },
            totalSales: {
              $sum: {
                $multiply: [
                  "$items.quantity",
                  "$items.price"
                ]
              }
            }
          }
        },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "product"
          }
        },
        {
          $unwind:  "$product",
        }
      ]
    )
    return h.response({data: result})
  } catch (error) {
    return h.response(error)
  }
}

const revenuePerUser = async (request, h) => {
  try {
    const result = await Order.aggregate(
      [
        {
          $match:{
            status:{$in :['delivered', 'shipped']}
          }
        },
        {
          $group: {
            _id: "$user",
            totalRevenue: { $sum: "$total" }
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user"
          }
        },
        {
          $unwind: "$user"
        },
        {
          $sort: {
            totalRevenue: -1
          }
        },
        {
          $limit: 10
        }
      ]
    )
    return h.response({data: result})
  } catch (error) {
    return h.response(error)
  }
}

const ordersByDate = async (request, h) =>{
  try {
    const { startDate, endDate } = request.query;
    const result = await Order.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            }
        }
    ]);
    return h.response(result)
  } catch (error) {
    return h.response(error)
    
  }
}

const cancelOrder = async (request, h) => {
  try {
    const { orderId } = request.params;
    console.log('orderId: ', orderId);
    const order = await Order.findById(orderId).populate('items._id');

    if (!order) {
      return h.response({ error: 'Order not found' }).code(404);
    }

    const currentTime = new Date();
    const orderTime = new Date(order.createdAt);
    const differenceInTime = currentTime - orderTime;
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    console.log('differenceInDays: ', differenceInDays);
    if (differenceInDays > 7) {
      return h.response({ error: 'Order cannot be canceled after 7 days' }).code(400);
    }

    order.status = 'canceled';
    order.orderCanceledAt = currentTime;

    // Restock products
    for (const item of order.items) {
      const product = item._id;
      product.stock += item.quantity;
      await product.save();
    }

    await order.save();
    const chargeId = order.chargeId;
    console.log('chargeId: ', chargeId);
    if (chargeId) {
      const refund = await stripe.refunds.create({
          charge: chargeId
      });
      return h.response({ message: 'Order canceled successfully, products restocked, and payment refunded', refund }).code(200);
  } else {
      return h.response({ message: 'Order canceled successfully and products restocked, but no charge ID found for refund' }).code(200);
  }
  } catch (error) {
    console.error(error);
    return h.response({ error: 'Internal Server Error' }).code(500);
  }
};

const getOrders = async(request, h) =>{
  try {
    const status = request.query.status    
    const result = await Order.aggregate([
    
        { $match: { status: status } },
        {$unwind: {
          path: "$items",
        }},
          {
          $lookup: {
            from: "products",
            localField: "items._id",
            foreignField: "_id",
            as: "productDetails"
          }
            
        },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "userDetails"
          }
        },
        {
          $addFields: {
            user: { $arrayElemAt: ["$userDetails", 0] },
          }
        },
        {
          $group: {
            _id: "$_id",
            status: { $first: "$status" },
            total: {$first: "$total"},
            user:{$first: "$userDetails"},
            createdAt: {$first: "$createdAt"},
            orderCanceledAt: {$first: "$orderCanceledAt"},
            orderShippedAt: {$first: "$orderShippedAt"},
            deliverdAt: {$first: "$deliverdAt"},
            productDetails: { $push: "$productDetails" }
          }
        },
        {
          $project: {
            userDetails: 0
          }
        }
      
    ]);
    return h.response(result)
  } catch (error) {
    return h.response(error)
  }
}

const shipOrder = async (request, h) => {
  try {
    const {orderId} = request.params;
    console.log('orderId: ', orderId);
    const order = await Order.findById(orderId);

    if (!order) {
      return h.response({ error: 'Order not found' }).code(404);
    }

    const currentTime = new Date();

    order.status = 'shipped';
    order.orderShippedAt = currentTime;
    await order.save();

    return h.response({ message: 'Order marked as shipped successfully' }).code(200);
  } catch (error) {
    return h.response({ error: 'Internal Server Error' }).code(500);
  }
};

const deliverOrder = async (request, h) => {
  try {
    const {orderId} = request.params;
    console.log('orderId: ', orderId);
    const order = await Order.findById(orderId);

    if (!order) {
      return h.response({ error: 'Order not found' }).code(404);
    }

    const currentTime = new Date();

    order.status = 'delivered';
    order.deliverdAt = currentTime;
    await order.save();

    return h.response({ message: 'Order Has Been Deliverd Successfully :)' }).code(200);
  } catch (error) {
    return h.response({ error: 'Internal Server Error' }).code(500);
  }
};

module.exports = {createOrder, getOrderHistory, mostSellingProducts,stripePayment, totalSaleOfEachProduct, revenuePerUser,ordersByDate, cancelOrder, getOrders, shipOrder,deliverOrder} 