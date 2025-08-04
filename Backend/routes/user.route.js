import express from "express";
import { Router } from "express";
import { body } from "express-validator";
import { authenticateUser } from "../middlewares/auth.middleware.js";

import {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post(
  "/register-user",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("fullname.firstname")
      .isLength({ min: 2 })
      .withMessage("First Name must be atleast 2 characters long"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be atleast 6 characters long"),
  ],
  registerUser
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be atleast 6 characters long"),
  ],
  loginUser
);

router.post("/logout", authenticateUser, logoutUser);

router.get("/profile", authenticateUser, getUserProfile);

export default router;
