import { Publisher, TicketUpdatedEvent, Subjects } from '@ventore/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
