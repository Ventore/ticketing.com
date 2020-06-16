import Queue from 'bull';
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publishers';
import { natsService } from '../services/nats-client';

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  new ExpirationCompletePublisher(natsService.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
