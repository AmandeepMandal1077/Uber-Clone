import Router from "express";
import { body, query, param } from "express-validator";
import {
  authenticateCaptain,
  authenticateUser,
} from "../middlewares/auth.middleware.js";
import {
  confirmRide,
  createRide,
  getRideOTP,
  getFare,
  getRideDetails,
  updateRideDetails,
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
  createRide
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

// New route to get OTP for a specific ride
router.get(
  "/get-otp/:rideId",
  authenticateUser,
  param("rideId").isMongoId().withMessage("Valid Ride ID is required"),
  getRideOTP
);

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

//get details
router.get("/get-ride-details/", authenticateUser, getRideDetails);

router.patch(
  "/update-ride-details/",
  authenticateUser,
  body("rideData").notEmpty().isObject().withMessage("Ride data is required"),
  updateRideDetails
);

export default router;
