import { asyncHandler, ErrorResponse, OrderStatus } from "@giantsofttickets/common";
import { NextFunction, Request, Response } from "express";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { Order } from "../models/order";
import { Payment } from "../models/payments";
import { natsWrapper } from "../nats/nats-wrapper";
import { stripe } from "../stripe";

const createPayment = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
  // token is required
  // orderId is required
  const { token, orderId } = req.body;
  if(!token || !orderId ) {
    return next(new ErrorResponse('token and orderId field are required', 400))
  }

  const order = await Order.findById(orderId);

  if(!order) {
    return next(new ErrorResponse('Could not find the order', 404));
  }

  if(order.userId !== req.currentUser!.id) {
    return next(new ErrorResponse('Not authorized to access this resource', 401));
  }

  if(order.status === OrderStatus.Cancelled) {
    return next(new ErrorResponse('Cannot pay for a cancelled order', 400))
  }

  const charge = await stripe.charges.create({
    currency: 'usd',
    amount: order.price * 100,
    source: token
  })

  const payment = Payment.build({
    orderId,
    stripeId: charge.id
  })

  await payment.save();

  new PaymentCreatedPublisher(natsWrapper.client).publish({
    orderId: payment.orderId,
    stripeId: payment.stripeId,
    id: payment.id
  });

  res.status(201).send({
    id: payment.id
  });
});

export { createPayment }