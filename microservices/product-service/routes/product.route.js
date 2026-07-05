const express = require('express');
const upload = require('../upload');
const {
  getProducts,
  createProduct,
  editProduct,
  getProductByGender,
} = require('../controllers/product.controller');

const router = express.Router();

router.get('/api/products', getProducts);
router.post('/api/products', upload.single('img'), createProduct);
router.put('/api/products/:id', editProduct);
router.get('/api/getproducts', getProductByGender);

module.exports = router;
