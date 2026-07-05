require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:5001';
const productServiceUrl = process.env.PRODUCT_SERVICE_URL || 'http://localhost:5002';
const orderServiceUrl = process.env.ORDER_SERVICE_URL || 'http://localhost:5003';
const wishlistServiceUrl = process.env.WISHLIST_SERVICE_URL || 'http://localhost:5004';
const reviewServiceUrl = process.env.REVIEW_SERVICE_URL || 'http://localhost:5005';
const categoryServiceUrl = process.env.CATEGORY_SERVICE_URL || 'http://localhost:5006';
const couponServiceUrl = process.env.COUPON_SERVICE_URL || 'http://localhost:5007';
const addressServiceUrl = process.env.ADDRESS_SERVICE_URL || 'http://localhost:5008';
const adminDashboardServiceUrl = process.env.ADMIN_DASHBOARD_SERVICE_URL || 'http://localhost:5009';

app.use(
  '/api/user',
  createProxyMiddleware({
    target: authServiceUrl,
    changeOrigin: true,
    logLevel: 'debug',
    onProxyReq(proxyReq, req) {
      console.log(
        `Forwarding ${req.method} ${req.originalUrl} -> ${authServiceUrl}${req.originalUrl}`
      );
    },
    onError(err, req, res) {
      console.error('Proxy Error:', err);
    },
  })
);
app.use('/change-password', createProxyMiddleware({ target: authServiceUrl, changeOrigin: true }));
app.use('/reset-password', createProxyMiddleware({ target: authServiceUrl, changeOrigin: true }));
app.use('/refresh-token', createProxyMiddleware({ target: authServiceUrl, changeOrigin: true }));
app.use('/user/logout', createProxyMiddleware({ target: authServiceUrl, changeOrigin: true }));
app.use('/send-otp', createProxyMiddleware({ target: authServiceUrl, changeOrigin: true }));
app.use('/verify-otp', createProxyMiddleware({ target: authServiceUrl, changeOrigin: true }));
app.use('/auth/google', createProxyMiddleware({ target: authServiceUrl, changeOrigin: true }));
app.use('/auth/google/callback', createProxyMiddleware({ target: authServiceUrl, changeOrigin: true }));
app.use('/auth/google/success', createProxyMiddleware({ target: authServiceUrl, changeOrigin: true }));

app.use('/api/products', createProxyMiddleware({ target: productServiceUrl, changeOrigin: true }));
app.use('/api/getproducts', createProxyMiddleware({ target: productServiceUrl, changeOrigin: true }));
app.use('/api/order', createProxyMiddleware({ target: orderServiceUrl, changeOrigin: true }));
app.use('/api/orders/history', createProxyMiddleware({ target: orderServiceUrl, changeOrigin: true }));
app.use('/api/most-selling-product', createProxyMiddleware({ target: orderServiceUrl, changeOrigin: true }));
app.use('/api/payment', createProxyMiddleware({ target: orderServiceUrl, changeOrigin: true }));
app.use('/api/order/totalsale', createProxyMiddleware({ target: orderServiceUrl, changeOrigin: true }));
app.use('/api/order/totalrevenue', createProxyMiddleware({ target: orderServiceUrl, changeOrigin: true }));
app.use('/api/order/orderbydate', createProxyMiddleware({ target: orderServiceUrl, changeOrigin: true }));
app.use('/api/order/:orderId/cancel', createProxyMiddleware({ target: orderServiceUrl, changeOrigin: true }));
app.use('/api/order/:orderId/ship', createProxyMiddleware({ target: orderServiceUrl, changeOrigin: true }));
app.use('/api/order/:orderId/deliver', createProxyMiddleware({ target: orderServiceUrl, changeOrigin: true }));
app.use('/wishlist', createProxyMiddleware({ target: wishlistServiceUrl, changeOrigin: true }));
app.use('/get-wishlist', createProxyMiddleware({ target: wishlistServiceUrl, changeOrigin: true }));
app.use('/review', createProxyMiddleware({ target: reviewServiceUrl, changeOrigin: true }));
app.use('/categories', createProxyMiddleware({ target: categoryServiceUrl, changeOrigin: true }));
app.use('/get-categories', createProxyMiddleware({ target: categoryServiceUrl, changeOrigin: true }));
app.use('/coupons', createProxyMiddleware({ target: couponServiceUrl, changeOrigin: true }));
app.use('/apply-coupon', createProxyMiddleware({ target: couponServiceUrl, changeOrigin: true }));
app.use('/address', createProxyMiddleware({ target: addressServiceUrl, changeOrigin: true }));
app.use('/admin/dashboard-stats', createProxyMiddleware({ target: adminDashboardServiceUrl, changeOrigin: true }));
app.use('/admin/recent-orders', createProxyMiddleware({ target: adminDashboardServiceUrl, changeOrigin: true }));

const PORT = process.env.GATEWAY_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Gateway running on http://localhost:${PORT}`);
});
