"use client";

import { useState } from "react";
import Sidebar from "../dashboard/components/sidebars";
import DashboardSection from "../dashboard/components/dashboardSection";
import BookingsSection from "../dashboard/components/BookingsSection";
import SettingsSection from "../dashboard/components/SettingsSection";
import WishlistSection from "../dashboard/components/wishlistSection";
import PurchasesSection from "../dashboard/components/purchaseSection";
import NotificationButton from "../_components/_ui/notificationIcon";
import RentalsSection from "./components/rentalSection";

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardSection />;
      case "purchases":
        return <PurchasesSection />;
      case "wishlist":
        return <WishlistSection />;
      case "rentals":
        return <RentalsSection />;
      case "bookings":
        return <BookingsSection />;
      case "settings":
        return <SettingsSection />;
      default:
        return <DashboardSection />;
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar - Use your original Sidebar component */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between bg-card p-4 border-b border-border">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-secondary transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-lg font-semibold">
            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
          </h1>
          <NotificationButton />
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Desktop Header */}
            <div className="hidden lg:flex items-start justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  {activeSection.charAt(0).toUpperCase() +
                    activeSection.slice(1)}
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  {activeSection === "dashboard" &&
                    "Overview of your real estate activities"}
                  {activeSection === "purchases" &&
                    "Track and manage your property purchases"}
                  {activeSection === "wishlist" && "View your saved properties"}
                  {activeSection === "rentals" &&
                    "Manage your rental properties"}
                  {activeSection === "bookings" &&
                    "Track your property bookings"}
                  {activeSection === "settings" &&
                    "Account and application settings"}
                </p>
              </div>
              <NotificationButton />
            </div>

            {/* Content Section - REMOVE the extra white background wrapper */}
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
}
