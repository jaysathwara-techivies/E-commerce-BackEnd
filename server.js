require('dotenv').config();
const app = require('./app');
const connectDB = require('./db');

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, HOST, () => {
      console.log(`Server running on http://${HOST}:${PORT}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

start();
