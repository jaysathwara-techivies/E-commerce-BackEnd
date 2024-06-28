const Review = require('../model/review')

const getReview = async (request, h) =>{
    console.log('request: ', request);
    try {
        const {productId} = request.query
        const reviews = await Review.find({productId}).populate('userId');
        return h.response(reviews)
    } catch (error) {
        return h.response(error)
    }
}

const postReview = async (request, h) => {
    console.log('request: ', request);
    try {
        const {productId, userId, rating, reviewText} = request.payload
        const review = new Review({productId, userId, rating, reviewText})
        await review.save()
        return h.response(review)
    } catch (error) {
        return h.response(error)
    }
}

const deleteReview = async (request, h) =>{
    try {
        const review = await Review.findByIdAndDelete(request.params.id);
        if (!review) {
            return h.response().code(404);
        }
        return h.response({msg: 'Review Delete Successfully.'}).code(204);                                                
    } catch (error) {
        return h.response(error).code(500);

    }
}

const editReview = async (request, h) =>{
    try {
        const id = request.params.id
        const review  = await Review.findByIdAndUpdate(id, request.payload)
        return h.response(review)
    } catch (error) {
        return h.response(error)
    }
}

module.exports = { getReview, postReview, deleteReview, editReview }