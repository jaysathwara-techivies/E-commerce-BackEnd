const Product = require('../model/product');

const getProducts = async (req, h) => {
  try {
    const products = await Product.find();
    return h.response(products).code(200);
  } catch (error) {
    return h.response(error).code(500);
  }
};

const createProduct = async (req, h) => {
  try {
    const product = new Product(req.payload);
    const savedProduct = await product.save();
    return h.response(savedProduct).code(201);
  } catch (error) {
    return h.response(error).code(500);
  }
};

const editProduct = async(request, h) => {
  try {
    const id = request.params.id
    const payload = request.payload
    const editedProduct = await Product.findByIdAndUpdate(id, payload, {new: true})
    return h.response(editedProduct)
  } catch (error) {
    return h.response(error)
  }
}

const getProductByGender = async (request, h) =>{
  try {
    const gender = request.query.gender;
    if (!gender) {
      return res.status(400).send("Gender query parameter is required");
    }

    const aggregatedProducts = await Product.aggregate([
      { $match: { gender: gender } },
    
    ]);
    return h.response(aggregatedProducts)
    } catch (error) {
      return h.response(error)
      
  }
}

module.exports = {
  getProducts,
  createProduct,
  editProduct,
  getProductByGender
};
