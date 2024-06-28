const {createOrder, getOrderHistory, mostSellingProducts, stripePayment, totalSaleOfEachProduct, revenuePerUser, ordersByDate, cancelOrder, getOrders, shipOrder, deliverOrder} = require('../services/order')
const { protect } = require('../middleware/middleware');

module.exports = [
    {
        method:'POST',
        path: '/api/order',
        handler: createOrder
    },
    {
        method: 'GET',
        path: '/api/orders/history',
        options: {
            auth: 'jwt',
            pre: [{ method: protect }]
        },
        handler: getOrderHistory,
    },
    {
        method: 'GET',
        path: '/api/most-selling-product',
        handler: mostSellingProducts
    },
    {
        method: 'POST',
        path: '/api/payment',
        handler: stripePayment
    },
    {
        method: 'GET',
        path: '/api/order/totalsale',
        handler: totalSaleOfEachProduct
    },
    {
        method: 'GET',
        path: '/api/order/totalrevenue',
        handler: revenuePerUser
    },
    {
        method: 'GET',
        path: '/api/order/orderbydate',
        handler: ordersByDate
    },
    {
        method: 'POST',
        path: '/api/order/{orderId}/cancel',
        handler: cancelOrder
    },
    {
        method: 'GET',
        path: '/api/order',
        handler: getOrders
    },
    {
        method: 'POST',
        path: '/api/order/{orderId}/ship',
        handler: shipOrder
    },
    {
        method: 'POST',
        path: '/api/order/{orderId}/deliver',
        handler: deliverOrder
    }
]