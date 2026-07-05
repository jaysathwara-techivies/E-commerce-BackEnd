const express = require('express');
const {
  createCategory,
  getCategories,
  deleteCategory,
} = require('../services/category');
const { authenticate,authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/categories',authenticate,authorize('admin'), createCategory);
router.get('/get-categories' ,getCategories);
router.delete('/categories/:id', deleteCategory);

module.exports = router;
