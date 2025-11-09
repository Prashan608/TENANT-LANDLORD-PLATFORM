import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MaintenanceForm = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!user || user.role !== "tenant") {
    navigate("/");
    return null;
  }

  const [formData, setFormData] = useState({
    category: "",
    urgency: "",
    description: "",
    image: null,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.category || !formData.urgency || !formData.description) {
      alert("⚠️ Please fill all required fields!");
      return;
    }

    console.log("Submitted Maintenance Request:", formData);
    setSubmitted(true);

    // Reset after submission
    setFormData({
      category: "",
      urgency: "",
      description: "",
      image: null,
    });

    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-2xl p-8">
        <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">
          🧰 Submit Maintenance Request
        </h1>

        {submitted && (
          <p className="text-green-600 text-center font-medium mb-4">
            ✅ Request Submitted Successfully!
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Category */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Issue Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              <option value="Plumbing">🚿 Plumbing</option>
              <option value="Electrical">⚡ Electrical</option>
              <option value="General">🧹 General</option>
              <option value="Appliance">🔧 Appliance</option>
              <option value="Other">📝 Other</option>
            </select>
          </div>

          {/* Urgency */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Urgency Level <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              {["Low", "Medium", "High"].map((level) => (
                <label key={level} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="urgency"
                    value={level}
                    checked={formData.urgency === level}
                    onChange={handleChange}
                  />
                  {level}
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the issue..."
              rows={4}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Attach Image / Video (optional)
            </label>
            <input
              type="file"
              name="image"
              accept="image/*,video/*"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default MaintenanceForm;
