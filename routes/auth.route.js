const {registerUser, authUser, changePassword, resetPassword, changeProfile} = require('../services/auth')

module.exports = [
    {
        method: 'POST',
        path: '/api/user/register',
        handler: registerUser
    },
    {
        method: 'POST',
        path: '/api/user/login',
        handler: authUser
    },
    {
        method: 'POST',
        path: '/change-password',
        handler: changePassword,
    },
    {
        method: 'POST',
        path: '/reset-password',
        handler: resetPassword,
    },
    {
        method: 'POST',
        path: '/profile/{id}',
        handler: changeProfile
    }
]