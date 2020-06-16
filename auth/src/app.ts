import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { UserRouter } from './routes';
import { errorHandler } from '@ventore/common';

const app = express();

app.set('trust proxy', true);

app.use(json());
app.use(
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== 'test' }),
);

app.use('/api/v1/users/', UserRouter);

app.use(errorHandler());

export { app };
