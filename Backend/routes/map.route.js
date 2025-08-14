import { Router } from "express";
import {
  getCoordinates,
  getDistanceAndTime,
  getNearByCaptains,
  getSuggestions,
  getRouteController, // Make sure this is imported
} from "../controllers/map.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js"; // Import the new middleware
import { query } from "express-validator";

const router = Router();

router.get(
  "/get-coordinates",
  authenticate, // Use the general authenticate middleware
  query("address").isString().notEmpty().withMessage("Address is required"),
  getCoordinates
);

router.get(
  "/get-distance-time",
  authenticate, // Use the general authenticate middleware
  query("origin").isString().notEmpty().withMessage("Origin is required"),
  query("destination")
    .isString()
    .notEmpty()
    .withMessage("Destination is required"),
  getDistanceAndTime
);

router.get(
  "/get-suggestions",
  authenticate, // Use the general authenticate middleware
  query("location").isString().notEmpty().withMessage("Location is required"),
  getSuggestions
);

router.get(
  "/get-nearby-captains",
  authenticate, // Use the general authenticate middleware
  query("latitude").isNumeric().withMessage("Latitude is required"),
  query("longitude").isNumeric().withMessage("Longitude is required"),
  query("radius").isNumeric().withMessage("Radius is required"),
  getNearByCaptains
);

// Add the route for fetching simulation path
router.post("/get-route", authenticate, getRouteController);

export default router;
