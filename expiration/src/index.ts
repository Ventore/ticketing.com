if (!process.env.NATS_URL) {
  throw new Error('NATS_URL is not provided');
}
if (!process.env.NATS_CLUSTER_ID) {
  throw new Error('NATS_CLUSTER_ID is not provided');
}
if (!process.env.NATS_CLIENT_ID) {
  throw new Error('NATS_CLIENT_ID is not provided');
}
if (!process.env.REDIS_HOST) {
  throw new Error('REDIS_HOST is not provided');
}

import { natsService } from './services/nats-client';
import { OrderCreatedListener } from './events/listeners/order-created-listener';

natsService
  .connect(
    process.env.NATS_CLUSTER_ID,
    process.env.NATS_CLIENT_ID,
    process.env.NATS_URL,
  )
  .then(() => {
    natsService.client.on('close', () => {
      process.exit();
    });

    new OrderCreatedListener(natsService.client).listen();
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
