import { asyncHandler, ErrorResponse } from "@giantsofttickets/common";
import { NextFunction, Request, Response } from "express";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { Ticket } from "../models/ticket";
import { natsWrapper } from "../../nats/nats-wrapper";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";

const createTicket = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const {title, price}  = req.body;
  const ticket = Ticket.build({
    title,
    price,
    userId: req.currentUser!.id
  })
  await ticket.save();
  new TicketCreatedPublisher(natsWrapper.client).publish({
    id: ticket.id,
    version: ticket.version,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId
  })
  res.status(201).send(ticket);
})

const getAllTickets = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const tickets = await Ticket.find({});
  res.send(tickets);
})

const getTicket = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const ticket = await Ticket.findById(id);
  if(!ticket) {
    next(new ErrorResponse(`The ticket of ${id} was not found`, 404))
  }
  res.send(ticket);
});

const updateTicket = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const ticket = await Ticket.findById(req.params.id)

  if(!ticket) {
    return next(new ErrorResponse('Ticket was not found', 404))
  }

  if(ticket.orderId) {
    return next(new ErrorResponse('Cannot edit a reserved ticket', 400))
  }

  if(ticket!.userId !== req.currentUser!.id) {
    return next(new ErrorResponse('Not authorized to perform this operation', 401))
  }
  if(!req.body.title || !req.body.price) {
    return next(new ErrorResponse('Bad Request', 400))
  }

  ticket!.set({
    title: req.body.title,
    price: req.body.price
  })

  await ticket!.save();
  new TicketUpdatedPublisher(natsWrapper.client).publish({
    id: ticket.id,
    title: ticket.title,
    version: ticket.version,
    price: ticket.price,
    userId: ticket.userId
  })

  res.send(ticket);
})

export { createTicket, getTicket, getAllTickets, updateTicket }