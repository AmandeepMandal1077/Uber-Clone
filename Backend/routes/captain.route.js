import express from "express";
import { Router } from "express";
import { body } from "express-validator";
import {
  registerCaptain,
  loginCaptain,
  logoutCaptain,
  getCaptainProfile,
} from "../controllers/captain.controller.js";

import { authenticateCaptain } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("First name must be at least 3 characters long"),

    body("email").isEmail().withMessage("Invalid email"),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),

    body("vehicle.type").notEmpty().withMessage("Vehicle type is required"),

    body("vehicle.color")
      .isLength({ min: 3 })
      .withMessage("Vehicle color must be at least 3 characters long"),

    body("vehicle.capacity")
      .isInt({ min: 1 })
      .withMessage("Invalid vehicle capacity"),

    body("vehicle.number").notEmpty().withMessage("Vehicle number is required"),
  ],

  registerCaptain
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  loginCaptain
);

router.post("/logout", authenticateCaptain, logoutCaptain);
router.get("/profile", authenticateCaptain, getCaptainProfile);

export default router;
