import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, currentUser } from '@ventore/common';

import { createRouter } from './routes/create';

const app = express();

app.set('trust proxy', true);

app.use(json());
app.use(
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== 'test' }),
);
app.use(currentUser());

app.use('/api/v1/', [createRouter]);

app.use(errorHandler());

export { app };
