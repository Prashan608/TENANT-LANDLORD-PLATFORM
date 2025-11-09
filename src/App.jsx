import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TenantDashboard from "./pages/TenantDashboard";
import LandlordDashboard from "./pages/LandlordDashboard";
import MaintenanceHistory from "./pages/MaintenanceHistory";
import MaintenanceForm from "./pages/MaintenanceForm";
import PaymentTracker from "./pages/PaymentTracker";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tenant" element={<TenantDashboard />} />
        <Route path="/landlord" element={<LandlordDashboard />} />
        <Route path="/maintenance-history" element={<MaintenanceHistory />} />
        <Route path="/maintenance-form" element={<MaintenanceForm />} />
        <Route path="/payment-tracker" element={<PaymentTracker />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/messages" element={<Messages />} />
      </Routes>
    </Router>
  );
}

export default App;
