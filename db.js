const mongoose  = require('mongoose')
const dotEnv = require('dotenv')
dotEnv.config()
const mongoConnect = async () =>{
  try {
    await mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

module.exports = mongoConnect