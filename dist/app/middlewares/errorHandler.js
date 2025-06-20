"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generaleError = exports.generateZodError = exports.generateValidationError = exports.bookIdValidation = exports.borrowBookSchema = exports.updateBookSchema = exports.createBookSchema = void 0;
const zod_1 = require("zod");
exports.createBookSchema = zod_1.z.object({
    title: zod_1.z.string({ required_error: 'Title is required' }),
    author: zod_1.z.string({ required_error: 'Author is required' }),
    genre: zod_1.z.enum(['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY'], {
        required_error: 'Genre is required',
        invalid_type_error: 'Invalid genre'
    }),
    isbn: zod_1.z.string({ required_error: 'ISBN is required' }),
    description: zod_1.z.string().optional(),
    copies: zod_1.z.number({
        required_error: 'Copies is required',
        invalid_type_error: 'Copies must be a number'
    }).min(0, 'Copies must be a non-negative number'),
    available: zod_1.z.boolean().optional().default(true)
});
exports.updateBookSchema = zod_1.z.object({
    title: zod_1.z.string({ required_error: 'Title is required' }).optional(),
    author: zod_1.z.string({ required_error: 'Author is required' }).optional(),
    genre: zod_1.z.enum(['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY'], {
        required_error: 'Genre is required',
        invalid_type_error: 'Invalid genre'
    }).optional(),
    isbn: zod_1.z.string({ required_error: 'ISBN is required' }).optional(),
    description: zod_1.z.string().optional(),
    copies: zod_1.z.number({
        required_error: 'Copies is required',
        invalid_type_error: 'Copies must be a number'
    }).min(0, 'Copies must be a non-negative number').optional(),
    available: zod_1.z.boolean().optional().default(true)
});
exports.borrowBookSchema = zod_1.z.object({
    book: zod_1.z.string().refine((val) => /^[a-f\d]{24}$/i.test(val), {
        message: 'Invalid book ID format',
    }),
    quantity: zod_1.z.number().int().positive({ message: 'Quantity must be a positive integer' }),
    dueDate: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'A valid due date is required',
    }),
});
exports.bookIdValidation = zod_1.z.object({
    bookId: zod_1.z.string().refine((val) => /^[a-f\d]{24}$/i.test(val), {
        message: 'Invalid book ID format',
    })
});
const generateValidationError = (errors) => {
    return {
        message: 'Validation failed',
        success: false,
        error: {
            name: 'ValidationError',
            errors
        }
    };
};
exports.generateValidationError = generateValidationError;
const generateZodError = (err, value) => {
    const formattedErrors = {};
    for (const e of err.errors) {
        const path = e.path[0];
        formattedErrors[path] = {
            message: e.message,
            name: 'ValidatorError',
            properties: {
                message: e.message,
                type: e.code,
                ...(e.code === 'too_small' && e.minimum !== undefined ? { min: e.minimum } : {}),
                ...(e.code === 'too_big' && e.maximum !== undefined ? { max: e.maximum } : {}),
                input: e.input // add the input value from zod error
            },
            kind: e.code,
            path: path,
            value: value ? value[path] : null
        };
    }
    return {
        message: 'Validation failed',
        success: false,
        error: {
            name: 'ValidationError',
            errors: formattedErrors
        }
    };
};
exports.generateZodError = generateZodError;
const generaleError = (err) => {
    return {
        message: 'Validation failed',
        success: false,
        error: {
            name: err.name || 'ServerError',
            errors: {
                general: {
                    message: err.message || 'Something went wrong',
                    name: err.name || 'Error',
                    properties: {
                        message: err.message,
                        type: 'internal'
                    },
                    kind: 'internal',
                    path: 'server',
                    value: null
                }
            }
        }
    };
};
exports.generaleError = generaleError;
