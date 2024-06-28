const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true
    },
    price: {
        type: Number,
        // required: true
    },
    description: {

        type: String,
        // required: true
    },
    category: {
        type: String,
        // required: true
    },
    stock: {
        type: Number,
        // required: true
    },
    img: {
        type: String,
        default: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTpbD_maSJbHcctXrHzN6TbTcQHe6nqwa5oM0CsTk_xULRRPJJdOeyVlsn2ofCye92fJSAL7N0F2zYNrKwnFIVC4sc_OsCgcEYHV6nXAmDfqaGLKG6wFjIUlw'
    },
    gender: {
        type: String,
        // required: true
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;