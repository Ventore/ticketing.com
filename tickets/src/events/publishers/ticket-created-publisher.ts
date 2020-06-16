import { Publisher, TicketCreatedEvent, Subjects } from '@ventore/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
