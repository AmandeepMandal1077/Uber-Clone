import React, { useState } from "react";
import LocationSearchPage from "./LocationSearchPage";
import RideSelectionPage from "./RideSelectionPage";
import MapPage from "./MapPage";

const Dashboard = () => {
  // App state management
  const [currentPage, setCurrentPage] = useState("search"); // 'search', 'ride-selection'
  const [routeData, setRouteData] = useState(null);
  const [selectedRide, setSelectedRide] = useState(null);
  const [isSearchingDriver, setIsSearchingDriver] = useState(false);
  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);

  // Ride options data
  const rideOptions = [
    {
      id: 1,
      name: "UberX",
      description: "Affordable, everyday rides",
      price: "₹183",
      time: "2 min",
      rating: "4.8",
      icon: "fas fa-car",
    },
    {
      id: 2,
      name: "Moto",
      description: "Quick and affordable bike rides",
      price: "₹65",
      time: "1 min",
      rating: "4.6",
      icon: "fas fa-motorcycle",
    },
    {
      id: 3,
      name: "Auto",
      description: "Three-wheeler rides",
      price: "₹118",
      time: "3 min",
      rating: "4.4",
      icon: "fas fa-taxi",
    },
  ];

  // Page navigation handlers
  const handleFindRoutes = (routes) => {
    setRouteData(routes);
    setCurrentPage("ride-selection");
  };

  const handleBackToSearch = () => {
    setCurrentPage("search");
    setSelectedRide(null);
    setIsSearchingDriver(false);
    setShowPaymentConfirm(false);
  };

  const handleRideSelect = (ride) => {
    setSelectedRide(ride);
  };

  const handleBookRide = () => {
    setIsSearchingDriver(true);
    // Simulate driver search
    setTimeout(() => {
      setIsSearchingDriver(false);
      setShowPaymentConfirm(true);
    }, 3000);
  };

  const handleConfirmPayment = () => {
    // Handle payment confirmation
    alert("Payment confirmed! Your ride is booked.");
    handleBackToSearch(); // Reset to initial state
  };

  // Render current page content
  const renderCurrentPage = () => {
    switch (currentPage) {
      case "search":
        return <LocationSearchPage onFindRoutes={handleFindRoutes} />;
      case "ride-selection":
        return (
          <RideSelectionPage
            rideOptions={rideOptions}
            selectedRide={selectedRide}
            onRideSelect={handleRideSelect}
            onBookRide={handleBookRide}
            onBack={handleBackToSearch}
            isSearchingDriver={isSearchingDriver}
            showPaymentConfirm={showPaymentConfirm}
            onConfirmPayment={handleConfirmPayment}
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
            <MapPage />
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
              <MapPage />
            </div>
          </div>

          {/* Floating Search Button (only on search page) */}
          {currentPage === "search" && (
            <div className="absolute bottom-6 right-6 z-10">
              <button
                onClick={() => {
                  // This will be handled by the LocationSearchPage component
                }}
                className="w-14 h-14 bg-[#c1121f] hover:bg-[#780000] text-white rounded-full shadow-lg transition-all flex items-center justify-center"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
