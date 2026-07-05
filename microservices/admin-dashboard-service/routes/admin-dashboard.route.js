const express = require('express');
const { getTotalRevenue, recentOrders } = require('../controllers/admin-dashboard.controller');

const router = express.Router();

router.get('/admin/dashboard-stats', getTotalRevenue);
router.get('/admin/recent-orders', recentOrders);

module.exports = router;
