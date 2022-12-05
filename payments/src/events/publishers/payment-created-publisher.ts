import { PaymentCreatedEvent, Publisher, Subjects } from "@giantsofttickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}