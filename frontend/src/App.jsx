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
import CaptainProtectedRoute from "./context/CaptainProtectedRoute";
import CaptainDashboard from "./pages/CaptainDashboard";
import CaptainLogout from "./pages/CaptainLogout";
import CaptainRide from "./pages/CaptainRide"; // Import the new page
import MapTest from "./components/MapTest";
// import { CheckoutProvider } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

// const stripePromise = loadStripe(
//   "pk_test_51RvuR2IK5Zv39eeKFH41GluULNWBTHIAhNSpK2B4IQKjKUZlzRvF2SUmzHodEhpEjcqN5nqQKLjsN1HcLvQNr2v000KovsGuFG"
// );

// const fetchClientSecret = async () => {
//   const response = await axios.post("/create-checkout-session");
//   return response.data.checkoutSessionClientSecret;
// };

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<UserLogin />} />
      <Route path="/signup" element={<UserSignup />} />
      <Route path="/captain-login" element={<CaptainLogin />} />
      <Route path="/captain-signup" element={<CaptainSignup />} />
      <Route path="/map-test" element={<MapTest />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
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
      <Route
        path="/captain-ride"
        element={
          <CaptainProtectedRoute>
            <CaptainRide />
          </CaptainProtectedRoute>
        }
      />
      <Route path="/user/logout" element={<UserLogout />} />
      <Route path="/captain/logout" element={<CaptainLogout />} />
    </Routes>
  );
}

export default App;
