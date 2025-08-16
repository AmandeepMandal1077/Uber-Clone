import React, { useContext, useEffect, useState } from "react";
import LiveTrackingMap from "./LiveTrackingMap";
import { SocketContext } from "../context/SocketContext";
import { UserContext } from "../context/UserContext";
import useRealTimeLocation from "../hooks/useRealTimeLocation";
import { LOCATION_CONFIG } from "../config/locationConfig";
import axios from "axios";

const getCoordinates = async (address) => {
  if (!address) return null;
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/maps/get-coordinates`,
      {
        params: { address },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    return { lat: parseFloat(data.latitude), lng: parseFloat(data.longitude) };
  } catch (error) {
    console.error(`Error getting coordinates for ${address}:`, error);
    return null;
  }
};

const ConnectedLiveTrackingMap = ({ className = "h-full w-full" }) => {
  const { socket, liveLocations } = useContext(SocketContext);
  const { user } = useContext(UserContext) || {};
  const [ride, setRide] = useState(null);
  const { currentLocation, error } = useRealTimeLocation();
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [captainLocation, setCaptainLocation] = useState(null);

  const [rideState, setRideState] = useState("confirmed");

  const isCaptain = window.location.pathname.includes("captain");
  const currentUserId = user?._id;

  useEffect(() => {
    const fetchRideDetails = async () => {
      if (user?._id) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/rides/get-ride-details`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const activeRide = response.data;
          if (
            activeRide &&
            activeRide.status !== "completed" &&
            activeRide.status !== "cancelled"
          ) {
            setRide(activeRide);
            const pickup = await getCoordinates(activeRide.pickupLocation);
            const destination = await getCoordinates(
              activeRide.dropoffLocation
            );
            setPickupCoords(pickup);
            setDestinationCoords(destination);
            localStorage.setItem("pickupCoords", JSON.stringify(pickup));
            localStorage.setItem(
              "destinationCoords",
              JSON.stringify(destination)
            );
          }
        } catch (error) {
          console.error("Could not fetch ride details", error);
        }
      }
    };

    if (LOCATION_CONFIG.USE_REAL_LOCATION) {
      fetchRideDetails();
    } else {
      setPickupCoords(JSON.parse(localStorage.getItem("pickupCoords")));
      setDestinationCoords(
        JSON.parse(localStorage.getItem("destinationCoords"))
      );
    }
  }, [user]);

  useEffect(() => {
    if (currentLocation && socket && currentUserId) {
      socket.emit("update-location", {
        userId: currentUserId,
        location: currentLocation,
        userType: isCaptain ? "captain" : "user",
      });
    }
  }, [currentLocation, socket, currentUserId, isCaptain]);

  useEffect(() => {
    if (LOCATION_CONFIG.USE_REAL_LOCATION) {
      setUserLocation(liveLocations[user?._id]);
      if (ride?.captain) {
        setCaptainLocation(liveLocations[ride.captain]);
      }
    } else {
      setUserLocation(LOCATION_CONFIG.DEMO_LOCATIONS.user);
      setCaptainLocation(LOCATION_CONFIG.DEMO_LOCATIONS.captain);
    }
  }, [liveLocations, user, ride]);

  return (
    <LiveTrackingMap
      userLocation={userLocation}
      captainLocation={captainLocation}
      pickupCoords={pickupCoords}
      destinationCoords={destinationCoords}
      rideState={rideState}
      className={className}
    />
  );
};

export default ConnectedLiveTrackingMap;
