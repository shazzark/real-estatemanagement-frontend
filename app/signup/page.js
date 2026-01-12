"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

export default function SignupPage() {
  const router = useRouter();
  const { signup, isLoading: authLoading } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phone: "",
    role: "user",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.passwordConfirm) {
      newErrors.passwordConfirm = "Please confirm your password";
    } else if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = "Passwords do not match";
    }

    // Optional phone validation
    if (formData.phone && !/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Show validation error toast
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setErrors({});

    try {
      // Prepare data for backend
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.passwordConfirm,
        phone: formData.phone || undefined,
        role: formData.role,
      };

      // Show loading toast
      const loadingToast = toast.loading("Creating your account...");

      const response = await signup(userData);

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Show success toast
      toast.success(
        "Account created successfully! Please check your email to verify your account.",
        {
          duration: 6000, // Longer duration for important message
          icon: "🎉",
        }
      );

      // Redirect to login page after a delay
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      console.error("Signup error:", error);

      let errorMessage = "Signup failed. Please try again.";

      if (error.name === "APIError") {
        if (error.status === 400) {
          // Validation errors from backend
          if (error.message.includes("email")) {
            setErrors({ email: error.message });
            errorMessage = "Please check your email address";
          } else if (error.message.includes("password")) {
            setErrors({ password: error.message });
            errorMessage = "Please check your password";
          } else {
            setErrors({ general: error.message });
            errorMessage = error.message;
          }
        } else if (error.status === 409) {
          setErrors({ email: "Email already exists" });
          errorMessage =
            "This email is already registered. Please use a different email or try logging in.";
        } else if (error.status === 500) {
          errorMessage = "Server error. Please try again later.";
        } else if (error.status === 0) {
          errorMessage =
            "Cannot connect to server. Please check your connection.";
        }
      }

      // Show error toast
      toast.error(errorMessage, {
        duration: 5000,
      });
    }
  };

  useEffect(() => setIsClient(true), []);

  if (!isClient) return null;

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
        aria-labelledby="signup-title"
      >
        <div className="rounded-2xl bg-white shadow-sm border border-neutral-200 p-6 sm:p-8">
          {/* Brand */}
          <div className="mb-6 text-center">
            <Link href="/" className="inline-flex items-center gap-1 group">
              <span className="text-3xl font-serif font-bold text-foreground transition-colors group-hover:text-primary">
                Luxe
              </span>
              <span className="text-3xl font-serif font-bold text-primary">
                Estates
              </span>
            </Link>
            <p className="mt-1 text-sm text-neutral-500">
              Create your account to manage properties efficiently
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-neutral-700"
              >
                Full Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={`mt-1 w-full rounded-lg border ${
                  errors.name ? "border-red-500" : "border-neutral-300"
                } bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10`}
                disabled={authLoading}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-700"
              >
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`mt-1 w-full rounded-lg border ${
                  errors.email ? "border-red-500" : "border-neutral-300"
                } bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10`}
                disabled={authLoading}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Phone (Optional) */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-neutral-700"
              >
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                className={`mt-1 w-full rounded-lg border ${
                  errors.phone ? "border-red-500" : "border-neutral-300"
                } bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10`}
                disabled={authLoading}
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-neutral-700"
              >
                Password *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`mt-1 w-full rounded-lg border ${
                  errors.password ? "border-red-500" : "border-neutral-300"
                } bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10`}
                disabled={authLoading}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="passwordConfirm"
                className="block text-sm font-medium text-neutral-700"
              >
                Confirm Password *
              </label>
              <input
                id="passwordConfirm"
                name="passwordConfirm"
                type="password"
                value={formData.passwordConfirm}
                onChange={handleChange}
                placeholder="••••••••"
                className={`mt-1 w-full rounded-lg border ${
                  errors.passwordConfirm
                    ? "border-red-500"
                    : "border-neutral-300"
                } bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10`}
                disabled={authLoading}
              />
              {errors.passwordConfirm && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.passwordConfirm}
                </p>
              )}
            </div>

            {/* CTA */}
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={authLoading}
              className="mt-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900/20 w-full h-11 bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {authLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
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
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-neutral-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary hover:underline font-medium transition-all"
            >
              Login
            </Link>
          </p>
        </div>
      </motion.section>
    </main>
  );
}
