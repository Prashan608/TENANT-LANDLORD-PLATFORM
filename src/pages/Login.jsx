import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (email === "" || password === "") {
      setError("Please fill in all fields!");
      return;
    }

    // Get registered users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    
    // Find user with matching email and password
    const user = users.find(
      u => u.email === email && u.password === password
    );

    if (!user) {
      setError("Invalid email or password. Please try again or register.");
      return;
    }

    // Set logged in user
    const userData = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      phone: user.phone,
      address: user.address,
      avatar: user.avatar || "",
      communicationPreferences: user.communicationPreferences
    };

    localStorage.setItem("loggedInUser", JSON.stringify(userData));

    // Show welcome message
    alert(`Welcome back, ${user.name}! 👋`);

    // Redirect based on role
    if (userData.role === "landlord") {
      navigate("/landlord");
    } else {
      navigate("/tenant");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo / Title */}
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          🏠 Tenant-Landlord Portal
        </h1>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
        </form>

        {/* Extra Links */}
        <div className="text-center mt-6 text-gray-600 text-sm">
          <p>
            Forgot password?{" "}
            <span className="text-blue-600 hover:underline cursor-pointer">
              Reset
            </span>
          </p>
          <p className="mt-1">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline cursor-pointer">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
