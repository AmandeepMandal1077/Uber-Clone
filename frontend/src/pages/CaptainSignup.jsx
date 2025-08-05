import React, { useState } from "react";
import { Link } from "react-router-dom";

function CaptainSignup() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    vehicleType: "",
    vehicleColor: "",
    vehicleCapacity: "",
    vehicleNumber: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle captain signup logic here
    console.log("Captain signup:", formData);
  };

  return (
    <div className="min-h-screen bg-[#fdf0d5] flex flex-col">
      {/* Header */}
      <header className="bg-[#780000] text-white p-4">
        <div className="flex items-center">
          <Link to="/" className="text-xl mr-4">
            ←
          </Link>
          <h1 className="text-xl font-bold">YATRA - Join as Captain</h1>
        </div>
      </header>

      {/* Signup Form */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-6">
              <div className="bg-[#780000] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚗</span>
              </div>
              <h2 className="text-2xl font-bold text-[#003049]">
                Become a YATRA Captain
              </h2>
              <p className="text-[#669bbc] text-sm mt-2">
                Start earning by driving with us
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Personal Information */}
              <div className="border-b border-[#669bbc] pb-4">
                <h3 className="text-[#780000] font-semibold mb-3">
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#780000] text-sm font-medium mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border-2 border-[#669bbc] rounded-lg focus:outline-none focus:border-[#780000] transition-colors text-sm"
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label className="block text-[#780000] text-sm font-medium mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border-2 border-[#669bbc] rounded-lg focus:outline-none focus:border-[#780000] transition-colors text-sm"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-[#780000] text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border-2 border-[#669bbc] rounded-lg focus:outline-none focus:border-[#780000] transition-colors text-sm"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-[#780000] text-sm font-medium mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border-2 border-[#669bbc] rounded-lg focus:outline-none focus:border-[#780000] transition-colors text-sm"
                    placeholder="Create a password"
                  />
                </div>
              </div>

              {/* Vehicle Information */}
              <div>
                <h3 className="text-[#780000] font-semibold mb-3">
                  Vehicle Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#780000] text-sm font-medium mb-2">
                      Vehicle Type
                    </label>
                    <select
                      name="vehicleType"
                      value={formData.vehicleType}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border-2 border-[#669bbc] rounded-lg focus:outline-none focus:border-[#780000] transition-colors text-sm"
                    >
                      <option value="">Select type</option>
                      <option value="car">Car</option>
                      <option value="bike">Bike</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#780000] text-sm font-medium mb-2">
                      Color
                    </label>
                    <input
                      type="text"
                      name="vehicleColor"
                      value={formData.vehicleColor}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border-2 border-[#669bbc] rounded-lg focus:outline-none focus:border-[#780000] transition-colors text-sm"
                      placeholder="Vehicle color"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-[#780000] text-sm font-medium mb-2">
                      Capacity
                    </label>
                    <input
                      type="number"
                      name="vehicleCapacity"
                      value={formData.vehicleCapacity}
                      onChange={handleChange}
                      required
                      min="1"
                      className="w-full px-3 py-2 border-2 border-[#669bbc] rounded-lg focus:outline-none focus:border-[#780000] transition-colors text-sm"
                      placeholder="Seats"
                    />
                  </div>
                  <div>
                    <label className="block text-[#780000] text-sm font-medium mb-2">
                      Number
                    </label>
                    <input
                      type="text"
                      name="vehicleNumber"
                      value={formData.vehicleNumber}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border-2 border-[#669bbc] rounded-lg focus:outline-none focus:border-[#780000] transition-colors text-sm"
                      placeholder="ABC1234"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#780000] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#c1121f] transition-colors mt-6"
              >
                Join as Captain
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-[#003049] text-sm">
                Already a captain?{" "}
                <Link
                  to="/captain-login"
                  className="text-[#780000] font-medium hover:underline"
                >
                  Login here
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link
                to="/signup"
                className="text-[#669bbc] text-sm hover:underline"
              >
                Looking for rides? Join as Passenger
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CaptainSignup;
