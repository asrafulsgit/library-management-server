"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.booksSummary = exports.borrowBook = exports.deleteBook = exports.updateBook = exports.getBookById = exports.getAllBooks = exports.createBook = void 0;
const Book_model_1 = __importDefault(require("../models/Book.model"));
const Borrow_model_1 = __importDefault(require("../models/Borrow.model"));
const errorHandler_1 = require("../middlewares/errorHandler");
const zod_1 = require("zod");
// Create a new book
const createBook = async (req, res) => {
    try {
        const parsed = errorHandler_1.createBookSchema.parse(req.body);
        const existing = await Book_model_1.default.findOne({ isbn: parsed.isbn });
        if (existing) {
            return res.status(400).json((0, errorHandler_1.generateValidationError)({
                isbn: {
                    message: 'Book with this ISBN already exists',
                    name: 'ValidatorError',
                    properties: {
                        message: 'Book with this ISBN already exists',
                        type: 'unique'
                    },
                    kind: 'unique',
                    path: 'isbn',
                    value: parsed.isbn
                }
            }));
        }
        const newBook = new Book_model_1.default(parsed);
        const savedBook = await newBook.save();
        return res.status(201).json({
            success: true,
            message: 'Book created successfully',
            data: savedBook
        });
    }
    catch (err) {
        console.log(err);
        if (err instanceof zod_1.ZodError) {
            return res.status(400).json((0, errorHandler_1.generateZodError)(err, req.body));
        }
        return res.status(500).json((0, errorHandler_1.generaleError)(err));
    }
};
exports.createBook = createBook;
// Read books
const getAllBooks = async (req, res) => {
    try {
        const { filter, sortBy = 'createdAt', sort = 'desc', limit = '10' } = req.query;
        const query = {};
        if (filter) {
            query.genre = filter;
        }
        const sortOption = {};
        sortOption[sortBy] = sort === 'asc' ? 1 : -1;
        const books = await Book_model_1.default.find(query)
            .sort(sortOption)
            .limit(Number(limit));
        return res.status(200).json({
            success: true,
            message: 'Books retrieved successfully',
            data: books
        });
    }
    catch (err) {
        return res.status(500).json((0, errorHandler_1.generaleError)(err));
    }
};
exports.getAllBooks = getAllBooks;
// Read a book by ID
const getBookById = async (req, res) => {
    try {
        const parsed = errorHandler_1.bookIdValidation.parse(req.params);
        const book = await Book_model_1.default.findById(parsed.bookId);
        if (!book) {
            return res.status(404).json((0, errorHandler_1.generateValidationError)({
                bookId: {
                    message: 'Book not found!',
                    name: 'ValidatorError',
                    properties: {
                        message: 'Book not found!',
                        type: 'NotFound'
                    },
                    kind: 'NotFound',
                    path: 'bookId',
                    value: parsed.bookId
                }
            }));
        }
        return res.status(200).json({
            success: true,
            message: 'Book retrieved successfully',
            data: book
        });
    }
    catch (err) {
        console.error('Error fetching book by ID:', err);
        if (err instanceof zod_1.ZodError) {
            return res.status(400).json((0, errorHandler_1.generateZodError)(err, req.params));
        }
        return res.status(500).json((0, errorHandler_1.generaleError)(err));
    }
};
exports.getBookById = getBookById;
// Update a book by ID
const updateBook = async (req, res) => {
    try {
        const updateData = errorHandler_1.updateBookSchema.parse(req.body);
        const parsed = errorHandler_1.bookIdValidation.parse(req.params);
        const updatedBook = await Book_model_1.default.findByIdAndUpdate(parsed.bookId, updateData, {
            new: true
        });
        if (!updatedBook) {
            return res.status(404).json((0, errorHandler_1.generateValidationError)({
                bookId: {
                    message: 'Book not found',
                    name: 'ValidatorError',
                    properties: {
                        message: 'Book not found',
                        type: 'NotFound'
                    },
                    kind: 'NotFound',
                    path: 'bookId',
                    value: parsed.bookId
                }
            }));
        }
        return res.status(200).json({
            success: true,
            message: 'Book updated successfully',
            data: updatedBook
        });
    }
    catch (err) {
        console.error('Error updating book:', err);
        if (err instanceof zod_1.ZodError) {
            return res.status(400).json((0, errorHandler_1.generateZodError)(err, req.params));
        }
        return res.status(500).json((0, errorHandler_1.generaleError)(err));
    }
};
exports.updateBook = updateBook;
// Delete a book by ID
const deleteBook = async (req, res) => {
    try {
        const parsed = errorHandler_1.bookIdValidation.parse(req.params);
        const deletedBook = await Book_model_1.default.findByIdAndDelete(parsed.bookId);
        if (!deletedBook) {
            return res.status(404).json((0, errorHandler_1.generateValidationError)({
                bookId: {
                    message: 'Book not found',
                    name: 'ValidatorError',
                    properties: {
                        message: 'Book not found',
                        type: 'NotFound'
                    },
                    kind: 'NotFound',
                    path: 'bookId',
                    value: parsed.bookId
                }
            }));
        }
        return res.status(200).json({
            success: true,
            message: 'Book deleted successfully',
            data: null,
        });
    }
    catch (err) {
        console.error('Error deleting book:', err);
        if (err instanceof zod_1.ZodError) {
            return res.status(400).json((0, errorHandler_1.generateZodError)(err, req.params));
        }
        return res.status(500).json((0, errorHandler_1.generaleError)(err));
    }
};
exports.deleteBook = deleteBook;
// borrow a book
const borrowBook = async (req, res) => {
    try {
        const borrowBook = errorHandler_1.borrowBookSchema.parse(req.body);
        const { book: bookId, quantity, dueDate } = borrowBook;
        const book = await Book_model_1.default.findById(bookId);
        if (!book) {
            return res.status(404).json((0, errorHandler_1.generateValidationError)({
                book: {
                    message: 'Book not found',
                    name: 'ValidatorError',
                    properties: {
                        message: 'Book not found',
                        type: 'NotFound',
                    },
                    kind: 'NotFound',
                    path: 'book',
                    value: bookId,
                },
            }));
        }
        if (book.copies < quantity) {
            return res.status(400).json((0, errorHandler_1.generateValidationError)({
                copies: {
                    message: `Only ${book.copies} copies available`,
                    name: 'ValidatorError',
                    properties: {
                        message: `Only ${book.copies} copies available`,
                        type: 'min',
                        min: 1,
                    },
                    kind: 'min',
                    path: 'copies',
                    value: quantity,
                },
            }));
        }
        book.updateCopiesAfterBorrow(quantity);
        await book.save();
        const borrowRecord = new Borrow_model_1.default({
            book: bookId,
            quantity,
            dueDate,
        });
        const savedBorrow = await borrowRecord.save();
        return res.status(201).json({
            success: true,
            message: 'Book borrowed successfully',
            data: savedBorrow,
        });
    }
    catch (err) {
        console.error('Error borrowing book:', err);
        if (err instanceof zod_1.ZodError) {
            return res.status(400).json((0, errorHandler_1.generateZodError)(err, req.body));
        }
        return res.status(500).json((0, errorHandler_1.generaleError)(err));
    }
};
exports.borrowBook = borrowBook;
// get books summary
const booksSummary = async (req, res) => {
    try {
        const summary = await Borrow_model_1.default.aggregate([
            {
                $group: {
                    _id: '$book',
                    totalQuantity: { $sum: '$quantity' },
                },
            },
            {
                $lookup: {
                    from: 'books',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'bookDetails',
                },
            },
            { $unwind: '$bookDetails' },
            {
                $project: {
                    _id: 0,
                    book: {
                        title: '$bookDetails.title',
                        isbn: '$bookDetails.isbn',
                    },
                    totalQuantity: 1,
                },
            },
        ]);
        return res.status(200).json({
            success: true,
            message: 'Borrowed books summary retrieved successfully',
            data: summary,
        });
    }
    catch (error) {
        console.error('Error generating summary:', error);
        return res.status(500).json((0, errorHandler_1.generaleError)(error));
    }
};
exports.booksSummary = booksSummary;
