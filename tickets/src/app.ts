import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, currentUser } from '@ventore/common';

import { createRouter } from './routes/create';
import { readRouter } from './routes/read';
import { updateRouter } from './routes/update';

const app = express();

app.set('trust proxy', true);

app.use(json());
app.use(
  cookieSession({ signed: false, secure: false }),
);
app.use(currentUser());

app.use('/api/v1', [createRouter, readRouter, updateRouter]);

app.use(errorHandler());

export { app };
