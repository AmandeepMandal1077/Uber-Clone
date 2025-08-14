import React from "react";
import LiveTrackingMap from "./LiveTrackingMap";

const RideTracker = ({ ride, rideState }) => {
  // This component will eventually hold UI elements for the user's tracking screen
  // For now, it mainly serves as a wrapper for the LiveTrackingMap

  // In the future, you could add captain details, ETA, etc. here.

  return (
    <div className="h-full w-full">
      <LiveTrackingMap
        ride={ride}
        rideState={rideState}
        // The props for locations will be managed within LiveTrackingMap
        // based on the ride object and socket events.
      />
    </div>
  );
};

export default RideTracker;
