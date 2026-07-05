require('dotenv').config();
const app = require('./app');
const connectDB = require('./db');

const PORT = process.env.ORDER_SERVICE_PORT || 5003;
const HOST = process.env.HOST || 'localhost';

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, HOST, () => {
      console.log(`Order service running on http://${HOST}:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start order service', err);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
  process.exit(1);
});

start();
