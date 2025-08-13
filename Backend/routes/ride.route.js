import Router from "express";
import { body, query } from "express-validator";
import {
  authenticateCaptain,
  authenticateUser,
} from "../middlewares/auth.middleware.js";
import {
  confirmRide,
  createRideController,
  genOTP,
  getFare,
} from "../controllers/ride.controller.js";

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

router.get(
  "/get-fare",
  authenticateUser,
  query("pickup")
    .notEmpty()
    .isString()
    .withMessage("Pickup location is required"),
  query("destination")
    .notEmpty()
    .isString()
    .withMessage("Destination is required"),
  getFare
);

router.get("/gen-otp", authenticateUser, genOTP);

router.post(
  "/confirm-ride",
  authenticateCaptain,
  body("rideId")
    .notEmpty()
    .isString()
    .isMongoId()
    .withMessage("Ride ID is required"),
  confirmRide
);

export default router;
