import { model, Schema} from 'mongoose';
import { IBook } from '../interfaces/book.interface';




const bookSchema: Schema = new Schema<IBook>(
  {
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
  },
  {
    timestamps: true
  }
);
bookSchema.pre('save', function (next) {
  if (this.isModified('copies') && this.copies === 0) {
    this.available = false;
  }
  next();
});

bookSchema.methods.updateCopiesAfterBorrow = async function (quantity: number) {
    this.copies -= quantity;
    if (this.copies <= 0) {
        this.available = false;
        this.copies = 0; 
    }
}  

const Book = model<IBook>('Book', bookSchema);
export default Book;
