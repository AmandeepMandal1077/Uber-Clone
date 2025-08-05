import React, { useState } from "react";
import { Link } from "react-router-dom";

function UserSignup() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic here
    console.log("User signup:", formData);
  };

  return (
    <div className="min-h-screen bg-[#fdf0d5] flex flex-col">
      {/* Header */}
      <header className="bg-[#003049] text-white p-4">
        <div className="flex items-center">
          <Link to="/" className="text-xl mr-4">
            ←
          </Link>
          <h1 className="text-xl font-bold">YATRA - Create Account</h1>
        </div>
      </header>

      {/* Signup Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-[#003049] text-center mb-6">
              Join YATRA
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#780000] font-medium mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-[#669bbc] rounded-lg focus:outline-none focus:border-[#c1121f] transition-colors"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block text-[#780000] font-medium mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-[#669bbc] rounded-lg focus:outline-none focus:border-[#c1121f] transition-colors"
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#780000] font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-[#669bbc] rounded-lg focus:outline-none focus:border-[#c1121f] transition-colors"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-[#780000] font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-[#669bbc] rounded-lg focus:outline-none focus:border-[#c1121f] transition-colors"
                  placeholder="Create a password"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#669bbc] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#003049] transition-colors"
              >
                Create Account
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-[#003049]">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[#c1121f] font-medium hover:underline"
                >
                  Login here
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link
                to="/captain-signup"
                className="text-[#669bbc] text-sm hover:underline"
              >
                Want to drive with us? Join as Captain
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserSignup;
