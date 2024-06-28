const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    address: {
        type: String,
        required: true
    }
})

const Address = mongoose.model('address', addressSchema)
module.exports = Address;