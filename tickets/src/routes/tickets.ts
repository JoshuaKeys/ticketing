import { requireAuth } from "@giantsofttickets/common";
import { Router } from "express";
import { createTicket, getAllTickets, getTicket, updateTicket } from "../controllers/tickets";

const router = Router();

router.route('/')
  .post(requireAuth, createTicket)
  .get(getAllTickets);
router.route('/:id')
  .get(getTicket)
  .put(requireAuth, updateTicket)

export { router }

