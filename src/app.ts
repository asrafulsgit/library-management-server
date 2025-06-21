import express, { Application, Request, Response } from 'express';
import cors from 'cors';   
import bookRouter from './app/routes/book.routes';

const app : Application = express();

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use('/api',bookRouter)


export default app;