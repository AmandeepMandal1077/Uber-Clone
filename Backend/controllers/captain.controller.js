import CAPTAIN from "../models/captain.model.js";
import BlackListToken from "../models/blacklistToken.model.js";
import { validationResult } from "express-validator";
import { createCaptain } from "../services/captain.service.js";

const registerCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    fullname: { firstname, lastname },
    email,
    password,
    vehicle: { type, color, capacity, number },
  } = req.body;

  const isAlreadyRegistered = await CAPTAIN.findOne({ email });
  if (isAlreadyRegistered) {
    return res.status(400).json({ message: "Captain already registered" });
  }

  const hashedPassword = await CAPTAIN.hashPassword(password);

  const captain = await createCaptain({
    firstname,
    lastname,
    email,
    password: hashedPassword,
    vehicleType: type,
    vehicleColor: color,
    vehicleCapacity: capacity,
    vehicleNumber: number,
  });

  const token = captain.generateAuthToken();
  res.status(201).json({ token, captain });
};

const loginCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const captain = await CAPTAIN.findOne({ email }).select("+password");
  if (!captain) {
    return res.status(404).json({ message: "Captain not found" });
  }

  const isMatch = await captain.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = captain.generateAuthToken();
  res.cookie("token", token);

  res.status(200).json({ token, captain });
};

const logoutCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  res.clearCookie("token");
  await BlackListToken.create({ token });
  res.status(200).json({ message: "Logged out successfully" });
};

const getCaptainProfile = async (req, res, next) => {
  res.status(200).json({ captain: req.captain });
};

export { registerCaptain, loginCaptain, logoutCaptain, getCaptainProfile };
