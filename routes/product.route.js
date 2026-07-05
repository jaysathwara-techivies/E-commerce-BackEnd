const express = require('express');
const {
  getProducts,
  createProduct,
  editProduct,
  getProductByGender,
} = require('../services/product');
const { authenticate } = require('../middleware/auth');
const { admin } = require('../middleware/middleware');
const upload = require('../upload');

const router = express.Router();

router.get('/api/products', getProducts);
router.post(
  '/api/products',
  authenticate,
  admin,
  upload.single('img'),
  createProduct
);
router.put('/api/products/:id', editProduct);
router.get('/api/getproducts', getProductByGender);

module.exports = router;
