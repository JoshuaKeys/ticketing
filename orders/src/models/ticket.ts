import { OrderStatus } from "@giantsofttickets/common";
import { Document, model, Model, Schema } from "mongoose";
import { Order } from "./order";
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface TicketAttrs {
  id: string,
  title: string,
  price: number,
}
export interface TicketDoc extends Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: {id: string, version: number}): Promise<TicketDoc | null>;
}

const schema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
})

schema.set('versionKey', 'version');
schema.plugin(updateIfCurrentPlugin)
schema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  });
}
schema.methods.isReserved = async function() {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete
      ]
    }
  });
  return !!existingOrder;
}
schema.statics.findByEvent = (event: {id: string; version: number}) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1
  })
}

const Ticket = model<TicketDoc, TicketModel>('Ticket', schema);

export { Ticket }