import { asyncHandler, ErrorResponse, OrderStatus } from "@giantsofttickets/common";
import { NextFunction, Request, Response } from "express";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { Order } from "../models/order";
import { Ticket } from "../models/ticket";
import { natsWrapper } from "../nats/nats-wrapper";

const EXPIRATION_WINDOW_SECONDS = 3 * 60;

const createOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { ticketId } = req.body;

  // Find the ticket the user is trying to order in the database!
  const ticket = await Ticket.findById(ticketId)
  if(!ticket) {
    return next(new ErrorResponse(`Ticket was not found with id ${ticketId}`, 404))
  }

  // Make sure that this ticket is not already reserved
  // Run query to look at all orders. Find an order where the ticket
  // is the ticket we just found *and* the orders status is *not* cancelled.
  // If we find an order from that, it means thatt the ticket *is* reserved
  const isReserved = await ticket.isReserved();
  console.log(isReserved);
  if(isReserved) {
    return next(new ErrorResponse('Ticket is already reserved', 400));
  }

  // Calculate an expiration date for this order
  const expiresAt = new Date();
  expiresAt.setSeconds(expiresAt.getSeconds() + EXPIRATION_WINDOW_SECONDS);


  // Build the order and save it to the database
  const order = Order.build({
    userId: req.currentUser!.id,
    status: OrderStatus.Created,
    expiresAt,
    ticket

  });

  await order.save();

  // Publish an event saying that an order was created
  new OrderCreatedPublisher(natsWrapper.client).publish({
    id: order.id,
    version: order.version,
    status: order.status,
    userId: order.userId,
    expiresAt: order.expiresAt.toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price
    }
  })

  res.status(201).send(order)
})
const getOrders = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const orders = await Order.find({
    userId: req.currentUser!.id
  }).populate('ticket');
  res.send(orders)
})
const getOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const order = await Order.findById(req.params.orderId).populate('ticket');
  if(!order) {
    return next(new ErrorResponse(`Order with id of ${req.params.orderId} was not found`, 404))
  }
  if(order.userId !== req.params.orderId) {
    return next(new ErrorResponse(`Not authorized to access this resource`, 401))

  }
  res.send(order)
})
const deleteOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId).populate('ticket');

  if(!order) {
    return next(new ErrorResponse(`Order with id of ${req.params.orderId} was not found`, 404))
  }
  if(order.userId !== req.currentUser!.id) {
    return next(new ErrorResponse(`Not authorized to access this resource`, 401))
  }
  order.status = OrderStatus.Cancelled;
  await order.save();

  new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    version: order.version,
    ticket: {
      id: order.ticket.id,
    }
  })

  res.send({})
})



export { createOrder, getOrders, getOrder, deleteOrder }