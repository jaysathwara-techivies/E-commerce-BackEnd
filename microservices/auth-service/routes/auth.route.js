const express = require('express');
const {
  registerUser,
  authUser,
  changePassword,
  resetPassword,
  changeProfile,
  refreshToken,
  logout,
} = require('../controllers/auth.controller');

const router = express.Router();

router.post('/user/register', registerUser);
router.post('/user/login', authUser);
router.post('/change-password', changePassword);
router.post('/reset-password', resetPassword);
router.post('/profile/:id', changeProfile);
router.post('/refresh-token', refreshToken);
router.post('/user/logout', logout);

module.exports = router;
