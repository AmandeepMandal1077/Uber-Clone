import axios from "axios";
import {
  getAddressCoordinates,
  getCaptainsWithin,
  getDistanceAndDuration,
  getLocationSuggestions,
} from "../services/map.service.js";
import { validationResult } from "express-validator";

const getCoordinates = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { address } = req.query;
    const coordinates = await getAddressCoordinates({ address });
    const { latitude, longitude } = coordinates;
    res.status(200).json({ latitude, longitude });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

const getDistanceAndTime = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { origin, destination } = req.query;
    const {
      distanceInMeters,
      distanceInKm,
      durationInSeconds,
      durationInString,
    } = await getDistanceAndDuration({
      origin,
      destination,
    });
    res.status(200).json({
      distanceInMeters,
      distanceInKm,
      durationInSeconds,
      durationInString,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

const getSuggestions = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { location } = req.query;
    const suggestions = await getLocationSuggestions({ location });
    res.status(200).json(suggestions);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

const getNearByCaptains = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { latitude, longitude, radius } = req.query;
    const captains = await getCaptainsWithin({
      latitude,
      longitude,
      radius,
    });
    res.status(200).json({ captains });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export {
  getCoordinates,
  getDistanceAndTime,
  getSuggestions,
  getNearByCaptains,
};
