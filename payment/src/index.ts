if (!process.env.JWS_KEY) {
  throw new Error('JWS_KEY is not provided');
}
if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI is not provided');
}
if (!process.env.NATS_URL) {
  throw new Error('NATS_URL is not provided');
}
if (!process.env.NATS_CLUSTER_ID) {
  throw new Error('NATS_CLUSTER_ID is not provided');
}
if (!process.env.NATS_CLIENT_ID) {
  throw new Error('NATS_CLIENT_ID is not provided');
}

import mongoose from 'mongoose';
import { natsService } from './services/nats-client';
import { app } from './app';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';

natsService
  .connect(
    process.env.NATS_CLUSTER_ID,
    process.env.NATS_CLIENT_ID,
    process.env.NATS_URL,
  )
  .then(() => {
    mongoose.connect(process.env.MONGO_URI!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    new OrderCreatedListener(natsService.client).listen();
    new OrderCancelledListener(natsService.client).listen();
    natsService.client.on('close', () => {
      process.exit();
    });
  })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(4000, () => {
      console.log('Listening on port 4000');
    });
  })
  .catch((error) => {
    console.error(error);
  });

process.on('SIGINT', () => {
  natsService.close().then(() => {
    process.exit();
  });
});
process.on('SIGTERM', () => {
  natsService.close().then(() => {
    process.exit();
  });
});
