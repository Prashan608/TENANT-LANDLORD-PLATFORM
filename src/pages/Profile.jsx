import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Profile = () => {
  const navigate = useNavigate();
  
  const raw = localStorage.getItem("loggedInUser");
  let user = null;
  try {
    user = raw ? JSON.parse(raw) : null;
  } catch {
    user = null;
  }

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    avatar: "",
    emailNotifications: true,
    smsNotifications: false,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        avatar: user.avatar || "",
        emailNotifications: user.emailNotifications ?? true,
        smsNotifications: user.smsNotifications ?? false,
      });
      setAvatarPreview(user.avatar || null);
    }
  }, []);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData({
      ...profileData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setProfileData({ ...profileData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    
    const updatedUser = {
      ...user,
      ...profileData,
    };

    localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("Password must be at least 6 characters!");
      return;
    }

    alert("Password updated successfully! (UI only - not actually changed)");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const mockTenantProperty = {
    address: "123 Main St, Apartment 4B",
    landlord: "John Smith",
    rentAmount: "$1,200/month",
    leaseEnd: "Dec 31, 2025",
  };

  const mockLandlordProperties = [
    { id: 1, address: "123 Main St, Unit 4B", tenant: "Alice Johnson", rent: "$1,200/month" },
    { id: 2, address: "456 Oak Ave, Suite 2A", tenant: "Bob Williams", rent: "$1,500/month" },
    { id: 3, address: "789 Pine Rd, House", tenant: "Vacant", rent: "$2,000/month" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar user={user} onLogout={handleLogout} />

      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>

          {showSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
              <span className="mr-2">✓</span>
              Profile updated successfully!
            </div>
          )}

          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 pb-6 border-b">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-4">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-6xl text-gray-400">👤</span>
                  )}
                </div>
                <label className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition text-sm">
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </label>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-800">{profileData.name}</h2>
                <p className="text-gray-600 mt-1">{profileData.email}</p>
                <div className="mt-3">
                  <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${
                    user.role === "tenant" 
                      ? "bg-blue-100 text-blue-700" 
                      : "bg-purple-100 text-purple-700"
                  }`}>
                    {user.role === "tenant" ? "🏘️ Tenant" : "🏢 Landlord"}
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveProfile}>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="(123) 456-7890"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="123 Main St, City, State"
                  />
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-4 mt-6">Communication Preferences</h3>
              <div className="space-y-3 mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={profileData.emailNotifications}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-gray-700">📧 Receive email notifications</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="smsNotifications"
                    checked={profileData.smsNotifications}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-gray-700">📱 Receive SMS notifications</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                💾 Save Changes
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {user.role === "tenant" ? "🏠 Current Property" : "🏢 Your Properties"}
            </h3>

            {user.role === "tenant" ? (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">Address:</span> {mockTenantProperty.address}
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">Landlord:</span> {mockTenantProperty.landlord}
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">Rent:</span> {mockTenantProperty.rentAmount}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Lease Ends:</span> {mockTenantProperty.leaseEnd}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-left text-gray-700">
                      <th className="p-3 border">#</th>
                      <th className="p-3 border">Address</th>
                      <th className="p-3 border">Tenant</th>
                      <th className="p-3 border">Rent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockLandlordProperties.map((property) => (
                      <tr key={property.id} className="border-b hover:bg-gray-50 transition">
                        <td className="p-3 border text-gray-700">{property.id}</td>
                        <td className="p-3 border">{property.address}</td>
                        <td className="p-3 border">
                          <span className={property.tenant === "Vacant" ? "text-red-600" : "text-gray-700"}>
                            {property.tenant}
                          </span>
                        </td>
                        <td className="p-3 border">{property.rent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">🔒 Change Password</h3>
            
            <form onSubmit={handlePasswordUpdate}>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirm new password"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-purple-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-purple-700 transition"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
