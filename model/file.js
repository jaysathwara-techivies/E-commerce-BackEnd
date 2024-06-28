const mongoose = require('mongoose')

const fileSchema = new mongoose.Schema({
    filename: String,
    path: String,
    originalname: String,
    mimetype: String,
    size: Number,
    uploadDate: { type: Date, default: Date.now }
});

const File = mongoose.model('file', fileSchema)
module.exports= File