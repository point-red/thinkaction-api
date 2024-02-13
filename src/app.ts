import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { json, urlencoded } from 'body-parser';
import cookieParser from 'cookie-parser';
import { errorMiddleware } from './middleware/error.middleware';

dotenv.config();

import { router } from './routes';

const app: Application = express();

app.use(cors());
app.use(cookieParser());
app.use(json());
app.use(urlencoded({ extended: true }));

app.use('/v1', router);
app.use(errorMiddleware);

app.use('/', (req: Request, res: Response, next: NextFunction): void => {
  res.json({ message: 'Hallo! Catch-all route.' });
});

export default app;
