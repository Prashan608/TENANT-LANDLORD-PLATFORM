import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "tenant",
    address: ""
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[-()\s]/g, ""))) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.some(user => user.email === formData.email);

    if (userExists) {
      setErrors({ email: "User with this email already exists" });
      return;
    }

    // Create new user
    const newUser = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: formData.role,
      address: formData.address,
      avatar: "",
      communicationPreferences: {
        email: true,
        sms: false
      },
      createdAt: new Date().toISOString()
    };

    // Add to users array
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // Show success message
    alert(`✅ Registration successful! Welcome ${formData.name}!`);

    // Redirect to login
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">
            🏠 Create Account
          </h1>
          <p className="text-gray-600">Join our Tenant-Landlord Portal</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              I am a *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="tenant"
                  checked={formData.role === "tenant"}
                  onChange={handleChange}
                  className="mr-2 w-4 h-4"
                />
                <span className="text-gray-700">Tenant</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="landlord"
                  checked={formData.role === "landlord"}
                  onChange={handleChange}
                  className="mr-2 w-4 h-4"
                />
                <span className="text-gray-700">Landlord</span>
              </label>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              className={`w-full border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Address *
            </label>
            <input
              type="text"
              name="address"
              placeholder="Enter your address"
              className={`w-full border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={formData.address}
              onChange={handleChange}
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          {/* Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Password *
              </label>
              <input
                type="password"
                name="password"
                placeholder="Create password"
                className={`w-full border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                className={`w-full border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 mt-6"
          >
            Create Account
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-6 text-gray-600 text-sm">
          <p>
            Already have an account?{" "}
            <Link to="/" className="text-blue-600 hover:underline font-medium">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
