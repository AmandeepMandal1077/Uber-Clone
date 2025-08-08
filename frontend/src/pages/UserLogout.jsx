import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UserLogout() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/users/logout`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.status === 200) {
      localStorage.removeItem("token");
      console.log("User logged out successfully");
      navigate("/login");
    }
  };

  return (
    <div>
      <h1>Logout</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default UserLogout;
