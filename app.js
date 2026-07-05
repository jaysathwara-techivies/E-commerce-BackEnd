const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

const productRoute = require('./routes/product.route');
const orderRoute = require('./routes/order.route');
const wishlistRoute = require('./routes/wishlist.route');
const reviewRoute = require('./routes/review.route');
const addressRoute = require('./routes/address.route');
const couponRoute = require('./routes/coupon.route');
const categoryRoute = require('./routes/category.route');
const adminDashboardRoute = require('./routes/admin-dashboard.route');

const app = express();
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Accept',
    'Authorization',
    'Content-Type',
    'If-None-Match',
    'Accept-language',
    'cache-control',
    'x-requested-with',
    'Access-Control-Allow-Origin',
  ],
  credentials: true  // ← REQUIRED for cookies
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(productRoute);
app.use(orderRoute);
app.use(wishlistRoute);
app.use(reviewRoute);
app.use(addressRoute);
app.use(couponRoute);
app.use(categoryRoute);
app.use(adminDashboardRoute);
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;
