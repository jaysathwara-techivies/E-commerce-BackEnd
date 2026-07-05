require('dotenv').config();
const app = require('./app');
const connectDB = require('./db');

const PORT = process.env.ADDRESS_SERVICE_PORT || 5008;
const HOST = process.env.HOST || 'localhost';

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, HOST, () => {
      console.log(`Address service running on http://${HOST}:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start address service', err);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
  process.exit(1);
});

start();
