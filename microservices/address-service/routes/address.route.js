const express = require('express');
const { createAddress, getAddress, updateAddress } = require('../controllers/address.controller');

const router = express.Router();

router.post('/address', createAddress);
router.get('/address/:id', getAddress);
router.put('/address/:id', updateAddress);

module.exports = router;
