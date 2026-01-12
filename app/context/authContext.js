"use client";

import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "../_lib/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  // Fetch current user on app load
  useEffect(() => {
    const initAuth = async () => {
      try {
        const data = await authAPI.getCurrentUser();
        setUser(data.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // const login = async (credentials) => {
  //   const data = await authAPI.login(credentials);
  //   setUser(data.data.user);
  //   return data;
  // };
  const login = async (credentials) => {
    console.log("🔄 [AuthContext] 1. login() called with:", credentials.email);

    try {
      console.log("🔄 [AuthContext] 2. Calling authAPI.login()");
      const data = await authAPI.login(credentials);

      console.log("✅ [AuthContext] 3. authAPI.login() returned:", data);

      // VERIFY THE USER WITH /users/me
      console.log("🔄 [AuthContext] 4. Verifying with /users/me");
      const userData = await authAPI.getCurrentUser();
      console.log("✅ [AuthContext] 5. /users/me returned:", userData);

      setUser(userData.data.user);
      return data;
    } catch (error) {
      console.log("❌ [AuthContext] ERROR in login:", error);
      throw error;
    }
  };

  // Add the missing signup function
  const signup = async (payload) => {
    const data = await authAPI.signup(payload);
    setUser(data.data.user);
    return data;
  };

  const logout = () => {
    // 1. Optimistically update UI
    setUser(null);

    // 2. Redirect immediately
    router.push("/login");

    // 3. Fire-and-forget API call
    authAPI.logout().catch((err) => {
      console.error("Logout request failed:", err);
      // No rollback — user stays logged out
    });
  };

  // In your existing authContext.js, you could add this:
  const canAccess = (requiredRole = null) => {
    if (!user) return false;
    if (!requiredRole) return true;
    return user.role === requiredRole;
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    signup, // This was missing in your original code
    logout,
    canAccess,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
