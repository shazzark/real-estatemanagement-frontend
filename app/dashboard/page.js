"use client";

import ProtectedRoute from "../_components/protectedRoutes";
import DashboardContent from "./dashboardContent";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
