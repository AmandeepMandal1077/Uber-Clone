import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
  useRef,
} from "react";
import LocationSearchPage from "./LocationSearchPage";
import RideSelectionPage from "./RideSelectionPage";
import MapPage from "./MapPage";
import RideTracker from "../components/RideTracker";
import LocationDebugPanel from "../components/LocationDebugPanel";
import axios from "axios";
import { SocketContext } from "../context/SocketContext";
import { UserContext } from "../context/UserContext";

const Dashboard = () => {
  // Get socket and user context
  const { sendMessage, isConnected, setIsConnected, receiveMessage } =
    useContext(SocketContext);
  const { user, setUser, loading } = useContext(UserContext);

  // App state management
  const [currentPage, setCurrentPage] = useState("search"); // 'search', 'ride-selection', 'tracking'
  const [routeData, setRouteData] = useState(null);
  const [fareData, setFareData] = useState(null);
  const [isLoadingFare, setIsLoadingFare] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [isSearchingDriver, setIsSearchingDriver] = useState(false);
  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);
  const [otpData, setOtpData] = useState(null);
  const [isLoadingOtp, setIsLoadingOtp] = useState(false);

  // New state for ride tracking
  const [activeRide, setActiveRide] = useState(null);
  const [rideState, setRideState] = useState("waiting");
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);

  // Ref to track if join message has been sent to prevent duplicates
  const hasJoinedRef = useRef(false);

  // Fetch fare data function
  const fetchFareData = useCallback(async () => {
    if (!routeData || !routeData.from || !routeData.to) return;

    // Always set loading state to true when starting a fetch
    setIsLoadingFare(true);

    try {
      console.log(
        `Fetching fare data for ${routeData.from} to ${routeData.to}`
      );

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/get-fare`,
        {
          params: {
            pickup: routeData.from,
            destination: routeData.to,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Fare data response:", response.data);

      // Extract fare data from the response
      const fare = response.data;

      // Backend might return fare directly or nested in a fare object
      const fareValues = fare.fare || fare;

      if (
        fareValues &&
        typeof fareValues === "object" &&
        "car" in fareValues &&
        "bike" in fareValues &&
        "rickshaw" in fareValues
      ) {
        // Create ride options with the fare data
        const updatedRideOptions = [
          {
            id: 1,
            name: "Car",
            price: `₹${fareValues.car}`,
            fareValue: fareValues.car,
            time: "15 min",
            icon: "fas fa-car",
            vehicleType: "car",
          },
          {
            id: 2,
            name: "Bike",
            price: `₹${fareValues.bike}`,
            fareValue: fareValues.bike,
            time: "10 min",
            icon: "fas fa-motorcycle",
            vehicleType: "bike",
          },
          {
            id: 3,
            name: "Rickshaw",
            price: `₹${fareValues.rickshaw}`,
            fareValue: fareValues.rickshaw,
            time: "20 min",
            icon: "fas fa-taxi",
            vehicleType: "rickshaw",
          },
        ];

        setFareData(updatedRideOptions);
      } else {
        console.error("Invalid fare data structure:", fareValues);
        // Set fareData to an empty array to indicate we received data but it's invalid
        setFareData([]);
      }
    } catch (error) {
      console.error("Error fetching fare data:", error);
      // Set fareData to an empty array to indicate an error occurred
      setFareData([]);
    } finally {
      setIsLoadingFare(false);
    }
  }, [routeData]);

  // Helper function to get coordinates from address
  const getCoordinatesFromAddress = async (address) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-coordinates`,
        {
          params: { address },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return {
        lat: response.data.latitude,
        lng: response.data.longitude,
      };
    } catch (error) {
      console.error("Error getting coordinates:", error);
      return null;
    }
  };

  // Fetch fare data when route changes
  useEffect(() => {
    if (routeData && routeData.from && routeData.to) {
      // Add a small delay to ensure we don't have race conditions
      const timer = setTimeout(() => {
        fetchFareData();
        // Also get coordinates for pickup and destination
        getCoordinatesFromAddress(routeData.from).then(setPickupCoords);
        getCoordinatesFromAddress(routeData.to).then(setDestinationCoords);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [routeData]);

  // Connect to socket when component mounts and user is available
  useEffect(() => {
    // Check if user is logged in and has an ID and hasn't joined yet
    if (user && user._id && isConnected && !hasJoinedRef.current) {
      console.log(`Sending join event for user with ID: ${user._id}`);
      // Send join event to server with hard-coded userType
      sendMessage("join", { userId: user._id, userType: "user" });
      hasJoinedRef.current = true; // Mark as joined to prevent duplicates
    }
  }, [user?._id, isConnected]); // Depend on both user ID and connection status

  // Set up socket listener for ride confirmation
  useEffect(() => {
    if (user && user._id) {
      console.log("Setting up ride-confirmed listener for user:", user._id);

      const cleanup = receiveMessage("ride-confirmed", (rideData) => {
        console.log("Ride confirmed by captain:", rideData);

        // Set active ride and update state
        setActiveRide(rideData);
        setRideState("confirmed");

        // Stop searching for driver and show payment confirmation
        setIsSearchingDriver(false);
        setShowPaymentConfirm(true);
      });

      // Return cleanup function
      return cleanup;
    }
  }, [user, receiveMessage]);

  // Set up socket listener for ride completion
  useEffect(() => {
    if (user && user._id) {
      console.log("Setting up ride-completed listener for user:", user._id);

      const cleanup = receiveMessage("ride-completed", (rideData) => {
        console.log("Ride completed by captain:", rideData);

        // Update ride state
        setRideState("completed");

        // Show completion message and redirect to search after delay
        setTimeout(() => {
          alert(
            `Ride completed! Thank you for using our service. Fare: ₹${rideData.fare}`
          );

          // Reset all states and go back to search page
          handleResetToSearch();
        }, 2000);
      });

      // Return cleanup function
      return cleanup;
    }
  }, [user, receiveMessage]);

  // Helper function to reset all states
  const handleResetToSearch = () => {
    setCurrentPage("search");
    setRouteData(null);
    setFareData(null);
    setSelectedRide(null);
    setIsSearchingDriver(false);
    setShowPaymentConfirm(false);
    setOtpData(null);
    setActiveRide(null);
    setRideState("waiting");
    setPickupCoords(null);
    setDestinationCoords(null);
  };

  // Function to generate OTP
  const generateOtp = async () => {
    if (!selectedRide || !routeData) return;

    setIsLoadingOtp(true);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/gen-otp`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("OTP response:", response.data);

      setOtpData(response.data);
    } catch (error) {
      console.error("Error generating OTP:", error);
      setOtpData({ error: "Failed to generate OTP" });
    } finally {
      setIsLoadingOtp(false);
    }
  };

  // Page navigation handlers
  const handleFindRoutes = (routes) => {
    // Clear previous selections
    setSelectedRide(null);
    setIsSearchingDriver(false);
    setShowPaymentConfirm(false);
    setOtpData(null);

    // Clear previous fare data
    setFareData(null);

    // Set loading state
    setIsLoadingFare(true);

    // Change page first to avoid race conditions
    setCurrentPage("ride-selection");

    // Set route data last to trigger the useEffect
    setTimeout(() => {
      setRouteData(routes);
    }, 100);
  };

  const handleBackToSearch = () => {
    setCurrentPage("search");
    setRouteData(null);
    setFareData(null);
    setSelectedRide(null);
    setIsSearchingDriver(false);
    setShowPaymentConfirm(false);
    setOtpData(null);
  };

  const handleRideSelect = (ride) => {
    setSelectedRide(ride);
  };

  const handleBookRide = async () => {
    setIsSearchingDriver(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/create-ride`,
        {
          pickup: routeData.from,
          destination: routeData.to,
          vehicleType: selectedRide?.vehicleType,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Ride booked successfully:", response.data);
    } catch (error) {
      console.error("Error booking ride:", error);
    }
    // Simulate driver search
    // setTimeout(() => {
    //   setIsSearchingDriver(false);
    //   setShowPaymentConfirm(true);
    // }, 3000);
    // sendMessage("new-ride", { ride: selectedRide });
  };

  const handleConfirmPayment = async () => {
    // Generate OTP for the ride
    await generateOtp();

    // Stay on the same page to show OTP, but start tracking
    // Don't transition to tracking mode yet - let user see OTP first
    setRideState("confirmed");
  };

  // Handle ride completion from tracking component
  const handleRideComplete = (rideData) => {
    console.log("Ride completed:", rideData);
    setRideState("completed");

    // Reset after a short delay
    setTimeout(() => {
      handleResetToSearch();
    }, 3000);
  };

  // Retry fetching fare data
  const handleRetryFetch = () => {
    fetchFareData();
  };

  // Render current page content
  const renderCurrentPage = () => {
    switch (currentPage) {
      case "search":
        return <LocationSearchPage onFindRoutes={handleFindRoutes} />;
      case "tracking":
        return (
          <RideTracker
            ride={activeRide}
            rideState={rideState}
            pickupCoords={pickupCoords}
            destinationCoords={destinationCoords}
            onRideComplete={handleRideComplete}
          />
        );
      case "ride-selection":
        // Always show loading screen if isLoadingFare is true
        if (isLoadingFare) {
          return (
            <div className="flex flex-col h-full justify-center items-center p-6 bg-white">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-lg font-medium text-gray-700">
                  Calculating fare...
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  We're getting the best prices for your journey
                </p>
              </div>
            </div>
          );
        } // Only show error screen if we have explicitly set fareData to empty array (not null)
        // This prevents the flash of error screen during initial load
        if (fareData && fareData.length === 0) {
          return (
            <div className="flex flex-col h-full justify-center items-center p-6 bg-white">
              <div className="text-center">
                <div className="text-red-500 text-5xl mb-4">
                  <i className="fas fa-exclamation-circle"></i>
                </div>
                <p className="text-lg font-medium text-gray-700">
                  Unable to calculate fare
                </p>
                <p className="text-sm text-gray-500 mt-2 mb-4">
                  We couldn't calculate the fare for this route.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={handleRetryFetch}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={handleBackToSearch}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
          );
        }

        // Show loading if fareData is null (initial state)
        if (!fareData) {
          return (
            <div className="flex flex-col h-full justify-center items-center p-6 bg-white">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-lg font-medium text-gray-700">
                  Calculating fare...
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  We're getting the best prices for your journey
                </p>
              </div>
            </div>
          );
        }

        return (
          <RideSelectionPage
            rideOptions={fareData}
            selectedRide={selectedRide}
            onRideSelect={handleRideSelect}
            onBookRide={handleBookRide}
            onBack={handleBackToSearch}
            isSearchingDriver={isSearchingDriver}
            showPaymentConfirm={showPaymentConfirm}
            onConfirmPayment={handleConfirmPayment}
            pickup={routeData?.from}
            destination={routeData?.to}
            otp={otpData?.otp}
            isLoadingOtp={isLoadingOtp}
            // New props for ride tracking
            activeRide={activeRide}
            rideState={rideState}
            pickupCoords={pickupCoords}
            destinationCoords={destinationCoords}
            onRideComplete={handleRideComplete}
          />
        );
      default:
        return <LocationSearchPage onFindRoutes={handleFindRoutes} />;
    }
  };

  return (
    <div className="h-screen w-screen bg-[#fdf0d5] overflow-hidden">
      {/* Desktop Layout */}
      <div className="hidden md:flex h-full w-full">
        {/* Left Panel - Current Page Content */}
        <div className="w-1/3 h-full shadow-lg overflow-hidden flex-shrink-0">
          {renderCurrentPage()}
        </div>

        {/* Right Panel - Map */}
        <div className="flex-1 h-full p-4 overflow-hidden">
          <div className="h-full w-full rounded-lg overflow-hidden shadow-lg">
            {/* Show live tracking map when OTP is available, otherwise show regular map */}
            {otpData?.otp && activeRide ? (
              <RideTracker
                ride={activeRide}
                rideState={rideState}
                pickupCoords={pickupCoords}
                destinationCoords={destinationCoords}
                onRideComplete={handleRideComplete}
              />
            ) : (
              <MapPage />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden h-full w-full flex flex-col">
        {/* Top Section - Current Page Content */}
        <div className="h-2/5 w-full shadow-lg flex-shrink-0 overflow-hidden">
          <div className="h-full w-full">{renderCurrentPage()}</div>
        </div>

        {/* Bottom Section - Map */}
        <div className="h-3/5 w-full flex-shrink-0 overflow-hidden">
          <div className="h-full w-full p-2">
            <div className="h-full w-full rounded-lg overflow-hidden shadow-lg">
              {/* Show live tracking map when OTP is available, otherwise show regular map */}
              {otpData?.otp && activeRide ? (
                <RideTracker
                  ride={activeRide}
                  rideState={rideState}
                  pickupCoords={pickupCoords}
                  destinationCoords={destinationCoords}
                  onRideComplete={handleRideComplete}
                />
              ) : (
                <MapPage />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Development Debug Panel */}
      {import.meta.env.DEV && <LocationDebugPanel />}
    </div>
  );
};

export default Dashboard;
