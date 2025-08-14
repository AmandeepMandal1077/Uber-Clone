import {
  getAddressCoordinates,
  getCaptainsWithin,
} from "../services/map.service.js";
import {
  createRide,
  calculateFare,
  generateOTP,
  confirmRideByCaptain,
} from "../services/ride.service.js";
import { validationResult } from "express-validator";
import { sendMessage } from "../socket.js";
import RIDE from "../models/ride.model.js";
import USER from "../models/user.model.js";

const createRideController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { pickup, destination, vehicleType } = req.body;
    const ride = await createRide({
      userId: req.user._id,
      pickup,
      destination,
      vehicleType,
    });

    const pickupLocation = await getAddressCoordinates({ address: pickup });
    const captains = await getCaptainsWithin({
      latitude: pickupLocation.latitude,
      longitude: pickupLocation.longitude,
      radius: 20000000,
    });

    const rideWithUser = await RIDE.findById(ride._id)
      .populate("user")
      .select("+otp");

    captains.forEach((captain) => {
      if (captain.socketId) {
        sendMessage(captain.socketId, {
          event: "new-ride",
          data: rideWithUser,
        });
      }
    });

    res.status(201).json(ride);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFare = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { pickup, destination } = req.query;
    const fare = await calculateFare({ pickup, destination });
    res.status(200).json(fare);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const genOTP = async (req, res) => {
  try {
    const userRide = await RIDE.findOne({
      user: req.user._id,
      status: { $in: ["pending", "confirmed"] },
    })
      .select("+otp")
      .sort({ createdAt: -1 });

    if (!userRide) {
      return res.status(404).json({ message: "No active ride found" });
    }
    res.status(200).json({ otp: userRide.otp });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const confirmRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { rideId, captainId } = req.body;
    const ride = await confirmRideByCaptain({ rideId, captainId });
    const rideWithUser = await RIDE.findById(ride._id).populate("user");

    if (rideWithUser.user && rideWithUser.user.socketId) {
      sendMessage(rideWithUser.user.socketId, {
        event: "ride-confirmed",
        data: ride,
      });
    }

    res.status(200).json({ message: "Ride confirmed successfully", ride });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRideOTP = async (req, res) => {
  try {
    const { rideId } = req.params;
    const ride = await RIDE.findOne({
      _id: rideId,
      user: req.user._id,
    }).select("+otp");

    if (!ride) {
      return res
        .status(404)
        .json({ message: "Active ride not found for this user." });
    }

    res.status(200).json({ otp: ride.otp });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export { createRideController, getFare, genOTP, confirmRide, getRideOTP };
