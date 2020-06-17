if (!process.env.JWS_KEY) {
  throw new Error('JWS_KEY is not provided!');
}
if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI is not provided!');
}

import mongoose from 'mongoose';
import { app } from './app';

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    app.listen(4000, () => {
      console.log('Listening on port 4000');
    });
  })
  .catch((error) => {
    console.error(error);
  });
