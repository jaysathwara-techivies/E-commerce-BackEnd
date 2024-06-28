module.exports = [
    {
        method: 'GET',
        path: '/auth/google',
        options: {
            auth: 'google',
            handler: function (request, h) {
                return h.redirect('/auth/google/success');
            }
        }
    }
]