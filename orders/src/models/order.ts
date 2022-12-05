import { sign } from "jsonwebtoken";
import { Document, Model, model, Schema } from "mongoose";
import { OrderStatus } from '@giantsofttickets/common';
import { TicketDoc } from "./ticket";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// An interface that describes the properties
// that are required to create a new user
interface OrderAttrs {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDoc
}

// An interface that describes the properties
// that a User Model has
interface OrderModel extends Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc
}

// An interface that describes the properties
// that a User Document has
interface OrderDoc extends Document {
    userId: string;
    status: OrderStatus;
    version: number;
    expiresAt: Date;
    ticket: TicketDoc
}

const orderSchema = new Schema({
    userId: {
        type: String,
        required: [true, 'Please add a userId field'],
    },
    status: {
        type: String,
        required: [true, 'Please add a status'],
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    },
    expiresAt: {
        type: Date,
        default: Date.now
    },
    ticket: {
        type: Schema.Types.ObjectId,
        ref: 'Ticket'
    }
}, {
    toJSON: {
        transform: function(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin)
// Encrypt password using bcrypt
orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order(attrs);
}

const Order = model<OrderDoc, OrderModel>('Order', orderSchema)




export { Order };