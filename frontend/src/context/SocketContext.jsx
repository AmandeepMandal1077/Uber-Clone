import React, { useEffect } from "react";
import { io } from "socket.io-client";

export const SocketContext = React.createContext();

export const socket = io(`${import.meta.env.VITE_BASE_URL}`);

const SocketContextProvider = ({ children }) => {
  const [isConnected, setIsConnected] = React.useState(false);
  const [liveLocations, setLiveLocations] = React.useState({});

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    // Handle reconnection
    socket.on("reconnect", () => {
      console.log("Socket reconnected:", socket.id);
      setIsConnected(true);
    });

    // Listen for location updates
    socket.on("location-update", (data) => {
      console.log("Received location update:", data);
      const { userId, location, userType } = data;
      setLiveLocations((prev) => ({
        ...prev,
        [userId]: {
          ...location,
          userType,
          timestamp: Date.now(),
        },
      }));
    });

    // Listen for ride status updates
    socket.on("ride-status-update", (data) => {
      console.log("Received ride status update:", data);
      // This can be handled by individual components
    });

    // Cleanup function
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("reconnect");
      socket.off("location-update");
      socket.off("ride-status-update");
    };
  }, []);

  const sendMessage = (eventName, message) => {
    socket.emit(eventName, message);
  };

  const receiveMessage = (eventName, callback) => {
    socket.on(eventName, callback);

    // Return cleanup function
    return () => {
      socket.off(eventName, callback);
    };
  };

  const sendLocationUpdate = (userId, location, userType) => {
    console.log("Sending location update:", { userId, location, userType });
    socket.emit("update-location", {
      userId,
      location,
      userType,
    });
  };

  const getCaptainLocation = (captainId) => {
    return liveLocations[captainId] || null;
  };

  const getUserLocation = (userId) => {
    return liveLocations[userId] || null;
  };

  return (
    <SocketContext.Provider
      value={{
        sendMessage,
        receiveMessage,
        sendLocationUpdate,
        getCaptainLocation,
        getUserLocation,
        liveLocations,
        setIsConnected,
        isConnected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
