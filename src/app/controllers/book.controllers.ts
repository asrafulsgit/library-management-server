import { NextFunction, Request, Response } from 'express';
import Book from '../models/Book.model';
import Borrow from '../models/Borrow.model';
import { bookIdValidation, borrowBookSchema, createBookSchema, 
  generaleError, generateValidationError, generateZodError, updateBookSchema  } from '../middlewares/errorHandler';
import { ZodError } from 'zod';


// Create a new book
export const createBook = async (req: Request, res: Response)  => {
  try {
    const parsed = createBookSchema.parse(req.body);

    const existing = await Book.findOne({ isbn: parsed.isbn });
    if (existing) {
      return res.status(400).json(
          generateValidationError( {
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
                      }
                )
        );
    }

    const newBook = new Book(parsed);
    const savedBook = await newBook.save();

    return res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: savedBook
    });
  } catch (err: any) {
    console.log(err)
      if (err instanceof ZodError) {
       return  res.status(400).json(
          generateZodError(err, req.body)
          
        )
      }

    return res.status(500).json(
      generaleError(err)
    );
  }
};

// Read books
export const getAllBooks = async (req: Request, res: Response)  => {
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

    
    const books = await Book.find(query)
      .sort(sortOption)
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      message: 'Books retrieved successfully',
      data: books
    });
  } catch (err: any) {
     return res.status(500).json(
      generaleError(err)
     );
  }
};

//featured books
export const featuredBooks = async (req: Request, res: Response)  => {
  try {
    const books = await Book.find({available : true})
      .sort({createdAt : -1})
      .limit(6);

    return res.status(200).json({
      success: true,
      message: 'Books retrieved successfully',
      data: books
    });
  } catch (err: any) {
     return res.status(500).json(
      generaleError(err)
     );
  }
};

// Read a book by ID
export const getBookById = async (req: Request, res: Response)  => {
  try {

    const parsed = bookIdValidation.parse(req.params);
  
    const book = await Book.findById(parsed.bookId);

    if (!book) {
      return res.status(404).json(
        generateValidationError({
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
          })
      );
    }

    return res.status(200).json({
      success: true,
      message: 'Book retrieved successfully',
      data: book
    });
  } catch (err: any) {
    console.error('Error fetching book by ID:', err);
    if (err instanceof ZodError) {
       return  res.status(400).json(
          generateZodError(err, req.params)
        )
    }

    return res.status(500).json(
      generaleError(err)
      );
  }
};

// Update a book by ID
export const updateBook = async (req: Request, res: Response)  => {
  try {

    const updateData = updateBookSchema.parse(req.body);
    const parsed = bookIdValidation.parse(req.params);
    

    const book = await Book.findById(parsed.bookId);

    if (!book) {
      return res.status(404).json(
        generateValidationError({
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
          })
         
      );
    }
    
    book.title = updateData.title ?? book.title;
    book.author = updateData.author ?? book.author;
    book.genre = updateData.genre ?? book.genre;
    book.isbn = updateData.isbn ?? book.isbn;
    book.description = updateData.description ?? book.description;
    book.copies = updateData.copies ?? book.copies;

    const updatedBook = await book.save();

    return res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: updatedBook
    });

  } catch (err: any) {
    console.error('Error updating book:', err);
    if (err instanceof ZodError) {
       return  res.status(400).json(
          generateZodError(err, req.params)
        )
      }
    return res.status(500).json(
      generaleError(err)
    );
  }
};

// Delete a book by ID
export const deleteBook = async (req: Request, res: Response) => {
  try {
    
    const parsed = bookIdValidation.parse(req.params);
 

    const deletedBook = await Book.findByIdAndDelete(parsed.bookId);

    if (!deletedBook) {
      return res.status(404).json(
        generateValidationError({
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
          })
      );
    }

    return res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
      data: null,
    });
  } catch (err: any) {
    console.error('Error deleting book:', err);
    if (err instanceof ZodError) {
       return  res.status(400).json(
          generateZodError(err, req.params)
        )
      }
    return res.status(500).json(
      generaleError(err)
    );

  }
};

// borrow a book
export const borrowBook = async (req: Request, res: Response) => {
  try {
    const borrowBook= borrowBookSchema.parse(req.body)
    const {book : bookId, quantity, dueDate } = borrowBook;
    

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json(
        generateValidationError({
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
          })
      );
    }

    if (book.copies < quantity) {
      return res.status(400).json(
        generateValidationError({
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
          })
      );
    }

    book.updateCopiesAfterBorrow(quantity);
    await book.save();

    const borrowRecord = new Borrow({
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
  } catch (err: any) {
    console.error('Error borrowing book:', err);
    if (err instanceof ZodError) {
       return  res.status(400).json(
          generateZodError(err, req.body)
        )
      }

    return res.status(500).json(
      generaleError(err)
    );
  }
};


// get books summary
export const booksSummary = async (req: Request, res: Response) : Promise<Response> => {
  try {
    const summary = await Borrow.aggregate([
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
  } catch (error: any) {
    console.error('Error generating summary:', error);
    return res.status(500).json(
      generaleError(error)
    );
  }
};




