import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CaptainContext } from "../context/CaptainContext";
import axios from "axios";

function CaptainLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { setCaptain } = useContext(CaptainContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captain/login`,
        formData
      );

      if (response.status === 200) {
        const data = response.data;
        setCaptain(data.captain);
        localStorage.setItem("token", data.token);
        navigate("/captain-dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      // Handle error (show message, etc.)
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf0d5] flex flex-col">
      {/* Header */}
      <header className="bg-[#780000] text-white p-4">
        <div className="flex items-center">
          <Link to="/" className="text-xl mr-4">
            ←
          </Link>
          <h1 className="text-xl font-bold">YATRA - Captain Login</h1>
        </div>
      </header>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-6">
              <div className="bg-[#780000] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚗</span>
              </div>
              <h2 className="text-2xl font-bold text-[#003049]">
                Welcome Back, Captain
              </h2>
              <p className="text-[#669bbc] text-sm mt-2">
                Login to start earning with YATRA
              </p>
            </div>

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
                  className="w-full px-4 py-3 border-2 border-[#669bbc] rounded-lg focus:outline-none focus:border-[#780000] transition-colors"
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
                  className="w-full px-4 py-3 border-2 border-[#669bbc] rounded-lg focus:outline-none focus:border-[#780000] transition-colors"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#780000] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#c1121f] transition-colors"
              >
                Login as Captain
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-[#003049]">
                New to YATRA?{" "}
                <Link
                  to="/captain-signup"
                  className="text-[#780000] font-medium hover:underline"
                >
                  Join as Captain
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link
                to="/login"
                className="text-[#669bbc] text-sm hover:underline"
              >
                Are you a passenger? Login as User
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CaptainLogin;
