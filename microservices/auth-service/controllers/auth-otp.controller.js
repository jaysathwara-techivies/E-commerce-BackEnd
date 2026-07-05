const Auth = require('../models/auth');
const speakeasy = require('speakeasy');
const Twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const client = new Twilio(accountSid, authToken);

const sendOtp = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const otp = speakeasy.totp({
      secret: process.env.OTP_SECRET || 'TSPL',
      encoding: 'base32',
      step: 300,
    });

    let user = await Auth.findOne({ phoneNumber });
    if (!user) {
      user = new Auth({ phoneNumber });
    }
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: twilioPhoneNumber,
      to: phoneNumber,
    });

    return res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to send OTP' });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    const user = await Auth.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    user.otp = null;
    user.otpExpires = null;
    await user.save();
    return res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { sendOtp, verifyOtp };
