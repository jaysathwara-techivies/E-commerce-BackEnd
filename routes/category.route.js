const { createCategory, getCategories, deleteCategory } = require('../services/category')

module.exports = [
    {
        method: 'POST',
        path: '/categories',
        handler: createCategory
    },
    {
        method: 'GET',
        path: '/categories',
        handler: getCategories
    },
    {
        method: 'DELETE',
        path: '/categories/{id}',
        handler: deleteCategory
      }
]