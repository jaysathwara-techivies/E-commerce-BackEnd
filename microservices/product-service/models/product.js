const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String },
  price: { type: Number },
  description: { type: String },
  category: { type: String },
  stock: { type: Number },
  img: { type: String, default: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTpbD_maSJbHcctXrHzN6TbTcQHe6nqwa5oM0CsTk_xULRRPJJdOeyVlsn2ofCye92fJSAL7N0F2zYNrKwnFIVC4sc_OsCgcEYHV6nXAmDfqaGLKG6wFjIUlw' },
  gender: { type: String },
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
