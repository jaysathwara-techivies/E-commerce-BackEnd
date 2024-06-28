const Hapi = require('@hapi/hapi')
const connectDB = require('./db')
const authRoute = require('./routes//auth.route')
const productRoute = require('./routes/product.route')
const orderRoute = require('./routes/order.route')
const wishlistRoute = require('./routes/wishlist.route')
const reviewRoute = require('./routes/review.route')
const addressRoute = require('./routes/address.route')
const authOtpRoute = require('./routes/auth-otp')
const coponRoute = require('./routes/coupon.route')
const categoryRoute = require('./routes/category.route')
const User = require('./model/users')
const Jwt = require('@hapi/jwt')
require('./auth')
const init = async () => {
    const server = Hapi.server({
      port: 5000,
      host: 'localhost',
      routes: {
        cors: {
          origin: ['*'],
          headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match', 'Accept-language'],
          additionalHeaders: ['cache-control', 'x-requested-with', 'Access-Control-Allow-Origin']
      }
      }
    });
    await server.register(Jwt);
    server.auth.strategy('jwt', 'jwt', {
      keys: process.env.JWT_SECRET,
      verify: {
          aud: false,
          iss: false,
          sub: false,
          nbf: true,
          exp: true,
          maxAgeSec: 144000, 
          timeSkewSec: 15
      },
      validate: async (artifacts, request, h) => {
          const user = await User.findById(artifacts.decoded.payload.id).select('-password');
          if (!user) {
              return { isValid: false };
          }
          return {
              isValid: true,
              credentials: { user }
          };
      }
  });

  // server.auth.default('jwt');
    await connectDB()
    await server.start();
    await server.route([...authRoute, ...productRoute, ...orderRoute, ...wishlistRoute, ...reviewRoute, ...addressRoute, ...authOtpRoute, ...coponRoute, ...categoryRoute])
    
    console.log('Server running on %s', server.info.uri);
  };
  
  process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
  });
  
  init();