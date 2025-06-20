import { Request, Response } from 'express';
import Book from '../models/Book.model';
import mongoose from 'mongoose';
import Borrow from '../models/Borrow.model';


// Create a new book
export const createBook = async (req: Request, res: Response) => {
  try {
    const {
      title,
      author,
      genre,
      isbn,
      description,
      copies,
      available = true
    } = req.body;

    if (!title || !author || !genre || !isbn || copies === undefined || copies < 0) {
      return res.status(400).json({
        message: 'title, author, genre, isbn, and copies are required.'
      });
    }

    const existing = await Book.findOne({ isbn });
    if (existing) {
      return res.status(404).json({ 
        message: 'Book with this ISBN already exists' }
      );
    }

    const newBook = new Book({
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
  } catch (error : any) {
    console.error('Error creating book:', error);
    return res.status(500).json({ 
      message: 'Internal Server Error',
      error: error.message
    });
  }
};

// Read books
export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const { filter, 
      sortBy = 'createdAt', 
      sort = 'desc', 
      limit = '10' 
    } = req.query;

    const query: any = {};
    if (filter) {
      query.genre = filter;
    }

    const sortOption: any = {};
    sortOption[sortBy as string] = sort === 'asc' ? 1 : -1;

    // Fetch books with filters and sort
    const books = await Book.find(query)
      .sort(sortOption)
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      message: 'Books retrieved successfully',
      data: books
    });
  } catch (error: any) {
     
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
};

// Read a book by ID
export const getBookById = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid book ID format'
      });
    }

    const book = await Book.findById(bookId);

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
  } catch (error: any) {
    console.error('Error fetching book by ID:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
};

// Update a book by ID
export const updateBook = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;
    const updateData = req.body;


    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid book ID format'
      });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      updateData,
      { new: true }
    );

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
  } catch (error: any) {
    console.error('Error updating book:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
};

// Delete a book by ID
export const deleteBook = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid book ID format',
      });
    }

    const deletedBook = await Book.findByIdAndDelete(bookId);

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
  } catch (error: any) {
    console.error('Error deleting book:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// borrow a book
export const borrowBook = async (req: Request, res: Response) => {
  try {
    const { book: bookId, quantity, dueDate } = req.body;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
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

    const book = await Book.findById(bookId);
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

    const borrowRecord = new Borrow({
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
  } catch (error: any) {
    console.error('Error borrowing book:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
};

// get books summary
export const booksSummary =async (req : Request, res: Response) => {
  try {
    const books = await Book.aggregate([
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
    console.log(books)
  } catch (error) {
    console.log(error)
  }
}



