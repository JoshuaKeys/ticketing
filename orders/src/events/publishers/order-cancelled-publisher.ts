import { OrderCancelledEvent, Publisher, Subjects,  } from "@giantsofttickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
}