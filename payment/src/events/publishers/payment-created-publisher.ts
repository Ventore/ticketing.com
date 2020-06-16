import { Subjects, Publisher, PaymentCreatedEvent } from '@ventore/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: PaymentCreatedEvent['subject'] = Subjects.PaymentCreated;
}
