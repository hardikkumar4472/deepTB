import express from "express";
import {
  createOrder,
  captureOrder,
  createAndCaptureOrder
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/capture-order/:orderId", captureOrder);
router.post("/create-and-capture-order", createAndCaptureOrder); 

export default router;
