import { requireAuth } from "@giantsofttickets/common";
import { Router } from "express";
import { createPayment } from "../controllers/payments";

const router = Router();

router.route('/')
  .post(requireAuth, createPayment)

export { router } 