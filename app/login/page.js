"use client";

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../_components/_ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../_components/_ui/card";
import { Input } from "../_components/_ui/input";
import { Label } from "../_components/_ui/label";
import { useAuth } from "../hooks/useAuth"; // Import the custom hook

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear form error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const validationErrors = validateForm();

  //   if (Object.keys(validationErrors).length > 0) {
  //     setFormErrors(validationErrors);
  //     // Show error toast for validation errors
  //     toast.error("Please fill in all required fields correctly");
  //     return;
  //   }

  //   setFormErrors({});

  //   try {
  //     const credentials = {
  //       email: formData.email,
  //       password: formData.password,
  //     };

  //     console.log("Attempting login with:", credentials.email);

  //     // Show loading toast
  //     const loadingToast = toast.loading("Logging in...");

  //     const response = await login(credentials);

  //     // Dismiss loading toast
  //     toast.dismiss(loadingToast);

  //     console.log("Login successful:", response);

  //     // Show success toast
  //     toast.success("Login successful! Redirecting...");

  //     // Store user data in localStorage if needed
  //     if (response.data?.user) {
  //       localStorage.setItem("user", JSON.stringify(response.data.user));
  //     }

  //     // Redirect to dashboard after a short delay
  //     setTimeout(() => {
  //       router.push("/");
  //     }, 1500);
  //   } catch (error) {
  //     console.error("Login error:", error);

  //     let errorMessage = "Login failed. Please try again.";

  //     if (error.name === "APIError") {
  //       if (error.status === 401) {
  //         errorMessage = "Invalid email or password";
  //       } else if (error.status === 400) {
  //         errorMessage = "Please check your email and password";
  //       } else if (error.status === 0) {
  //         errorMessage =
  //           "Cannot connect to server. Please check your connection.";
  //       } else {
  //         errorMessage = error.message || "Login failed";
  //       }
  //     }

  //     // Show error toast
  //     toast.error(errorMessage);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🔄 [LoginPage] 1. Form submitted");

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      console.log("❌ [LoginPage] 2. Validation failed");
      setFormErrors(validationErrors);
      toast.error("Please fill in all required fields correctly");
      return;
    }

    console.log("✅ [LoginPage] 2. Validation passed");
    setFormErrors({});

    try {
      const credentials = {
        email: formData.email,
        password: formData.password,
      };

      console.log("🔄 [LoginPage] 3. Calling login() with:", credentials.email);

      // Show loading toast
      const loadingToast = toast.loading("Logging in...");

      console.log("🚨 [LoginPage] 4. ABOUT TO CALL: await login(credentials)");

      const response = await login(credentials);

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      console.log("✅ [LoginPage] 5. login() returned:", response);

      // Show success toast
      toast.success("Login successful! Redirecting...");

      // Store user data in localStorage if needed
      if (response.data?.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      console.log("🔄 [LoginPage] 6. Starting redirect timer...");

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        console.log("🔄 [LoginPage] 7. Executing router.push('/')");
        router.push("/");
      }, 1500);
    } catch (error) {
      console.log("❌ [LoginPage] ERROR caught in handleSubmit:", error);

      let errorMessage = "Login failed. Please try again.";

      if (error.name === "APIError") {
        if (error.status === 401) {
          errorMessage = "Invalid email or password";
        } else if (error.status === 400) {
          errorMessage = "Please check your email and password";
        } else if (error.status === 0) {
          errorMessage =
            "Cannot connect to server. Please check your connection.";
        } else {
          errorMessage = error.message || "Login failed";
        }
      }

      // Show error toast
      toast.error(errorMessage);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-1 group">
            <span className="text-3xl font-serif font-bold text-foreground transition-colors group-hover:text-primary">
              Luxe
            </span>
            <span className="text-3xl font-serif font-bold text-primary">
              Estates
            </span>
          </Link>
          <p className="text-muted-foreground mt-2 font-sans">
            Enter your credentials to access your account
          </p>
        </div>

        <Card className="border-border shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-serif text-center">
              Login
            </CardTitle>
            <CardDescription className="text-center">
              Welcome back to Luxe Estates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className={`pl-10 focus-visible:ring-primary ${
                      formErrors.email ? "border-destructive" : ""
                    }`}
                    required
                    disabled={authLoading}
                  />
                </div>
                {formErrors.email && (
                  <p className="text-xs text-destructive mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-primary hover:underline transition-all font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`pl-10 focus-visible:ring-primary ${
                      formErrors.password ? "border-destructive" : ""
                    }`}
                    required
                    disabled={authLoading}
                  />
                </div>
                {formErrors.password && (
                  <p className="text-xs text-destructive mt-1">
                    {formErrors.password}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={authLoading}
              >
                {authLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    Login
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 border-t border-border pt-6">
            <div className="text-sm text-center text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-primary hover:underline font-medium transition-all"
              >
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>

        <p className="mt-8 text-center text-xs text-muted-foreground font-sans">
          &copy; {new Date().getFullYear()} Luxe Estates. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
