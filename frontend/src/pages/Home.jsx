import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-[#fdf0d5] flex flex-col">
      {/* Header */}
      <header className="bg-[#003049] text-white p-4 shadow-lg">
        <h1 className="text-2xl font-bold text-center">YATRA</h1>
        <p className="text-center text-sm opacity-90">
          Your Journey Starts Here
        </p>
      </header>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#003049] mb-4">
            Welcome to YATRA
          </h2>
          <p className="text-[#780000] text-lg mb-6">
            Book rides instantly with trusted drivers
          </p>
        </div>

        {/* User Section */}
        <div className="w-full max-w-sm mb-6">
          <h3 className="text-xl font-semibold text-[#003049] mb-4 text-center">
            For Passengers
          </h3>
          <div className="space-y-3">
            <Link
              to="/login"
              className="block w-full bg-[#c1121f] text-white py-3 px-6 rounded-lg text-center font-medium hover:bg-[#780000] transition-colors"
            >
              Login as User
            </Link>
            <Link
              to="/signup"
              className="block w-full bg-[#669bbc] text-white py-3 px-6 rounded-lg text-center font-medium hover:bg-[#003049] transition-colors"
            >
              Sign Up as User
            </Link>
          </div>
        </div>

        {/* Captain Section */}
        <div className="w-full max-w-sm">
          <h3 className="text-xl font-semibold text-[#003049] mb-4 text-center">
            For Drivers
          </h3>
          <div className="space-y-3">
            <Link
              to="/captain-login"
              className="block w-full bg-[#780000] text-white py-3 px-6 rounded-lg text-center font-medium hover:bg-[#c1121f] transition-colors"
            >
              Login as Captain
            </Link>
            <Link
              to="/captain-signup"
              className="block w-full border-2 border-[#780000] text-[#780000] py-3 px-6 rounded-lg text-center font-medium hover:bg-[#780000] hover:text-white transition-colors"
            >
              Join as Captain
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#003049] text-white p-4 text-center">
        <p className="text-sm opacity-90">
          © 2025 YATRA - Safe & Reliable Rides
        </p>
      </footer>
    </div>
  );
}

export default Home;
