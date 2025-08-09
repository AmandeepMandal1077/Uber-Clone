import { createRide } from "../services/ride.service.js";

const createRideController = async (req, res) => {
  try {
    const { pickup, destination, vehicleType } = req.body;
    const ride = await createRide({
      userId: req.user._id,
      pickup,
      destination,
      vehicleType,
    });
    res.status(201).json(ride);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export { createRideController };
