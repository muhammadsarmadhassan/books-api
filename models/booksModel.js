const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');


const booksSchema = new mongoose.Schema({
    publisherId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    bookTitle: {
        type: String,
        unique: [true, 'Books title should be unique.'],
        required: [true, 'BookName is missing']
    },

    bookPrice: {
        type: Number,
        required: [true, 'Price is missing']
    },

    totalBooksAmount: {
        type: Number,
        required: true,
    },

    books: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' },

});

// booksSchema.pre('save', async function (next) {
//     const thisObj = this;
//     if (!this.isModified('password')) {
//         return next();
//     }
//     try {
//         thisObj.password = await bcrypt.hash(thisObj.password, 10);
//         return next();
//     } catch (e) {
//         return next(e);
//     }
// });


booksSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });

module.exports = mongoose.model('books', booksSchema);
