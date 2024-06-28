const Auth = require('../model/auth')
const speakEasy = require('speakeasy')
const Twilio = require('twilio');

const accountSid = process.env.accountSid
const authToken = process.env.authToken
const twilioPhoneNumber = '+1 856 861 3429';
const client = new Twilio(accountSid, authToken);
const sendOtp = async (request, h) =>{
    try {
        const { phoneNumber } = request.payload;

        const otp = speakEasy.totp({
          secret: 'TSPL',
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
        try {
            await client.messages.create({
              body: `Your OTP is ${otp}`,
              from: twilioPhoneNumber,
              to: phoneNumber
            });
            console.log(`OTP for ${phoneNumber}: ${otp}`);
            return h.response({ message: 'OTP sent successfully' }).code(200);
          } catch (error) {
            console.error(`Failed to send OTP to ${phoneNumber}:`, error);
            return h.response({ message: 'Failed to send OTP' }).code(500);
          }
    } catch (error) {
        return h.response(error)
    }
}

const verifyOtp = async (request, h) => {
    try {

        const { phoneNumber, otp } = request.payload;

        const user = await Auth.findOne({ phoneNumber });

        if (!user) {
            return h.response({ message: 'User not found' }).code(404);
        }

        if (user.otp !== otp || user.otpExpires < new Date()) {
            return h.response({ message: 'Invalid or expired OTP' }).code(400);
        }

        user.otp = null;
        user.otpExpires = null;
        await user.save();

        return h.response({ message: 'OTP verified successfully' }).code(200);
    } catch (error) {
        return h.response(error)
    }
}

module.exports = {sendOtp, verifyOtp}