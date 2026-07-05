const Address = require('../models/address');
const mongoose = require('mongoose');

const createAddress = async (req, res) => {
  try {
    const address = await Address.create(req.body);
    return res.status(201).json(address);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getAddress = async (req, res) => {
  try {
    const userId = req.params.id;
    const objectId = new mongoose.Types.ObjectId(userId);
    const address = await Address.aggregate([{ $match: { user: objectId } }]);
    return res.status(200).json(address);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const address = await Address.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json(address);
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = { createAddress, getAddress, updateAddress };
