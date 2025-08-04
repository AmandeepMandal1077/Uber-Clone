import BlackListToken from "../models/blacklistToken.model.js";
import USER from "../models/user.model.js";
import CAPTAIN from "../models/captain.model.js";
import jwt from "jsonwebtoken";

const authenticateUser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied, no token provided" });
  }

  const blacklistedToken = await BlackListToken.findOne({ token });
  if (blacklistedToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await USER.findById(decoded._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid token" });
  }
};

const authenticateCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied, no token provided" });
  }

  const blacklistedToken = await BlackListToken.findOne({ token });
  if (blacklistedToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const captain = await CAPTAIN.findById(decoded._id);

    if (!captain) {
      return res.status(404).json({ message: "Captain not found" });
    }

    req.captain = captain;
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid token" });
  }
};
export { authenticateUser, authenticateCaptain };
