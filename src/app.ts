import express, { Application, Request, Response } from 'express';
import cors from 'cors';   
import bookRouter from './routes/book.routes';

const app : Application = express();

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use('/api',bookRouter)

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
}); 


export default app;