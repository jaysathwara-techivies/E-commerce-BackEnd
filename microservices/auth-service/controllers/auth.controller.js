const jwt = require('jsonwebtoken');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const randomString = require('randomstring');
const bcrypt = require('bcryptjs');
const { setTokenCookies, generateTokens } = require('../utils/token');

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, role });
    if (!user) {
      return res.status(400).json({ message: 'Invalid user data' });
    }

    const { accessToken, refreshToken } = generateTokens({ id: user._id, email: user.email, role: user.role });
    setTokenCookies(res, accessToken, refreshToken);

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const authUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log(req);
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ message: 'Invalid credentials.' });

    const { accessToken, refreshToken } = generateTokens({ id: user.id, email: user.email, role: user.role });
    setTokenCookies(res, accessToken, refreshToken);
    return res.json({ message: 'Logged in.', token: accessToken, role: user.role, _id: user._id, userName: user.name });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const refreshToken = async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ message: 'No refresh token.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const { id, email, role } = decoded;
    const { accessToken, refreshToken } = generateTokens({ id, email, role });
    setTokenCookies(res, accessToken, refreshToken);
    res.json({ message: 'Tokens refreshed.', accessToken });
  } catch {
    res.status(403).json({ message: 'Invalid or expired refresh token.' });
  }
};

const sendMail = async (username, email, token) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: 'Reset Password',
    html: `<b>Hello ${username} <a href='http://localhost:4200/resetpassword?token=${token}'> reset password </a></b>`,
  };

  await transporter.sendMail(mailOptions);
};

const changePassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: `No user found with this email ${email}` });
    }
    const randomstring = randomString.generate();
    await User.updateOne({ email }, { $set: { token: randomstring } });
    await sendMail(user.name, user.email, randomstring);
    return res.status(200).json({ message: 'Password Check Your Mail' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.query;
    const tokenData = await User.findOne({ token });
    if (!tokenData) {
      return res.status(400).json({ message: 'Token for reset password is expired' });
    }
    const { password } = req.body;
    const newPassword = await bcrypt.hash(password, 10);
    const updatedData = await User.findByIdAndUpdate(tokenData._id, { $set: { password: newPassword, token: '' } }, { new: true });
    return res.status(200).json({ message: 'Password changed Successfully', data: updatedData });
  } catch (error) {
    return res.status(500).json({ error: 'Invalid or expired token' });
  }
};

const changeProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const profile = await User.findByIdAndUpdate(id, { name }, { new: true });
    return res.status(200).json(profile);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const logout = async (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  return res.json({ message: 'Logged out.' });
};

module.exports = { registerUser, authUser, changePassword, resetPassword, changeProfile, refreshToken, logout };
