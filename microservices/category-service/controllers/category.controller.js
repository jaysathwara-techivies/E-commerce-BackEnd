const Category = require('../models/category');
const Product = require('../models/product');

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.create({ name, description });
    return res.status(201).json(category);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    const categoriesWithFlags = await Promise.all(
      categories.map(async (category) => {
        const productsUsingCategory = await Product.find({ category: category.name });
        return {
          ...category.toObject(),
          ShowDeleteButton: productsUsingCategory.length === 0,
        };
      })
    );
    return res.status(200).json(categoriesWithFlags);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    await Category.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = { createCategory, getCategories, deleteCategory };
