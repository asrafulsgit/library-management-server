"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bookSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Book title is required']
    },
    author: {
        type: String,
        required: [true, 'Author name is required']
    },
    genre: {
        type: String,
        required: [true, 'Genre is required'],
        enum: {
            values: ['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY'],
            message: 'Genre must be one of: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY'
        }
    },
    isbn: {
        type: String,
        required: [true, 'ISBN is required'],
        unique: true
    },
    description: {
        type: String,
        default: ''
    },
    copies: {
        type: Number,
        required: true,
        min: [0, 'Copies cannot be negative'],
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value'
        }
    },
    available: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
bookSchema.pre('save', function (next) {
    if (this.isModified('copies') && this.copies === 0) {
        this.available = false;
    }
    next();
});
bookSchema.methods.updateCopiesAfterBorrow = async function (quantity) {
    this.copies -= quantity;
    if (this.copies <= 0) {
        this.available = false;
        this.copies = 0;
    }
};
const Book = (0, mongoose_1.model)('Book', bookSchema);
exports.default = Book;
