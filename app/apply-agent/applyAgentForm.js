// app/apply-agent/applyAgentForm.js
"use client";

import { useState, useContext } from "react";
import { AuthContext } from "../context/authContext";
import { agentAPI } from "../_lib/api";

const ApplyAgentForm = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    agency: "",
    specialization: "residential",
    bio: "",
    phone: "+234",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const validateForm = () => {
    const newErrors = {};

    // Agency validation
    if (!formData.agency.trim()) {
      newErrors.agency = "Agency name is required";
    } else if (formData.agency.length < 2) {
      newErrors.agency = "Agency name is too short";
    }

    // Phone validation
    if (!formData.phone.startsWith("+234")) {
      newErrors.phone = "Phone number must start with +234";
    } else if (formData.phone.length !== 14) {
      newErrors.phone =
        "Phone number must be 14 characters (e.g., +2348101399029)";
    }

    // Bio validation
    if (!formData.bio.trim()) {
      newErrors.bio = "Bio is required";
    } else if (formData.bio.length < 50) {
      newErrors.bio =
        "Please provide at least 50 characters about your experience";
    } else if (formData.bio.length > 500) {
      newErrors.bio = "Bio must be less than 500 characters";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    const phone = "+234" + value;
    setFormData((prev) => ({
      ...prev,
      phone: phone.length > 14 ? prev.phone : phone,
    }));
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");

    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await agentAPI.applyForAgent({
        agency: formData.agency.trim(),
        specialization: formData.specialization,
        bio: formData.bio.trim(),
        phone: formData.phone,
      });

      // Update user context with new agentStatus
      if (updateUser && response.data?.user) {
        updateUser(response.data.user);
      }

      setSuccess(
        "Application submitted successfully! Our team will review it within 24-48 hours."
      );

      // Reset form on success
      setFormData({
        agency: "",
        specialization: "residential",
        bio: "",
        phone: "+234",
      });

      // Auto-scroll to success message
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.error("Application error:", error);
      setErrors({
        submit:
          error.message || "Failed to submit application. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const phoneDigits = formData.phone.replace("+234", "");

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center">
            <div className="shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center">
            <div className="shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">
                {errors.submit}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Agency Field */}
      <div>
        <label
          htmlFor="agency"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Agency Name *
        </label>
        <div className="relative">
          <input
            id="agency"
            name="agency"
            type="text"
            value={formData.agency}
            onChange={handleChange}
            className={`block w-full px-4 py-3 border ${
              errors.agency
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            } rounded-lg shadow-sm focus:ring-2 focus:ring-opacity-50 transition-all duration-200`}
            placeholder="Enter your agency name"
            disabled={loading}
          />
          {errors.agency && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>
        {errors.agency && (
          <p className="mt-1 text-sm text-red-600">{errors.agency}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          If independent, enter "Independent" or your trading name
        </p>
      </div>

      {/* Phone Field */}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Phone Number *
        </label>
        <div className="relative">
          <div className="flex rounded-lg shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              +234
            </span>
            <input
              id="phone"
              type="text"
              value={phoneDigits}
              onChange={handlePhoneChange}
              className={`flex-1 min-w-0 block w-full px-3 py-3 border ${
                errors.phone
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              } rounded-r-lg focus:ring-2 focus:ring-opacity-50 transition-all duration-200`}
              placeholder="8101399029"
              maxLength="10"
              disabled={loading}
            />
          </div>
          {errors.phone && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Format: +234 followed by 10 digits (e.g., +2348101399029)
        </p>
      </div>

      {/* Specialization Field */}
      <div>
        <label
          htmlFor="specialization"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Specialization
        </label>
        <select
          id="specialization"
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-opacity-50 transition-all duration-200 bg-white"
          disabled={loading}
        >
          <option value="residential">Residential Properties</option>
          <option value="commercial">Commercial Properties</option>
          <option value="land">Land & Development</option>
          <option value="luxury">Luxury Real Estate</option>
          <option value="rental">Rental Properties</option>
        </select>
      </div>

      {/* Bio Field */}
      <div>
        <label
          htmlFor="bio"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Professional Bio / Experience *
        </label>
        <div className="relative">
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={5}
            className={`block w-full px-4 py-3 border ${
              errors.bio
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            } rounded-lg shadow-sm focus:ring-2 focus:ring-opacity-50 transition-all duration-200`}
            placeholder="Tell us about your real estate experience, achievements, and why you want to join our platform..."
            disabled={loading}
          />
          <div className="absolute bottom-3 right-3 flex items-center space-x-2">
            <span
              className={`text-xs ${
                formData.bio.length > 500 ? "text-red-500" : "text-gray-400"
              }`}
            >
              {formData.bio.length}/500
            </span>
          </div>
        </div>
        {errors.bio && (
          <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Include years of experience, areas of expertise, and notable
          achievements
        </p>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Submitting Application...
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Submit Application
            </>
          )}
        </button>
        <p className="mt-3 text-center text-xs text-gray-500">
          By submitting, you agree to our Agent Terms and confirm the
          information provided is accurate.
        </p>
      </div>
    </form>
  );
};

export default ApplyAgentForm;
