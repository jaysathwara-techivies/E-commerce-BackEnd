const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'admin', 'subAdmin'],
        default: 'user'
    },
    token: {
        type: String,
        default: ''
    }
});

userSchema.pre('save', async function(next){
    try {
        if (!this.isModified('password')) {
            return next();
        }
        const saltRounds = 10;
        const hash = await bcrypt.hash(this.password, saltRounds);
        this.password = hash;
        this.confirmPassword = hash;
        next();
    } catch (error) {
        next(error);
    }
})

const User = mongoose.model('user', userSchema)
module.exports = User 