const User = require('../model/users');
const jwt = require('@hapi/jwt');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs')
const config = require('../config/config')

const nodemailer = require('nodemailer')
const randomString = require('randomstring');
dotenv.config();

const generateToken = (id, role) => {
  return jwt.token.generate(
    { id, role },
    { key: process.env.JWT_SECRET, algorithm: 'HS256' },
    { ttlSec: 36000 }
  );
};

const registerUser = async (request, h) => {
  const { name, email, password, role } = request.payload;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return h.response({ message: 'User already exists' }).code(400);
    }
    const user = await User.create({ name, email, password, role });
    if (user) {
      return h.response({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      }).code(201);
    }
  } catch (error) {
    return h.response({ message: error.message }).code(500);
  }
};

const authUser = async (request, h) => {
  const { email, password } = request.payload;
  try {
    const user = await User.findOne({ email });
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      return h.response({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      }).code(200);
    } else {
      return h.response({ message: 'Invalid email or password' }).code(401);
    }
  } catch (error) {
    return h.response({ message: error.message }).code(500);
  }
};

const sendMail = async (username, email, token) =>{
  let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
          user: config.emailUser,
          pass: config.emailPassword
      },
      debug: true
  })
  let mailOptions =  {
      from: 'jay.sathwara@techivies.com',
      to: email,
      subject: 'Reset PAssword', 
      text: `Hello ${username}`,
      html: `<b>Hello ${username} <a href='http://localhost:4200/resetpassword?token=${token}'> reset password </a> </b>`
  }
  transporter.sendMail(mailOptions, function (err,info){
      if (err) {
          console.log('err: ', err);
          
      } else{
          console.log(info.response);
      }
  });

}
const securePassword = async (password) =>{
  try {
      const passHash = await bcrypt.hash(password, 10)
      return passHash
  } catch (error) {
      return error
  }
}

const changePassword = async (request, h) => {
  try {
      const { email } = request.payload;
      const user = await User.findOne({ email });
      console.log('user: ', user);

      if (!user) {
          return h.response({ error: `No user found with this email ${email}` }).code(404);
      }

      const randomstring = randomString.generate()
      const data = await User.updateOne({email:email}, {$set: {token:randomstring}})
      sendMail(user.name,user.email,randomstring)

      return h.response({ message: 'Password Check Your Mail', data:data }).code(200);
  } catch (error) {
      console.error('Error changing password:', error);
      return h.response({ error: 'Internal Server Error' }).code(500);
  }
}

async function resetPassword (request, h) {
  try {
      const token = request.query.token
      const tokenData = await User.findOne({token: token})
      console.log('tokenData: ', tokenData);
      if (tokenData) {
          const password = request.payload.password
          const newPassword = await securePassword(password);
          const updatedData = await User.findByIdAndUpdate({_id:tokenData._id}, {$set: {password: newPassword, token: ''}}, {new: true})
          return h.response({ message: 'Password changed Successfully', data:updatedData }).code(200);
          
      }
      return h.response({ message: 'Token for reset password is expire', data:updatedData }).code(400);
  } catch (error) {
      return h.response({ error: 'Token for reset password is expire' }).code(500);
  }
}

const changeProfile = async (request, h) =>{
  try {
    const id = request.params.id;
    const {name} = request.payload
    const profile = await User.findByIdAndUpdate(id, {name}, {new: true})
    return h.response(profile)
  } catch (error) {
    return h.response(error)
  }
}


module.exports = {
  registerUser,
  authUser,
  changePassword,
  resetPassword,
  changeProfile
};
