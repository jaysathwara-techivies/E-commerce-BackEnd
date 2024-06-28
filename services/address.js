const Address = require('../model/address')
const mongoose = require('mongoose')

const createAddress = async (request, h) =>{
    try {
        const address = await Address.create(request.payload)
        return h.response(address)
    } catch (error) {
        return h.response(error)
    }
}

const getAddress = async (request, h) => {
    try {
        const userId = request.params.id
        
        const objectId = new mongoose.Types.ObjectId(userId);
        

        const address = await Address.aggregate([
            { $match: { user: objectId } },
        ])
        
        return h.response(address)
    } catch (error) {
        return h.response(error)
    }
}

const updateAddress = async (request, h) => {
    try {
        const id = request.params.id
        const address = await Address.findByIdAndUpdate(id, request.payload, { new: true})
        return h.response(address)
        } catch (error) {
            return h.response(error)
            
    }
}

module.exports = {createAddress, getAddress, updateAddress}