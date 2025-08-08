import React, { useState, useEffect } from "react";

export const CaptainContext = React.createContext();

function CaptainContextProvider({ children }) {
  const [captain, setCaptain] = useState({
    fullname: {
      firstname: "",
      lastname: "",
    },
    email: "",
    vehicle: {
      type: "",
      color: "",
      capacity: "",
      number: "",
    },
    status: "offline", // offline or online
  });

  const [isOnline, setIsOnline] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentRide, setCurrentRide] = useState(null);
  const [rideRequests, setRideRequests] = useState([]);
  const [earnings, setEarnings] = useState({
    today: 0,
    total: 0,
  });
  const [rideHistory, setRideHistory] = useState([]);

  // Update captain status when isOnline changes
  useEffect(() => {
    if (captain._id) {
      setCaptain({
        ...captain,
        status: isOnline ? "active" : "inactive",
      });

      // Here you would also update the captain's status in the database
      // if (isOnline) {
      //   updateCaptainStatus(captain._id, "active");
      // } else {
      //   updateCaptainStatus(captain._id, "inactive");
      // }
    }
  }, [isOnline]);

  // Function to toggle online/offline status
  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
  };

  // Function to accept a ride request
  const acceptRideRequest = (requestId) => {
    const acceptedRide = rideRequests.find(
      (request) => request.id === requestId
    );
    if (acceptedRide) {
      setCurrentRide(acceptedRide);
      setRideRequests(
        rideRequests.filter((request) => request.id !== requestId)
      );
    }
  };

  // Function to reject a ride request
  const rejectRideRequest = (requestId) => {
    setRideRequests(rideRequests.filter((request) => request.id !== requestId));
  };

  // Function to complete a ride
  const completeRide = (fare) => {
    if (currentRide) {
      const completedRide = {
        ...currentRide,
        completedAt: new Date(),
        fare,
      };

      setRideHistory([completedRide, ...rideHistory]);
      setEarnings({
        today: earnings.today + fare,
        total: earnings.total + fare,
      });
      setCurrentRide(null);
    }
  };

  return (
    <CaptainContext.Provider
      value={{
        captain,
        setCaptain,
        isOnline,
        toggleOnlineStatus,
        currentLocation,
        setCurrentLocation,
        currentRide,
        setCurrentRide,
        rideRequests,
        setRideRequests,
        acceptRideRequest,
        rejectRideRequest,
        completeRide,
        earnings,
        rideHistory,
      }}
    >
      {children}
    </CaptainContext.Provider>
  );
}

export default CaptainContextProvider;
