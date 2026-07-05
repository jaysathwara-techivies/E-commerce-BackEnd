const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true },
  otp: { type: String },
  otpExpires: { type: Date },
});

const Auth = mongoose.model('Auth', authSchema);
module.exports = Auth;
