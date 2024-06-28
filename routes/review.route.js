const {getReview, postReview, deleteReview, editReview} = require('../services/review')

module.exports = [
    {
        method: 'GET',
        path: '/review',
        handler: getReview
    },
    {
        method: 'POST',
        path: '/review',
        handler: postReview
    },
    {
        method: 'DELETE',
        path: '/review/{id}',
        handler: deleteReview
    },
    {
        method: 'PUT',
        path: '/review/{id}',
        handler: editReview
    }
]