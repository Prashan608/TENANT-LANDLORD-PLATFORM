import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const MaintenanceForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    category: "",
    urgency: "",
    description: "",
    images: [],
  });
  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const raw = localStorage.getItem("loggedInUser");
  let user = null;
  try {
    user = raw ? JSON.parse(raw) : null;
  } catch {
    user = null;
  }

  const categories = [
    "Plumbing",
    "Electrical",
    "HVAC",
    "Appliances",
    "Structural",
    "Other",
  ];
  const urgencyLevels = [
    {
      value: "Low",
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
      textColor: "text-green-700",
      bgColor: "bg-green-100",
    },
    {
      value: "Medium",
      color: "bg-yellow-500",
      hoverColor: "hover:bg-yellow-600",
      textColor: "text-yellow-700",
      bgColor: "bg-yellow-100",
    },
    {
      value: "High",
      color: "bg-red-500",
      hoverColor: "hover:bg-red-600",
      textColor: "text-red-700",
      bgColor: "bg-red-100",
    },
  ];
  const commonIssues = [
    "Leaking faucet",
    "Broken heater",
    "No hot water",
    "AC not working",
    "Clogged drain",
    "Broken window",
    "Faulty wiring",
    "Door lock issue",
  ];

  const maxCharacters = 500;

  useEffect(() => {
    if (formData.description && formData.description.length > 0) {
      const matches = commonIssues.filter((issue) =>
        issue.toLowerCase().includes(formData.description.toLowerCase())
      );
      setFilteredSuggestions(matches);
      setShowSuggestions(matches.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [formData.description]);

  if (!user || user.role !== "tenant") {
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1 && !formData.category) {
      newErrors.category = "Please select a category";
    }
    if (currentStep === 2 && !formData.urgency) {
      newErrors.urgency = "Please select an urgency level";
    }
    if (currentStep === 3) {
      if (!formData.description.trim()) {
        newErrors.description = "Description is required";
      } else if (formData.description.length < 10) {
        newErrors.description = "Description must be at least 10 characters";
      } else if (formData.description.length > maxCharacters) {
        newErrors.description = `Description cannot exceed ${maxCharacters} characters`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleCategorySelect = (category) => {
    setFormData({ ...formData, category });
    setErrors({});
  };

  const handleUrgencySelect = (urgency) => {
    setFormData({ ...formData, urgency });
    setErrors({});
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxCharacters) {
      setFormData({ ...formData, description: value });
      setErrors({});
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setFormData({ ...formData, description: suggestion });
    setShowSuggestions(false);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length !== files.length) {
      alert("Only image files are allowed");
    }

    const readers = imageFiles.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((images) => {
      setFormData({
        ...formData,
        images: [...formData.images, ...images],
      });
    });
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = () => {
    if (!validateStep(3)) return;

    const newRequest = {
      id: Date.now(),
      category: formData.category,
      urgency: formData.urgency,
      description: formData.description,
      status: "Pending",
      date: new Date().toLocaleDateString(),
      images: formData.images,
    };

    const existingRequests =
      JSON.parse(localStorage.getItem("maintenanceRequests")) || [];
    localStorage.setItem(
      "maintenanceRequests",
      JSON.stringify([...existingRequests, newRequest])
    );

    navigate("/maintenance-history");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={handleLogout} />

      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white shadow-xl rounded-xl p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-6">
            🔧 Submit Maintenance Request
          </h1>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base ${
                      s <= step
                        ? "bg-blue-600 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {s}
                  </div>
                  {s < 4 && (
                    <div
                      className={`flex-1 h-1 mx-1 sm:mx-2 ${
                        s < step ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs sm:text-sm text-gray-600 mt-2">
              <span className="flex-1 text-center">Category</span>
              <span className="flex-1 text-center">Urgency</span>
              <span className="flex-1 text-center">Details</span>
              <span className="flex-1 text-center">Review</span>
            </div>
          </div>

          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Select Category</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className={`p-4 sm:p-6 rounded-lg border-2 transition-all hover:shadow-lg ${
                      formData.category === category
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-300 hover:border-blue-400"
                    }`}
                  >
                    <div className="text-2xl sm:text-3xl mb-2">
                      {category === "Plumbing" && "🚰"}
                      {category === "Electrical" && "⚡"}
                      {category === "HVAC" && "❄️"}
                      {category === "Appliances" && "🔌"}
                      {category === "Structural" && "🏗️"}
                      {category === "Other" && "🔧"}
                    </div>
                    <p className="font-semibold text-sm sm:text-base">
                      {category}
                    </p>
                  </button>
                ))}
              </div>
              {errors.category && (
                <p className="text-red-600 text-sm mt-2">{errors.category}</p>
              )}
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Select Urgency Level
              </h2>
              <div className="space-y-4">
                {urgencyLevels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => handleUrgencySelect(level.value)}
                    className={`w-full p-4 sm:p-6 rounded-lg border-2 transition-all hover:shadow-lg flex items-center justify-between ${
                      formData.urgency === level.value
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-4 h-4 rounded-full ${level.color}`}
                      ></div>
                      <span className="font-semibold text-base sm:text-lg">
                        {level.value}
                      </span>
                    </div>
                    {formData.urgency === level.value && (
                      <span className="text-blue-600 text-xl">✓</span>
                    )}
                  </button>
                ))}
              </div>
              {errors.urgency && (
                <p className="text-red-600 text-sm mt-2">{errors.urgency}</p>
              )}
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Describe the Issue</h2>
              <div className="relative">
                <textarea
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 200)
                  }
                  onFocus={() =>
                    formData.description && setShowSuggestions(true)
                  }
                  placeholder="Describe the maintenance issue in detail..."
                  className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 resize-none"
                  rows="6"
                />
                <div className="flex justify-between items-center mt-2 text-sm">
                  <span
                    className={
                      formData.description.length > maxCharacters
                        ? "text-red-600"
                        : "text-gray-600"
                    }
                  >
                    {formData.description.length} / {maxCharacters} characters
                  </span>
                </div>

                {showSuggestions && filteredSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border-2 border-blue-600 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                    <div className="p-2 text-xs text-gray-600 font-semibold">
                      Suggestions:
                    </div>
                    {filteredSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left p-3 hover:bg-blue-50 transition border-b last:border-b-0"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {errors.description && (
                <p className="text-red-600 text-sm mt-2">
                  {errors.description}
                </p>
              )}

              <div className="mt-6">
                <h3 className="font-semibold mb-3">Upload Images (Optional)</h3>
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                    dragActive
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-300 hover:border-blue-400"
                  }`}
                >
                  <div className="text-4xl mb-2">📷</div>
                  <p className="text-gray-600 mb-2">
                    Drag & drop images here, or click to select
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition"
                  >
                    Select Images
                  </label>
                </div>

                {formData.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border-2 border-gray-300"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Review Your Request
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6 space-y-4">
                <div>
                  <p className="text-gray-600 text-sm">Category</p>
                  <p className="font-semibold text-lg">{formData.category}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Urgency</p>
                  <p
                    className={`font-semibold text-lg inline-block px-3 py-1 rounded-full ${
                      urgencyLevels.find((l) => l.value === formData.urgency)
                        ?.bgColor
                    } ${
                      urgencyLevels.find((l) => l.value === formData.urgency)
                        ?.textColor
                    }`}
                  >
                    {formData.urgency}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Description</p>
                  <p className="text-gray-800">{formData.description}</p>
                </div>
                {formData.images.length > 0 && (
                  <div>
                    <p className="text-gray-600 text-sm mb-2">
                      Images ({formData.images.length})
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {formData.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg border-2 border-gray-300"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-between gap-4">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-semibold"
              >
                Back
              </button>
            )}
            {step < 4 ? (
              <button
                onClick={handleNext}
                className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold ${
                  step === 1 ? "ml-auto" : ""
                }`}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold ml-auto"
              >
                Submit Request
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceForm;
