import express from "express";
import {
  checkoutHandler,
  stripeWebhookHandler,
} from "../controllers/stripe.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { body } from "express-validator";
const router = express.Router();

router.post(
  "/create-checkout-session",
  authenticateUser,
  body("item.price").isNumeric(),
  body("item.currency").notEmpty().isString(),
  body("item.name").notEmpty().isString(),
  body("item.description").notEmpty().isString(),
  body("rideId").notEmpty().isMongoId(),
  checkoutHandler
);
export default router;
