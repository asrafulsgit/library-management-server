"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const borrowSchema = new mongoose_1.Schema({
    book: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Book',
        required: [true, 'Borrowed book ID is required']
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'At least one copy must be borrowed'],
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer'
        }
    },
    dueDate: {
        type: Date,
        required: [true, 'Due date is required']
    }
}, {
    timestamps: true
});
const Borrow = (0, mongoose_1.model)('Borrow', borrowSchema);
exports.default = Borrow;
