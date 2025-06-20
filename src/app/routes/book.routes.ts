import { Router } from "express";
import { booksSummary, borrowBook, createBook, deleteBook, getAllBooks, getBookById, updateBook } from "../controllers/book.controllers";

const bookRouter = Router();

bookRouter.post('/books', createBook );
bookRouter.get('/books', getAllBooks); 
bookRouter.get('/books/:bookId', getBookById);
bookRouter.put('/books/:bookId', updateBook);
bookRouter.delete('/books/:bookId', deleteBook);
bookRouter.post('/borrow', borrowBook);
bookRouter.get('/borrow', booksSummary);

export default bookRouter;