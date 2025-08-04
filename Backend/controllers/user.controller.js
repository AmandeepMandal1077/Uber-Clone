import USER from "../models/user.model.js";
import { validationResult } from "express-validator";
import { createUser } from "../services/user.service.js";
import BlackListToken from "../models/blacklistToken.model.js";

const registerUser = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  }

  const {
    fullname: { firstname, lastname },
    email,
    password,
  } = req.body;

  const isAlreadyRegistered = await USER.findOne({ email });
  if (isAlreadyRegistered) {
    return res.status(400).json({ message: "User already registered" });
  }

  const hashedPassword = await USER.hashPassword(password);

  const user = await createUser({
    firstname,
    lastname,
    email,
    password: hashedPassword,
  });

  const token = user.generateAuthToken();

  res.status(201).json({ token, user });
};

const loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const user = await USER.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const checkPassword = await user.comparePassword(password);
  if (!checkPassword) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = user.generateAuthToken();
  res.cookie("token", token);
  res.status(200).json({ token, user });
};

const logoutUser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  res.clearCookie("token");

  await BlackListToken.create({ token });
  res.status(200).json({ message: "Logged out successfully" });
};

const getUserProfile = async (req, res, next) => {
  res.status(200).json(req.user);
};

export { registerUser, loginUser, getUserProfile, logoutUser };
