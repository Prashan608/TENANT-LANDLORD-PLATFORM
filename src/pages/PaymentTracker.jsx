import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const PaymentTracker = () => {
  const [payments, setPayments] = useState([]);
  const [upcomingPayment, setUpcomingPayment] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();

  const raw = localStorage.getItem("loggedInUser");
  let user = null;
  try {
    user = raw ? JSON.parse(raw) : null;
  } catch {
    user = null;
  }

  // Early return for authentication
  if (!user || user.role !== "tenant") {
    return <Navigate to="/" replace />;
  }

  const initializePayments = () => {
    const mockPayments = [
      {
        id: 1,
        date: "2024-10-01",
        amount: 1500,
        status: "Paid",
        method: "Bank Transfer",
      },
      {
        id: 2,
        date: "2024-09-01",
        amount: 1500,
        status: "Paid",
        method: "Cash",
      },
      {
        id: 3,
        date: "2024-08-01",
        amount: 1500,
        status: "Paid",
        method: "Bank Transfer",
      },
      {
        id: 4,
        date: "2024-07-01",
        amount: 1500,
        status: "Paid",
        method: "Check",
      },
      {
        id: 5,
        date: "2024-06-01",
        amount: 1500,
        status: "Paid",
        method: "Bank Transfer",
      },
    ];

    const mockUpcoming = {
      id: 6,
      date: "2024-11-01",
      amount: 1500,
      status: "Pending",
      method: "Bank Transfer",
    };

    return { mockPayments, mockUpcoming };
  };

  useEffect(() => {
    if (!user) return;

    const storedPayments = localStorage.getItem("paymentHistory");
    const storedUpcoming = localStorage.getItem("upcomingPayment");

    if (storedPayments && storedUpcoming) {
      setPayments(JSON.parse(storedPayments));
      setUpcomingPayment(JSON.parse(storedUpcoming));
    } else {
      const { mockPayments, mockUpcoming } = initializePayments();
      setPayments(mockPayments);
      setUpcomingPayment(mockUpcoming);
      localStorage.setItem("paymentHistory", JSON.stringify(mockPayments));
      localStorage.setItem("upcomingPayment", JSON.stringify(mockUpcoming));
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  const markAsPaid = () => {
    const updatedPayment = {
      ...upcomingPayment,
      status: "Paid",
      date: new Date().toISOString().split("T")[0],
    };

    const updatedPayments = [updatedPayment, ...payments];
    setPayments(updatedPayments);

    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const newUpcoming = {
      id: upcomingPayment.id + 1,
      date: nextMonth.toISOString().split("T")[0],
      amount: 1500,
      status: "Pending",
      method: "Bank Transfer",
    };
    setUpcomingPayment(newUpcoming);

    localStorage.setItem("paymentHistory", JSON.stringify(updatedPayments));
    localStorage.setItem("upcomingPayment", JSON.stringify(newUpcoming));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700 border-green-300";
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Overdue":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const totalPaidThisYear = payments
    .filter((p) => {
      const paymentYear = new Date(p.date).getFullYear();
      return paymentYear === 2024 && p.status === "Paid";
    })
    .reduce((sum, p) => sum + p.amount, 0);

  const generateCalendar = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const allPaymentDates = [...payments, upcomingPayment].map((p) => p.date);

    const calendar = [];
    let dayCounter = 1;

    for (let week = 0; week < 6; week++) {
      const weekDays = [];
      for (let day = 0; day < 7; day++) {
        if ((week === 0 && day < startingDayOfWeek) || dayCounter > daysInMonth) {
          weekDays.push(null);
        } else {
          weekDays.push(dayCounter);
          dayCounter++;
        }
      }
      calendar.push(weekDays);
      if (dayCounter > daysInMonth) break;
    }

    return { calendar, allPaymentDates, currentMonth, currentYear };
  };

  const { calendar, allPaymentDates, currentMonth, currentYear } = generateCalendar();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const isPaymentDate = (day) => {
    if (!day) return false;
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return allPaymentDates.includes(dateStr);
  };

  const isDueDate = (day) => {
    if (!day || !upcomingPayment) return false;
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return upcomingPayment.date === dateStr;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={handleLogout} />

      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-600 mb-6">
          💳 Payment Tracker
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">Total Paid This Year</p>
                <h2 className="text-3xl md:text-4xl font-bold">${totalPaidThisYear.toLocaleString()}</h2>
              </div>
              <div className="text-5xl">💰</div>
            </div>
          </div>

          {upcomingPayment && (
            <div className="bg-white shadow-lg rounded-xl p-6 lg:col-span-2 border-l-4 border-yellow-400">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    📅 Upcoming Payment
                  </h3>
                  <p className="text-gray-600 mb-1">
                    <span className="font-semibold">Due Date:</span>{" "}
                    {new Date(upcomingPayment.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-2xl font-bold text-gray-800">
                    ${upcomingPayment.amount.toLocaleString()}
                  </p>
                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(
                      upcomingPayment.status
                    )}`}
                  >
                    {upcomingPayment.status}
                  </span>
                </div>
                <button
                  onClick={markAsPaid}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition shadow-md whitespace-nowrap"
                >
                  ✓ Mark as Paid
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white shadow-lg rounded-xl p-4 md:p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              📜 Payment History
            </h2>

            {payments.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                No payment history available.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-left text-gray-700">
                      <th className="p-2 md:p-3 border text-sm md:text-base">Date</th>
                      <th className="p-2 md:p-3 border text-sm md:text-base">Amount</th>
                      <th className="p-2 md:p-3 border text-sm md:text-base">Status</th>
                      <th className="p-2 md:p-3 border text-sm md:text-base">Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="p-2 md:p-3 border text-gray-700 text-sm md:text-base">
                          {new Date(payment.date).toLocaleDateString()}
                        </td>
                        <td className="p-2 md:p-3 border font-semibold text-gray-800 text-sm md:text-base">
                          ${payment.amount.toLocaleString()}
                        </td>
                        <td className="p-2 md:p-3 border">
                          <span
                            className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold border ${getStatusColor(
                              payment.status
                            )}`}
                          >
                            {payment.status}
                          </span>
                        </td>
                        <td className="p-2 md:p-3 border text-gray-600 text-sm md:text-base">
                          {payment.method}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white shadow-lg rounded-xl p-4 md:p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              📆 Payment Calendar
            </h2>
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                {monthNames[currentMonth]} {currentYear}
              </h3>
            </div>
            <div className="grid grid-cols-7 gap-1 md:gap-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs md:text-sm font-semibold text-gray-600 p-1"
                >
                  {day}
                </div>
              ))}
              {calendar.map((week, weekIndex) =>
                week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`
                      aspect-square flex items-center justify-center text-xs md:text-sm rounded-lg
                      ${!day ? "bg-transparent" : "bg-gray-50 hover:bg-gray-100"}
                      ${isPaymentDate(day) && !isDueDate(day) ? "bg-green-100 font-bold text-green-700" : ""}
                      ${isDueDate(day) ? "bg-yellow-200 font-bold text-yellow-800 ring-2 ring-yellow-400" : ""}
                    `}
                  >
                    {day || ""}
                  </div>
                ))
              )}
            </div>
            <div className="mt-4 space-y-2 text-xs md:text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                <span className="text-gray-600">Past Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-200 border border-yellow-400 rounded"></div>
                <span className="text-gray-600">Due Date</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentTracker;
