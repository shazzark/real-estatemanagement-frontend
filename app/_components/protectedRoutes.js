"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children, role = null }) {
  const { isAuthenticated, loading, canAccess } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }

    if (!loading && isAuthenticated && role && !canAccess(role)) {
      router.replace("/");
    }
  }, [loading, isAuthenticated, role, router, canAccess]);

  if (loading || !isAuthenticated) {
    return null; // or loading spinner
  }

  return children;
}
