"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { fetchAPI } from "../_lib/api";
import PayNowButton from "../_components/_ui/paynowButton"; // Add this import
import { useAuth } from "../hooks/useAuth"; // Add this import

export default function BookingCard({ booking, refresh }) {
  const [loadingAction, setLoadingAction] = useState("");
  const { user } = useAuth(); // Get user from auth

  const handleAction = async (action) => {
    try {
      setLoadingAction(action);
      await fetchAPI(`/bookings/${booking._id}/${action}`, { method: "PATCH" });
      toast.success(`Booking ${action}ed successfully`);
      refresh();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingAction("");
    }
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    agent_confirmed: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    cancelled: "bg-gray-100 text-gray-700",
    completed: "bg-blue-100 text-blue-700",
    payment_pending: "bg-orange-100 text-orange-700", // Add this
    paid: "bg-purple-100 text-purple-700", // Add this
  };

  return (
    <div className="p-4 border rounded mb-3 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      {/* Booking Info */}
      <div className="flex-1">
        <h3 className="font-semibold">
          {booking.property?.title || "Property"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {booking.bookingType === "viewing" &&
            `${new Date(booking.date).toDateString()} • ${
              booking.timeSlot?.start
            } - ${booking.timeSlot?.end}`}
          {booking.bookingType === "rental" &&
            `Rental inquiry${booking.message ? ` — ${booking.message}` : ""}`}
          {booking.bookingType === "purchase" &&
            `Purchase intent • ₦${booking.price?.toLocaleString()}`}
        </p>
        <p className="text-sm">Client: {booking.user?.name || "N/A"}</p>

        {/* Show payment status for purchases */}
        {booking.bookingType === "purchase" && booking.paymentStatus && (
          <p className="text-sm mt-1">
            Payment:{" "}
            <span className="font-medium">{booking.paymentStatus}</span>
          </p>
        )}
      </div>

      {/* Status & Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3">
        <span
          className={`px-3 py-1 text-xs rounded-full ${
            statusColors[booking.status] || "bg-gray-100 text-gray-700"
          }`}
        >
          {booking.status.replace("_", " ")}
        </span>

        {/* User's Pay Now Button */}
        {user?.role === "user" &&
          booking.bookingType === "purchase" &&
          booking.status === "agent_confirmed" &&
          booking.paymentStatus !== "paid" && (
            <div className="mt-2 md:mt-0">
              <PayNowButton
                booking={booking}
                userEmail={user.email}
                refresh={refresh}
              />
            </div>
          )}

        {/* Confirm / Reject / Payment buttons (Agent) */}
        {booking.status === "pending" && (
          <>
            <button
              onClick={() => handleAction("confirm")}
              disabled={loadingAction === "confirm"}
              className={`px-3 py-1 text-white rounded ${
                loadingAction === "confirm"
                  ? "bg-green-300 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {loadingAction === "confirm" ? "Confirming..." : "Confirm"}
            </button>

            <button
              onClick={() => handleAction("reject")}
              disabled={loadingAction === "reject"}
              className={`px-3 py-1 text-white rounded ${
                loadingAction === "reject"
                  ? "bg-red-300 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {loadingAction === "reject" ? "Rejecting..." : "Reject"}
            </button>
          </>
        )}

        {booking.bookingType === "purchase" &&
          booking.status === "agent_confirmed" &&
          booking.paymentStatus !== "paid" && (
            <button
              onClick={() => handleAction("confirm-payment")}
              disabled={loadingAction === "confirm-payment"}
              className={`px-3 py-1 text-white rounded ${
                loadingAction === "confirm-payment"
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {loadingAction === "confirm-payment"
                ? "Confirming..."
                : "Confirm Payment"}
            </button>
          )}
      </div>
    </div>
  );
}
