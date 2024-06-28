const jwt = require('@hapi/jwt');
const User = require('../model/users');
const dotenv = require('dotenv');
dotenv.config();

const protect = async (request, h) => {
  const token = request.headers.authorization.split(' ')[1]; 
  if (!token) {
      return h.response({ message: 'Not authorized, no token' }).code(401)
  }
  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password'); 
      if (!user) {
          return h.response({ message: 'Not authorized, user not found' }).code(401)
      }
      request.user = user;
      return h.continue;
  } catch (error) {
      return h.response({ message: 'Not authorized, token failed' }).code(401)
  }
};

const admin = (request, h) => {
  if (request.auth.credentials.user.role === 'admin' || request.auth.credentials.user.role === 'subAdmin' ) {
      return h.continue;
  } else {
      return h.response({ message: 'Not authorized as admin' }).code(403).takeover();
  }
};

module.exports = { protect, admin };
