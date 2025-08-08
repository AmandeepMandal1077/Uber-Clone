import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import CaptainSignup from "./pages/CaptainSignup";
import CaptainLogin from "./pages/CaptainLogin";
import Dashboard from "./pages/DashboardNew";
import ProtectedRoute from "./context/ProtectedRoute";
import UserLogout from "./pages/UserLogout";
import CaptainContextProvider from "./context/CaptainContext";
import CaptainProtectedRoute from "./context/CaptainProtectedRoute";
import CaptainDashboard from "./pages/CaptainDashboard";
import CaptainLogout from "./pages/CaptainLogout";

function App() {
  return (
    <CaptainContextProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/captain-login" element={<CaptainLogin />} />
        <Route path="/captain-signup" element={<CaptainSignup />} />
        <Route
          path="/dashboard"
          element={
            // <ProtectedRoute>
            <Dashboard />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/captain-dashboard"
          element={
            <CaptainProtectedRoute>
              <CaptainDashboard />
            </CaptainProtectedRoute>
          }
        />
        <Route path="/user/logout" element={<UserLogout />} />
        <Route path="/captain/logout" element={<CaptainLogout />} />
      </Routes>
    </CaptainContextProvider>
  );
}

export default App;
