const express = require('express');
const {
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
} = require('../controllers/order.controller');

const router = express.Router();

router.post('/api/order', createOrder);
router.get('/api/orders/history', getOrderHistory);
router.get('/api/most-selling-product', mostSellingProducts);
router.post('/api/payment', stripePayment);
router.get('/api/order/totalsale', totalSaleOfEachProduct);
router.get('/api/order/totalrevenue', revenuePerUser);
router.get('/api/order/orderbydate', ordersByDate);
router.post('/api/order/:orderId/cancel', cancelOrder);
router.get('/api/order', getOrders);
router.post('/api/order/:orderId/ship', shipOrder);
router.post('/api/order/:orderId/deliver', deliverOrder);

module.exports = router;
