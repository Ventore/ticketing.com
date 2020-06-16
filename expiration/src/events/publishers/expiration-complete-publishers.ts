import { Publisher, ExpirationCompleteEvent, Subjects } from '@ventore/common';

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  subject: ExpirationCompleteEvent['subject'] = Subjects.ExpirationComplete;
}
