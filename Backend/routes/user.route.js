import express from "express";
import { Router } from "express";
import { body } from "express-validator";

import { registerUser } from "../controllers/user.controller.js";

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

export default router;
