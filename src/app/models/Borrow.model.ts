import { model, Schema } from "mongoose";
import { IBorrowBook } from "../interfaces/book.interface";

const borrowSchema: Schema = new Schema<IBorrowBook>(
  {
    book: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
    versionKey : false
  }
);

const Borrow = model<IBorrowBook>('Borrow', borrowSchema);
export default Borrow;