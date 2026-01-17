import express from "express";
import {
  createPayment,
  paymentSuccess,
  paymentFailure
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create", createPayment);
router.post("/success", paymentSuccess);
router.post("/failure", paymentFailure);

export default router;
