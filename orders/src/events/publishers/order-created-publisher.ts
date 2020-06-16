import { Publisher, OrderCreatedEvent, Subjects } from '@ventore/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
