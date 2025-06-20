import { Document, Types } from "mongoose";

export interface IBook extends Document {
  title: string;
  author: string;
  genre: string;
  isbn: string;
  description?: string;
  copies: number;
  available: boolean;
}

export interface IBorrowBook extends Document {
  book: Types.ObjectId;
  quantity: number;
  dueDate: Date;
}