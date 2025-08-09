import Router from "express";
import { body } from "express-validator";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { createRideController } from "../controllers/ride.controller.js";

const router = Router();

router.post(
  "/create-ride",
  authenticateUser,
  body("pickup")
    .notEmpty()
    .isString()
    .withMessage("Pickup location is required"),
  body("destination")
    .notEmpty()
    .isString()
    .withMessage("Destination is required"),
  body("vehicleType")
    .notEmpty()
    .isString()
    .withMessage("Vehicle type is required"),
  createRideController
);

export default router;
