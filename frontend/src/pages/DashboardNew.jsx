import React, { useEffect, useState, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import LocationSearchPage from "./LocationSearchPage";
import RideSelectionPage from "./RideSelectionPage";
import LiveTrackingMap from "../components/LiveTrackingMap";
import LocationDebugPanel from "../components/LocationDebugPanel";
import axios from "axios";
import { SocketContext } from "../context/SocketContext";
import { UserContext } from "../context/UserContext";
import useRealTimeLocation from "../hooks/useRealTimeLocation";
import SearchingDriver from "../components/SearchingDriver";
import PaymentConfirmation from "../components/PaymentConfirmation";
import OTPDisplay from "../components/OTPDisplay";

const RideConfirmation = ({ ride, onConfirm, onCancel }) => (
  <div className="p-4 h-full flex flex-col justify-center items-center bg-white text-black">
    <h2 className="text-2xl font-bold mb-4">Confirm Your Ride</h2>
    <div className="bg-gray-100 p-4 rounded-lg w-full text-center mb-6">
      <p className="text-lg font-semibold">{ride.name}</p>
      <p className="text-2xl font-bold text-green-600">{ride.price}</p>
      <p className="text-sm text-gray-500">{ride.time}</p>
    </div>
    <div className="w-full space-y-2">
      <button
        onClick={onConfirm}
        className="w-full py-3 bg-green-500 text-white rounded-lg font-bold"
      >
        Confirm & Proceed to Pay
      </button>
      <button
        onClick={onCancel}
        className="w-full py-2 bg-gray-200 text-black rounded-lg"
      >
        Cancel
      </button>
    </div>
  </div>
);

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

const Dashboard = () => {
  const { sendMessage, receiveMessage, liveLocations } =
    useContext(SocketContext);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [view, setView] = useState("search");
  const [routeData, setRouteData] = useState(null);
  const [fareData, setFareData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [activeRide, setActiveRide] = useState(null);
  const [rideState, setRideState] = useState("waiting");
  const [otp, setOtp] = useState(null);

  const { currentLocation: userLocation } = useRealTimeLocation(
    user?._id,
    "user",
    true
  );
  const [captainLocation, setCaptainLocation] = useState(null);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);

  const resetToHome = useCallback(() => {
    setView("search");
    setRouteData(null);
    setFareData(null);
    setSelectedRide(null);
    setActiveRide(null);
    setOtp(null);
    setCaptainLocation(null);
    setPickupCoords(null);
    setDestinationCoords(null);
    setRideState("waiting");
  }, []);

  useEffect(() => {
    if (user?._id) {
      sendMessage("join", { userId: user._id, userType: "user" });
    }
  }, [user?._id, sendMessage]);

  useEffect(() => {
    const cleanupConfirmed = receiveMessage(
      "ride-confirmed",
      async (rideData) => {
        setActiveRide(rideData);
        setRideState("confirmed");

        const pickup = await getCoordinates(rideData.pickupLocation);
        const dest = await getCoordinates(rideData.dropoffLocation);
        setPickupCoords(pickup);
        setDestinationCoords(dest);

        try {
          const otpRes = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/rides/get-otp/${rideData._id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setOtp(otpRes.data.otp);
          setView("otp-display");
        } catch (err) {
          console.error("Failed to fetch OTP", err);
        }
      }
    );

    const cleanupStatusUpdate = receiveMessage("ride-status-update", (data) => {
      if (data.rideId === activeRide?._id && data.status === "ongoing") {
        setRideState("ongoing");
      }
    });

    const cleanupCompleted = receiveMessage("ride-completed", (data) => {
      alert(`Ride completed! Fare: ₹${data.fare}.`);
      resetToHome();
    });

    return () => {
      cleanupConfirmed();
      cleanupCompleted();
      cleanupStatusUpdate();
    };
  }, [receiveMessage, resetToHome, activeRide]);

  useEffect(() => {
    if (activeRide && activeRide.captain?._id) {
      const captainId = activeRide.captain._id;
      const locationData = liveLocations[captainId];
      if (locationData) {
        setCaptainLocation({ lat: locationData.lat, lng: locationData.lng });
      }
    }
  }, [liveLocations, activeRide]);

  const handleFindRoutes = async (routes) => {
    setIsLoading(true);
    setRouteData(routes);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/get-fare`,
        {
          params: { pickup: routes.from, destination: routes.to },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const options = ["car", "bike", "rickshaw"].map((type) => ({
        id: type,
        name: type.charAt(0).toUpperCase() + type.slice(1),
        price: `₹${data[type]}`,
        vehicleType: type,
        time: "5 min",
      }));
      setFareData(options);
      setView("ride-selection");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRideSelect = (ride) => {
    setSelectedRide(ride);
    setView("ride-confirmation");
  };

  const handleConfirmRide = () => setView("payment");

  const handleConfirmPayment = async () => {
    setIsLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/create-ride`,
        {
          pickup: routeData.from,
          destination: routeData.to,
          vehicleType: selectedRide.vehicleType,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setView("searching-driver");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderPanel = () => {
    if (isLoading) return <SearchingDriver />;
    switch (view) {
      case "search":
        return <LocationSearchPage onFindRoutes={handleFindRoutes} />;
      case "ride-selection":
        return (
          <RideSelectionPage
            rideOptions={fareData}
            onRideSelect={handleRideSelect}
            onBack={resetToHome}
          />
        );
      case "ride-confirmation":
        return (
          <RideConfirmation
            ride={selectedRide}
            onConfirm={handleConfirmRide}
            onCancel={() => setView("ride-selection")}
          />
        );
      case "payment":
        return (
          <PaymentConfirmation
            onConfirmPayment={handleConfirmPayment}
            pickup={routeData.from}
            destination={routeData.to}
          />
        );
      case "searching-driver":
        return <SearchingDriver />;
      case "otp-display":
        return (
          <OTPDisplay
            otp={otp}
            pickup={activeRide?.pickupLocation}
            destination={activeRide?.dropoffLocation}
            activeRide={activeRide}
            onBack={resetToHome}
          />
        );
      default:
        return <LocationSearchPage onFindRoutes={handleFindRoutes} />;
    }
  };

  return (
    <div className="h-screen w-screen relative">
      <div className="absolute top-0 left-0 h-full w-full z-0">
        <LiveTrackingMap
          rideState={rideState}
          userLocation={userLocation}
          captainLocation={captainLocation}
          pickupCoords={pickupCoords}
          destinationCoords={destinationCoords}
        />
      </div>
      <div className="absolute top-0 left-0 h-auto w-full md:h-full md:w-1/3 p-4 z-10">
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden min-h-[300px]">
          {renderPanel()}
        </div>
      </div>
      <LocationDebugPanel onSimulateRide={handleFindRoutes} />
    </div>
  );
};

export default Dashboard;
