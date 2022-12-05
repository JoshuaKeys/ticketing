import { Publisher, Subjects, TicketCreatedEvent } from '@giantsofttickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}