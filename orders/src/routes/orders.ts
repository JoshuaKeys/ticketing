import { requireAuth } from "@giantsofttickets/common";
import { Router } from "express";
import { createOrder, deleteOrder, getOrder, getOrders } from "../controllers/orders";

const router = Router();

router.route('/')
  .post(requireAuth, createOrder)
  .get(requireAuth, getOrders);
router.route('/:orderId')
  .delete(requireAuth, deleteOrder)
  .get(requireAuth, getOrder)

export { router }

