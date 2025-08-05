import React, { useState } from "react";
import { Link } from "react-router-dom";

function UserLogin() {
  const [formData, setFormData] = useState({
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
    // Handle login logic here
    console.log("User login:", formData);
  };

  return (
    <div className="min-h-screen bg-[#fdf0d5] flex flex-col">
      {/* Header */}
      <header className="bg-[#003049] text-white p-4">
        <div className="flex items-center">
          <Link to="/" className="text-xl mr-4">
            ←
          </Link>
          <h1 className="text-xl font-bold">YATRA - User Login</h1>
        </div>
      </header>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-[#003049] text-center mb-6">
              Welcome Back
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#c1121f] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#780000] transition-colors"
              >
                Login
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-[#003049]">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-[#c1121f] font-medium hover:underline"
                >
                  Sign up here
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link
                to="/captain-login"
                className="text-[#669bbc] text-sm hover:underline"
              >
                Are you a driver? Login as Captain
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
