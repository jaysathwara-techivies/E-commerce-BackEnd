const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');

require('./passport');

const authRoute = require('./routes/auth.route');
const authOtpRoute = require('./routes/auth-otp.route');
const googleAuthRoute = require('./routes/google-auth.route');

const app = express();

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Accept',
    'Authorization',
    'Content-Type',
    'If-None-Match',
    'Accept-language',
    'cache-control',
    'x-requested-with',
    'Access-Control-Allow-Origin',
  ],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

app.use('/api', authRoute);
app.use(authOtpRoute);
app.use(googleAuthRoute);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;
