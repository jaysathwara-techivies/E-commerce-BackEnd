const { createAddress, getAddress, updateAddress} = require('../services/address')

module.exports = [
    {   
        method: 'POST',
        path: '/address',
        handler: createAddress
    },
    {   
        method: 'GET',
        path: '/address/{id}',
        handler: getAddress
    },
    {   
        method: 'PUT',
        path: '/address/{id}',
        handler: updateAddress
    },
]