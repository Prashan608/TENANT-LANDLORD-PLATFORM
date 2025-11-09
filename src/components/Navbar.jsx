import Notification from "./Notification";

const Navbar = ({ user, onLogout, title = "Tenant Portal" }) => {
  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-600">🏠 {title}</h1>

      <div className="flex items-center gap-4">
        <Notification />
        <p className="text-gray-700 font-medium">
          Welcome, <span className="text-blue-600">{user.name}</span>
        </p>
        <button
          onClick={onLogout}
          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
