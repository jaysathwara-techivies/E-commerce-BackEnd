const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true },
  otp: { type: String },
  otpExpires: { type: Date }
});

const Auth = mongoose.model('auth', userSchema);

module.exports = Auth;