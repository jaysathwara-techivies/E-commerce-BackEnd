const Category = require('../model/category')
const Product = require('../model/product')

const createCategory = async (request, h) => {
    try {
      const { name, description } = request.payload;
      const category = new Category({ name, description });
      const savedCategory = await category.save();
      return h.response(savedCategory).code(201);
    } catch (error) {
      return h.response(error).code(500);
    }
  };

  const getCategories = async (request, h) => {
    try {
      const categories = await Category.find();
      const categoriesWithFlags = await Promise.all(categories.map(async category => {
        const productsUsingCategory = await Product.find({ category: category.name });
        return {
          ...category.toObject(),
          ShowDeleteButton: productsUsingCategory.length === 0
        };
      }));
      return h.response(categoriesWithFlags).code(200);
    } catch (error) {
      return h.response(error).code(500);
    }
  };
  

  const deleteCategory = async (request, h) => {
    try {
      const { id } = request.params;
      const category = await Category.findById(id);
  
      if (!category) {
        return h.response({ message: 'Category not found'}).code(404);
      }
  
      await Category.findByIdAndDelete(id);
      return h.response({ message: 'Category deleted successfully'}).code(200);
    } catch (error) {
      return h.response(error).code(500);
    }
  };

  module.exports = {createCategory, getCategories, deleteCategory}