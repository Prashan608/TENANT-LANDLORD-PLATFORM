import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const TenantDashboard = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [unreadCount, setUnreadCount] = useState(2);
  
  const raw = localStorage.getItem("loggedInUser");
  let user = null;
  try {
    user = raw ? JSON.parse(raw) : null;
  } catch {
    user = null;
  }

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("maintenanceRequests")) || [];
    setRequests(stored);
  }, []);

  if (!user || user.role !== "tenant") {
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  const pendingCount = requests.filter(r => r.status === "Pending").length;
  const inProgressCount = requests.filter(r => r.status === "In Progress").length;
  const completedCount = requests.filter(r => r.status === "Completed").length;

  const mockMessages = [
    { from: "Landlord", text: "Your rent payment has been received. Thank you!", time: "2 hours ago" },
    { from: "Landlord", text: "Maintenance team will visit tomorrow at 2 PM.", time: "1 day ago" }
  ];

  const getStatusProgress = (status) => {
    switch (status) {
      case "Pending": return 33;
      case "In Progress": return 66;
      case "Completed": return 100;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar user={user} onLogout={handleLogout} />

      {/* Dashboard Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 bg-gray-50 p-4 md:p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Dashboard Overview
            </h2>
            <div className="relative cursor-pointer" onClick={() => navigate("/notifications")}>
              <svg className="w-7 h-7 text-gray-700 hover:text-blue-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
          </div>

          {/* Status Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-5 rounded-lg shadow-md border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-700 font-medium">Pending</p>
                  <p className="text-3xl font-bold text-yellow-800">{pendingCount}</p>
                </div>
                <div className="bg-yellow-200 p-3 rounded-full">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-lg shadow-md border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-medium">In Progress</p>
                  <p className="text-3xl font-bold text-blue-800">{inProgressCount}</p>
                </div>
                <div className="bg-blue-200 p-3 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-lg shadow-md border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 font-medium">Completed</p>
                  <p className="text-3xl font-bold text-green-800">{completedCount}</p>
                </div>
                <div className="bg-green-200 p-3 rounded-full">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => navigate("/maintenance-form")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg shadow-md transition transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Submit Request
            </button>

            <button
              onClick={() => navigate("/payment-tracker")}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg shadow-md transition transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Pay Rent
            </button>

            <button
              onClick={() => navigate("/messages")}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-6 rounded-lg shadow-md transition transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Landlord
            </button>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Maintenance Requests */}
            <div
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
              onClick={() => navigate("/maintenance-history")}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Recent Maintenance Requests</h3>
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {requests.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No maintenance requests yet</p>
              ) : (
                <div className="space-y-4">
                  {requests.slice(0, 3).map((req) => (
                    <div key={req.id} className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-800">{req.category}</p>
                          <p className="text-sm text-gray-600">{req.description.substring(0, 50)}...</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          req.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                          req.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                          "bg-green-100 text-green-700"
                        }`}>
                          {req.status}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            req.status === "Pending" ? "bg-yellow-500" :
                            req.status === "In Progress" ? "bg-blue-500" :
                            "bg-green-500"
                          }`}
                          style={{ width: `${getStatusProgress(req.status)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{req.date} • {req.urgency} urgency</p>
                    </div>
                  ))}
                  {requests.length > 3 && (
                    <p className="text-sm text-blue-600 text-center mt-3 font-medium">
                      +{requests.length - 3} more requests
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Rent Payment & Messages */}
            <div className="space-y-6">
              {/* Upcoming Rent Payment */}
              <div
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
                onClick={() => navigate("/payment-tracker")}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Upcoming Rent Payment</h3>
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border-l-4 border-green-500">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Due Date</p>
                      <p className="text-2xl font-bold text-gray-800">Nov 15, 2025</p>
                      <p className="text-sm text-gray-600 mt-1">Amount: $1,200</p>
                    </div>
                    <div className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold">
                      6 Days Left
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Messages */}
              <div
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
                onClick={() => navigate("/messages")}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Recent Messages</h3>
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div className="space-y-3">
                  {mockMessages.map((msg, idx) => (
                    <div key={idx} className="border-l-4 border-purple-500 pl-4 py-2 bg-gray-50 rounded">
                      <div className="flex justify-between items-start">
                        <p className="font-semibold text-gray-800 text-sm">{msg.from}</p>
                        <p className="text-xs text-gray-500">{msg.time}</p>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{msg.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TenantDashboard;
