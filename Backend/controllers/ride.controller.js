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

    //need check if working properly
    const captains = await getCaptainsWithin({
      latitude: pickupLocation.latitude,
      longitude: pickupLocation.longitude,
      radius: 20000000,
    });

    console.log("\n\nTotal Captains: ", captains.length);
    const rideWithUser = await RIDE.findById(ride._id)
      .populate("user")
      .select("+otp");
    captains.map((captain) => {
      sendMessage(captain.socketId, { event: "new-ride", data: rideWithUser });
    });

    // Clear OTP from response to user (for security)
    ride.otp = undefined;

    // console.log("captains: ", captains);

    // Send response only after all operations are complete
    res.status(201).json(ride);
  } catch (error) {
    console.error("Error in createRideController:", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
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
    console.error("Error fetching fare:", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

const genOTP = async (req, res) => {
  try {
    // Find the user's current ride (most recent ride that's not completed)
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
    res.status(500).json({ message: error.message || "Internal Server Error" });
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

    // Populate user data to get socketId
    const rideWithUser = await RIDE.findById(ride._id).populate("user");

    sendMessage(rideWithUser.user.socketId, {
      event: "ride-confirmed",
      data: ride,
    });

    res.status(200).json({ message: "Ride confirmed successfully", ride });
  } catch (error) {
    console.error("Error confirming ride:", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export { createRideController, getFare, genOTP, confirmRide };
