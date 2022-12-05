import { ExpirationCompleteEvent, Publisher, Subjects } from "@giantsofttickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject =  Subjects.ExpirationComplete;
}