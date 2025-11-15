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
  const { sendMessage, receiveMessage, liveLocations, getCaptainLocation } =
    useContext(SocketContext);
  const { user, userDashboardData, setUserDashboardData, loading } =
    useContext(UserContext);
  const navigate = useNavigate();
  const [view, setView] = useState("search");
  const [routeData, setRouteData] = useState(null);
  const [fareData, setFareData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [activeRide, setActiveRide] = useState(null);
  const [rideState, setRideState] = useState("waiting");
  const [otp, setOtp] = useState(null);

  const [userLocation, setUserLocation] = useState(null);
  const [captainLocation, setCaptainLocation] = useState(null);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);

  // Centralized location update handler
  const handleLocationUpdate = useCallback((newLocation) => {
    setUserLocation(newLocation);
  }, []);

  useRealTimeLocation(user?._id, "user", true, handleLocationUpdate);

  useEffect(() => {
    const initializeState = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/rides/get-ride-details`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.data) {
          return;
        }

        const ride = response.data;

        if (ride.status === "completed" || ride.status === "cancelled") {
          return;
        }

        // Set common ride data first
        if (ride.pickupLocation && ride.dropoffLocation) {
          setRouteData({ from: ride.pickupLocation, to: ride.dropoffLocation });
          const pickup = await getCoordinates(ride.pickupLocation);
          const dest = await getCoordinates(ride.dropoffLocation);
          setPickupCoords(pickup);
          setDestinationCoords(dest);
        }

        if (
          ride.captain &&
          (ride.status === "confirmed" ||
            ride.status === "payed" ||
            ride.status === "ongoing")
        ) {
          setActiveRide(ride);
          setRideState(ride.status);

          const otpResponse = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/rides/get-otp/${ride._id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          setOtp(otpResponse.data.otp);
          setView("otp-display");
        } else if (ride.fare && ride.vehicleType) {
          const currentRide = {
            id: ride.vehicleType,
            name:
              ride.vehicleType.charAt(0).toUpperCase() +
              ride.vehicleType.slice(1),
            price: `₹${ride.fare}`,
            vehicleType: ride.vehicleType,
            time: "5 min",
          };
          setSelectedRide(currentRide);
          setView("payment");
        }
      } catch (error) {
        console.error(
          "No active ride found or error initializing:",
          error.message
        );
        setView("search");
      }
    };

    if (user?._id && !loading) {
      initializeState();
    }
  }, [user?._id, loading]);

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
    if (user?._id && !loading) {
      sendMessage("join", { userId: user._id, userType: "user" });
    }
  }, [user?._id, sendMessage, loading]);

  useEffect(() => {
    if (loading) return;

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
  }, [receiveMessage, resetToHome, activeRide, loading]);

  useEffect(() => {
    if (!loading && activeRide && activeRide.captain) {
      const captainId = activeRide.captain._id || activeRide.captain;
      const locationData = liveLocations[captainId];
      if (locationData) {
        setCaptainLocation({ lat: locationData.lat, lng: locationData.lng });
      }
    }
  }, [liveLocations, activeRide, loading]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white">Initializing...</p>
        </div>
      </div>
    );
  }

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

  const handleConfirmRide = async () => {
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
      setView("payment");
    } catch (error) {
      setView("payment");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const payingViaStripe = async () => {
    try {
      const itemData = {
        name: "Ride Payment",
        description: `Payment for ride from ${routeData.from} to ${routeData.to}`,
        price: 100 * Number(selectedRide.price.replace("₹", "").trim()),
        currency: "inr",
      };
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/stripe/create-checkout-session`,
        {
          item: itemData,
          rideId: activeRide ? activeRide._id : null,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const session = response.data;
      if (session.url) {
        window.location.href = session.url;
      }
    } catch (error) {
      console.error("Error during payment:", error);
    }
  };

  const handleConfirmPayment = async () => {
    setIsLoading(true);
    try {
      const p = selectedRide.price.replace("₹", "").trim();
      console.log("price: ", p);
      let paymentStatus = "pending";
      //integrate stripe here:-
      await payingViaStripe();

      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get("session_id");

      if (sessionId) {
        paymentStatus = "completed";
        console.log("Payment Status:", paymentStatus);
        const rideData = { status: "confirmed" };
        const response = await axios.patch(
          `${import.meta.env.VITE_BASE_URL}/rides/update-ride-details`,
          {
            rideData,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response || !response.data) {
          throw new Error("Error while paying for ride");
        }
        //check for payment confirmation
        setView("searching-driver");
      } else {
        paymentStatus = "not_completed";
        console.log("Payment Status:", paymentStatus);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelRide = async () => {
    try {
      const rideData = { status: "cancelled" };
      await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/rides/update-ride-details`,
        { rideData },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      resetToHome();
    } catch (error) {
      console.error("Error cancelling ride:", error);
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
      <div>
        {(view === "searching-driver" ||
          view === "otp-display" ||
          view === "payment") && (
          <button
            onClick={handleCancelRide}
            className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg z-20"
          >
            Cancel Ride
          </button>
        )}
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
