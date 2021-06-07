const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');


const adminSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'FirstName is missing']
    },

    lastName: {
        type: String,
        required: [true, 'LastName is missing']
    },

    userName: {
        type: String,
        unique: [true, 'UserName already taken'],
        required: true,
    },

    userType: {
        type: String,
        enum: ['admin', 'user'],
        required: true,
    },

    password: {
        type: String,
        required: true,
        select: false
    },

    email: {
        type: String,
        required: true,
        unique: [true, 'Email already in use.']
    },

    phoneNo: {
        type: Number,
        required: [true, 'PhoneNo is missing']
    },

    status: {
        type: String,
        default: 'Pending'
    },

    token: {
        type: Number,
    },

    books: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' },

});

adminSchema.pre('save', async function (next) {
    const thisObj = this;
    if (!this.isModified('password')) {
        return next();
    }
    try {
        thisObj.password = await bcrypt.hash(thisObj.password, 10);
        return next();
    } catch (e) {
        return next(e);
    }
});


adminSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });

module.exports = mongoose.model('admin', adminSchema);
