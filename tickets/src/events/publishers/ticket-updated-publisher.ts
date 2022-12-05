import { Publisher, Subjects, TicketUpdatedEvent } from '@giantsofttickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}