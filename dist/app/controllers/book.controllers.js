"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.booksSummary = exports.borrowBook = exports.deleteBook = exports.updateBook = exports.getBookById = exports.getAllBooks = exports.createBook = void 0;
const Book_model_1 = __importDefault(require("../models/Book.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const Borrow_model_1 = __importDefault(require("../models/Borrow.model"));
// Create a new book
const createBook = async (req, res) => {
    try {
        const { title, author, genre, isbn, description, copies, available = true } = req.body;
        if (!title || !author || !genre || !isbn || copies === undefined || copies < 0) {
            return res.status(400).json({
                message: 'title, author, genre, isbn, and copies are required.'
            });
        }
        const existing = await Book_model_1.default.findOne({ isbn });
        if (existing) {
            return res.status(404).json({
                message: 'Book with this ISBN already exists'
            });
        }
        const newBook = new Book_model_1.default({
            title,
            author,
            genre,
            isbn,
            description,
            copies,
            available
        });
        const savedBook = await newBook.save();
        return res.status(201).json({
            success: true,
            message: 'Book created successfully',
            data: savedBook
        });
    }
    catch (error) {
        console.error('Error creating book:', error);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
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
        // Fetch books with filters and sort
        const books = await Book_model_1.default.find(query)
            .sort(sortOption)
            .limit(Number(limit));
        return res.status(200).json({
            success: true,
            message: 'Books retrieved successfully',
            data: books
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};
exports.getAllBooks = getAllBooks;
// Read a book by ID
const getBookById = async (req, res) => {
    try {
        const { bookId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(bookId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid book ID format'
            });
        }
        const book = await Book_model_1.default.findById(bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found!'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Book retrieved successfully',
            data: book
        });
    }
    catch (error) {
        console.error('Error fetching book by ID:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};
exports.getBookById = getBookById;
// Update a book by ID
const updateBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        const updateData = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(bookId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid book ID format'
            });
        }
        const updatedBook = await Book_model_1.default.findByIdAndUpdate(bookId, updateData, { new: true });
        if (!updatedBook) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Book updated successfully',
            data: updatedBook
        });
    }
    catch (error) {
        console.error('Error updating book:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};
exports.updateBook = updateBook;
// Delete a book by ID
const deleteBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(bookId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid book ID format',
            });
        }
        const deletedBook = await Book_model_1.default.findByIdAndDelete(bookId);
        if (!deletedBook) {
            return res.status(404).json({
                success: false,
                message: 'Book not found',
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Book deleted successfully',
            data: null,
        });
    }
    catch (error) {
        console.error('Error deleting book:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};
exports.deleteBook = deleteBook;
// borrow a book
const borrowBook = async (req, res) => {
    try {
        const { book: bookId, quantity, dueDate } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(bookId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid book ID format'
            });
        }
        if (!quantity || quantity <= 0 || !Number.isInteger(quantity)) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be a positive integer'
            });
        }
        if (!dueDate) {
            return res.status(400).json({
                success: false,
                message: 'A valid due date is required'
            });
        }
        const book = await Book_model_1.default.findById(bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }
        if (book.copies < quantity) {
            return res.status(400).json({
                success: false,
                message: `Only ${book.copies} copies available`
            });
        }
        book.updateCopiesAfterBorrow(quantity);
        await book.save();
        const borrowRecord = new Borrow_model_1.default({
            book: bookId,
            quantity,
            dueDate
        });
        const savedBorrow = await borrowRecord.save();
        return res.status(201).json({
            success: true,
            message: 'Book borrowed successfully',
            data: savedBorrow
        });
    }
    catch (error) {
        console.error('Error borrowing book:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};
exports.borrowBook = borrowBook;
// get books summary
const booksSummary = async (req, res) => {
    try {
        const books = await Book_model_1.default.aggregate([
            {
                $group: {
                    _id: '$isbn'
                }
            },
            {
                $project: {
                    isbn: '$_id',
                }
            }
        ]);
        console.log(books);
    }
    catch (error) {
        console.log(error);
    }
};
exports.booksSummary = booksSummary;
