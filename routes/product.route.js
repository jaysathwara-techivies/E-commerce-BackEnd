const {getProducts, createProduct, editProduct, getProductByGender} = require('../services/product');
const { protect, admin } = require('../middleware/middleware');
const upload = require('../upload')
const Joi = require('joi');
const File = require('../model/file')
const Product = require('../model/product')

const routes = [
  {
    method: 'GET',
    path: '/api/products',
    handler: getProducts,
  },
  {
    method: 'POST',
    path: '/api/products',
    options: {
      auth: 'jwt',
      pre: [{ method: admin }],
    //   payload: {
    //     output: 'stream',
    //     parse: false,
    //     multipart: true,
    //     allow: 'multipart/form-data',
    //     maxBytes: 10485760
    // },
    validate: {
      // payload: Joi.object({
      //     name: Joi.string().required(),
      //     price: Joi.number().required(),
      //     description: Joi.string().optional(),
      //     gender: Joi.string().required(),
      //     // img: Joi.any().optional()
      // }),
      failAction: (request, h, error) => {
          return h.response({ error: error.details[0].message }).takeover().code(400);
      },
    },
  },
  handler: async (request, h) => {
    try {
      const promise = new Promise((resolve, reject) => {
        upload.single('img')(request.raw.req, request.raw.res, (err) => {
          if (err) {
            return reject(err);
          }
          resolve(request.raw.req.file);
        });
      });

      const file = await promise;
      const data = request.payload;

      if (file) {
        const fileInfo = {
          filename: file.filename,
          path: file.path,
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size
        };

        const newFile = new File(fileInfo);
        await newFile.save();
        data.fileInfo = fileInfo;
      }

      const product = new Product(data);
      await product.save();
      return h.response(product).code(201);
    } catch (error) {
      console.log('error: ', error);
      return h.response({ error: error.message }).code(500);
    }
},
  },
  {
    method: 'PUT',
    path: '/api/products/{id}',
    handler: editProduct
  },
  {
    method: 'GET',
    path: '/api/getproducts',
    handler: getProductByGender
  }
];

module.exports = routes;
