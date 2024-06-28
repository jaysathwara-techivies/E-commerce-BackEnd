const {sendOtp, verifyOtp} = require('../services/auth-otp')

module.exports = [
    {
        method: 'POST',
        path: '/send-otp',
        handler: sendOtp
    },
    {
        method: 'POST',
        path: '/verify-otp',
        handler: verifyOtp
    }
]