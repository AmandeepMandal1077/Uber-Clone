import { Router } from "express";
import {
  getCoordinates,
  getDistanceAndTime,
  getNearByCaptains,
  getSuggestions,
} from "../controllers/map.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { query } from "express-validator";

const router = Router();

router.get(
  "/get-coordinates",
  authenticateUser,
  query("address").isString().notEmpty().withMessage("Address is required"),
  getCoordinates
);

router.get(
  "/get-distance-time",
  authenticateUser,
  query("origin").isString().notEmpty().withMessage("Origin is required"),
  query("destination")
    .isString()
    .notEmpty()
    .withMessage("Destination is required"),
  getDistanceAndTime
);

router.get(
  "/get-suggestions",
  authenticateUser,
  query("location").isString().notEmpty().withMessage("Location is required"),
  getSuggestions
);

router.get(
  "/get-nearby-captains",
  authenticateUser,
  query("latitude").isNumeric().withMessage("Latitude is required"),
  query("longitude").isNumeric().withMessage("Longitude is required"),
  query("radius").isNumeric().withMessage("Radius is required"),
  getNearByCaptains
);

export default router;
