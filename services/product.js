const Product = require('../model/product');
const File = require('../model/file');

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const createProduct = async (req, res) => {
  try {
    const data = { ...req.body };

    if (req.file) {
      const fileInfo = {
        filename: req.file.filename,
        path: req.file.path,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      };
      const newFile = new File(fileInfo);
      await newFile.save();
      data.fileInfo = fileInfo;
    }

    const product = new Product(data);
    const savedProduct = await product.save();
    return res.status(201).json(savedProduct);
  } catch (error) {
    console.log('error: ', error);
    return res.status(500).json({ error: error.message });
  }
};

const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const editedProduct = await Product.findByIdAndUpdate(id, payload, { new: true });
    return res.status(200).json(editedProduct);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getProductByGender = async (req, res) => {
  try {
    const { gender } = req.query;
    if (!gender) {
      return res.status(400).send('Gender query parameter is required');
    }

    const aggregatedProducts = await Product.aggregate([
      { $match: { gender } },
    ]);
    return res.status(200).json(aggregatedProducts);
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = {
  getProducts,
  createProduct,
  editProduct,
  getProductByGender,
};
