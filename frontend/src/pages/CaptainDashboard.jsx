import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CaptainContext } from "../context/CaptainContext";
import { SocketContext } from "../context/SocketContext";
import LiveTrackingMap from "../components/LiveTrackingMap";
import LocationDebugPanel from "../components/LocationDebugPanel";
import RideRequestsList from "../components/captain/RideRequestsList";
import CurrentRidePanel from "../components/captain/CurrentRidePanel";
import useRealTimeLocation from "../hooks/useRealTimeLocation";
import {
  startSimulation,
  stopSimulation,
  continueSimulation,
} from "../utils/rideSimulator";
import axios from "axios";
import { LOCATION_CONFIG } from "../config/locationConfig";

const getCoordinatesFromAddress = async (address) => {
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
    console.error("Error getting coordinates:", error);
    return null;
  }
};

function CaptainDashboard() {
  const { captain, currentRide, setCurrentRide } = useContext(CaptainContext);
  const { sendMessage, receiveMessage } = useContext(SocketContext);
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(false);

  const useRealLocation = isOnline && LOCATION_CONFIG.USE_REAL_LOCATION;
  const { currentLocation: realCaptainLocation } = useRealTimeLocation(
    captain?._id,
    "captain",
    useRealLocation
  );

  const [simulatedCaptainLocation, setSimulatedCaptainLocation] =
    useState(null);
  const [rideRequests, setRideRequests] = useState([]);
  const [rideStarted, setRideStarted] = useState(false);

  const [userLocation, setUserLocation] = useState(null);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);

  const captainLocation = LOCATION_CONFIG.USE_REAL_LOCATION
    ? realCaptainLocation
    : simulatedCaptainLocation || LOCATION_CONFIG.DEMO_LOCATIONS.captain;

  const resetToHome = () => {
    stopSimulation();
    setCurrentRide(null);
    setRideStarted(false);
    setRideRequests([]);
    setUserLocation(null);
    setPickupCoords(null);
    setDestinationCoords(null);
    setSimulatedCaptainLocation(null);
    navigate("/captain-dashboard");
  };

  useEffect(() => {
    if (captain?._id && isOnline) {
      sendMessage("join", { userId: captain._id, userType: "captain" });
    }
  }, [captain?._id, isOnline, sendMessage]);

  useEffect(() => {
    if (isOnline) {
      const cleanup = receiveMessage("new-ride", (rideData) => {
        setRideRequests((prev) =>
          prev.find((r) => r._id === rideData._id) ? prev : [...prev, rideData]
        );
      });
      return () => cleanup();
    }
  }, [isOnline, receiveMessage]);

  const toggleOnlineStatus = () => {
    setIsOnline((prev) => {
      if (prev) resetToHome();
      return !prev;
    });
  };

  const handleAcceptRide = async (request) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/confirm-ride`,
        { rideId: request._id, captainId: captain._id },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setCurrentRide(data.ride);
      setRideRequests([]);

      const pickup = await getCoordinatesFromAddress(request.pickupLocation);
      const destination = await getCoordinatesFromAddress(
        request.dropoffLocation
      );
      setPickupCoords(pickup);
      setDestinationCoords(destination);

      if (!LOCATION_CONFIG.USE_REAL_LOCATION && pickup) {
        startSimulation(
          captainLocation,
          pickup,
          (newLoc) => {
            setSimulatedCaptainLocation(newLoc);
            sendMessage("update-location", {
              userId: captain._id,
              location: newLoc,
              userType: "captain",
            });
          },
          () => {
            alert("Simulation: Arrived at pickup location. Please verify OTP.");
          }
        );
      }
    } catch (error) {
      console.error("Failed to accept ride:", error);
    }
  };

  const handleVerifyOtp = (enteredOtp) => {
    if (enteredOtp === currentRide.otp && pickupCoords && destinationCoords) {
      setRideStarted(true);
      sendMessage("ride-status-update", {
        rideId: currentRide._id,
        status: "ongoing",
      });

      if (!LOCATION_CONFIG.USE_REAL_LOCATION) {
        continueSimulation(
          pickupCoords,
          destinationCoords,
          (newLoc) => {
            setSimulatedCaptainLocation(newLoc);
            sendMessage("update-location", {
              userId: captain._id,
              location: newLoc,
              userType: "captain",
            });
          },
          handleCompleteRide
        );
      }
    } else {
      alert(
        enteredOtp !== currentRide.otp
          ? "Invalid OTP"
          : "Error: Missing location data."
      );
    }
  };

  const handleCompleteRide = () => {
    sendMessage("ride-completed", {
      rideId: currentRide._id,
      userId: currentRide.user._id,
      fare: currentRide.fare,
    });
    alert(`Ride completed! You earned ₹${currentRide.fare}.`);
    resetToHome();
  };

  const startRideSimulationFromDebug = async ({ captainStart, from, to }) => {
    const fromCoords = await getCoordinatesFromAddress(from);
    const toCoords = await getCoordinatesFromAddress(to);

    if (!fromCoords || !toCoords) {
      alert("Could not find coordinates for simulation addresses.");
      return;
    }

    const mockRide = {
      _id: "simulated_ride_" + Date.now(),
      pickupLocation: from,
      dropoffLocation: to,
      otp: "123456",
      fare: 150,
      user: { _id: "simulated_user" },
    };
    setCurrentRide(mockRide);
    setPickupCoords(fromCoords);
    setDestinationCoords(toCoords);
    setSimulatedCaptainLocation(captainStart);

    startSimulation(
      captainStart,
      fromCoords,
      (newLoc) => {
        setSimulatedCaptainLocation(newLoc);
        sendMessage("update-location", {
          userId: captain._id,
          location: newLoc,
          userType: "captain",
        });
      },
      () => {
        alert("Simulation: Arrived at pickup. Please verify OTP.");
      }
    );
  };

  return (
    <div className="h-screen w-screen relative">
      <div className="absolute top-0 left-0 h-full w-full z-0">
        <LiveTrackingMap
          key={currentRide?._id || "background"}
          rideState={
            rideStarted ? "ongoing" : currentRide ? "confirmed" : "none"
          }
          captainLocation={captainLocation}
          userLocation={userLocation}
          pickupCoords={pickupCoords}
          destinationCoords={destinationCoords}
        />
      </div>
      <div className="absolute top-0 left-0 p-4 z-10 w-full md:w-96 md:h-full">
        <div className="bg-white rounded-lg shadow-2xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-black">Captain Dashboard</h2>
            <button
              onClick={toggleOnlineStatus}
              className={`px-4 py-2 rounded-lg font-bold text-white ${
                isOnline ? "bg-red-500" : "bg-green-500"
              }`}
            >
              {isOnline ? "Go Offline" : "Go Online"}
            </button>
          </div>
          {isOnline ? (
            !currentRide ? (
              <RideRequestsList
                rideRequests={rideRequests}
                onAcceptRide={handleAcceptRide}
                onDeclineRide={(id) =>
                  setRideRequests((r) => r.filter((req) => req._id !== id))
                }
              />
            ) : (
              <CurrentRidePanel
                currentRide={currentRide}
                rideStarted={rideStarted}
                onVerifyOtp={handleVerifyOtp}
                onCompleteRide={handleCompleteRide}
              />
            )
          ) : (
            <p className="text-center text-gray-600">You are offline.</p>
          )}
        </div>
      </div>
      <LocationDebugPanel onSimulateRide={startRideSimulationFromDebug} />
    </div>
  );
}
export default CaptainDashboard;
