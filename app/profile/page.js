"use client";

import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Key, LogOut, ArrowLeft } from "lucide-react";
import Navbar from "../_components/navbar";

// import Navbar from "../components/Navbar"; // <-- Uncomment and import your Navbar here

export default function ProfilePage() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !user) {
    return <LoadingIndicator message="Loading profile..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Navbar />

      <motion.div
        className="flex items-center justify-center mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md border border-gray-200 relative"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 15 }}
        >
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="absolute top-4 left-4 flex items-center gap-1 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={20} /> Back
          </button>

          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2 justify-center">
            <User size={24} /> Profile
          </h2>

          {/* Name */}
          <div className="flex items-center gap-3 mb-4 p-4 bg-gray-50 rounded-md">
            <User size={20} className="text-gray-500" />
            <div>
              <p className="text-gray-500 text-sm">Name</p>
              <p className="text-gray-800 font-medium">{user.name || "N/A"}</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3 mb-4 p-4 bg-gray-50 rounded-md">
            <Mail size={20} className="text-gray-500" />
            <div>
              <p className="text-gray-500 text-sm">Email</p>
              <p className="text-gray-800 font-medium">{user.email || "N/A"}</p>
            </div>
          </div>

          {/* Role */}
          <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-md">
            <Key size={20} className="text-gray-500" />
            <div>
              <p className="text-gray-500 text-sm">Role</p>
              <p className="text-gray-800 font-medium">{user.role || "User"}</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium shadow-sm transition-all duration-200"
          >
            <LogOut size={18} /> Logout
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
