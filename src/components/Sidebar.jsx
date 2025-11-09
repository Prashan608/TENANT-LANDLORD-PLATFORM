import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Wrench, DollarSign, MessageSquare, User, Clock, Menu, X } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/tenant", icon: <Home size={20} /> },
    { name: "Maintenance", path: "/maintenance-form", icon: <Wrench size={20} /> },
    { name: "History", path: "/maintenance-history", icon: <Clock size={20} /> },
    { name: "Payments", path: "/payment-tracker", icon: <DollarSign size={20} /> },
    { name: "Messages", path: "/messages", icon: <MessageSquare size={20} /> },
    { name: "Profile", path: "/profile", icon: <User size={20} /> },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-20 left-4 z-50 bg-blue-600 text-white p-2 rounded-md shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`bg-white shadow-lg w-64 h-full p-5 fixed md:static z-40 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <h2 className="text-xl font-semibold mb-6 text-gray-700">Menu</h2>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-md font-medium transition ${
                  location.pathname === item.path
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
        />
      )}
    </>
  );
};

export default Sidebar;
