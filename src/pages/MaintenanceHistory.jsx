import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const MaintenanceHistory = () => {
  const [requests, setRequests] = useState([]);
  
  const raw = localStorage.getItem("loggedInUser");
  let user = null;
  try {
    user = raw ? JSON.parse(raw) : null;
  } catch {
    user = null;
  }

  useEffect(() => {
    if (!user) return;

    const stored = JSON.parse(localStorage.getItem("maintenanceRequests")) || [];
    setRequests(stored);
  }, []);

  if (!user || user.role !== "tenant") {
    return <Navigate to="/" replace />;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Completed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">
          🧾 Maintenance Request History
        </h1>

        {requests.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            No maintenance requests submitted yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-700">
                  <th className="p-3 border">#</th>
                  <th className="p-3 border">Category</th>
                  <th className="p-3 border">Urgency</th>
                  <th className="p-3 border">Status</th>
                  <th className="p-3 border">Date</th>
                  <th className="p-3 border">Description</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req, index) => (
                  <tr
                    key={req.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3 border text-gray-700 font-medium">
                      {index + 1}
                    </td>
                    <td className="p-3 border">{req.category}</td>
                    <td className="p-3 border">{req.urgency}</td>
                    <td className="p-3 border">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                          req.status
                        )}`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="p-3 border">{req.date}</td>
                    <td className="p-3 border text-gray-600">{req.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenanceHistory;
