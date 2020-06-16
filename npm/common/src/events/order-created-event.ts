import { Subjects } from './subjects';
import { OrderTypes } from './types/order-status';

export interface OrderCreatedEvent {
  subject: Subjects.OrderCreated;
  data: {
    id: string;
    ticket: {
      id: string;
      price: number;
    };
    userId: string;
    status: OrderTypes.Created;
    expiresAt: string;
    __v: number;
  };
}
