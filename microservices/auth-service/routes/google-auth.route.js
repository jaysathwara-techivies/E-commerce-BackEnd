const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/auth/google/success');
  }
);

router.get('/auth/google/success', (req, res) => {
  res.status(200).json({ message: 'Google authentication successful', user: req.user });
});

module.exports = router;
