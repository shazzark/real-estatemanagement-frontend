"use client";

import { useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingAPI } from "../../_lib/bookings";
import { AuthContext } from "../../context/authContext";
import PayNowButton from "../../_components/_ui/paynowButton";

// Status styles for all possible booking states
const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700",
  agent_confirmed: "bg-indigo-100 text-indigo-700",
  payment_pending: "bg-blue-100 text-blue-700",
  paid: "bg-green-100 text-green-700",
  completed: "bg-gray-100 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
  rejected: "bg-red-200 text-red-800",
};

export default function BookingsSection() {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // ✅ FETCH BOOKINGS
  const {
    data: bookings = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: bookingAPI.getAll,
  });

  // ✅ CANCEL BOOKING
  // CORRECT - This expects TWO arguments
  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }) => bookingAPI.cancel(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });

  // ✅ CONFIRM BOOKING (AGENT/ADMIN)
  const confirmMutation = useMutation({
    mutationFn: bookingAPI.confirm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });

  // ✅ CONFIRM PAYMENT (AGENT)
  const confirmPaymentMutation = useMutation({
    mutationFn: bookingAPI.confirmPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });

  if (isLoading) {
    return <p className="text-muted-foreground">Loading bookings...</p>;
  }

  if (isError) {
    return <p className="text-red-600">Failed to load bookings</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Bookings</h2>

      {bookings.length === 0 && (
        <p className="text-muted-foreground">No bookings found.</p>
      )}

      <div className="space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="border border-border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            {/* Booking Info */}
            <div>
              <h3 className="font-medium">
                {booking.property?.title || "Property"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {new Date(booking.date).toDateString()} •{" "}
                {booking.timeSlot?.start} - {booking.timeSlot?.end}
              </p>
              <p className="text-sm">Client: {booking.user?.name || "N/A"}</p>

              {/* Booking Type Info */}
              {booking.bookingType === "purchase" && (
                <p className="text-sm mt-1">
                  Purchase Amount: ₦{booking.price?.toLocaleString()} • Payment
                  Status:{" "}
                  <span
                    className={`px-2 py-1 rounded-full ${
                      statusStyles[booking.paymentStatus] ||
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {booking.paymentStatus || "Not Paid"}
                  </span>
                </p>
              )}

              {booking.bookingType === "rental" && (
                <p className="text-sm text-muted-foreground">
                  Rental inquiry{booking.message ? ` — ${booking.message}` : ""}
                </p>
              )}

              {booking.bookingType === "viewing" && (
                <p className="text-sm text-muted-foreground mt-1">
                  Viewing scheduled
                </p>
              )}
            </div>

            {/* Status & Actions */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
              {/* Status Badge */}
              <span
                className={`px-3 py-1 text-xs rounded-full ${
                  statusStyles[booking.status]
                }`}
              >
                {booking.status}
              </span>

              {/* USER ACTIONS */}
              {user?.role === "user" && booking.status === "pending" && (
                <button
                  onClick={() => {
                    const bookingId = booking._id || booking.id;
                    if (!bookingId) {
                      console.error("No booking ID found!");
                      return;
                    }

                    cancelMutation.mutate({
                      id: bookingId,
                      reason: "User cancelled",
                    });
                  }}
                  className="px-3 py-1 text-sm border rounded-md hover:bg-secondary"
                >
                  Cancel
                </button>
              )}

              {/* AGENT/ACTION CONFIRM */}
              {(user?.role === "agent" || user?.role === "admin") &&
                booking.status === "pending" && (
                  <button
                    onClick={() => confirmMutation.mutate(booking._id)}
                    className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md"
                  >
                    Confirm
                  </button>
                )}

              {/* AGENT CONFIRM PAYMENT */}
              {booking.bookingType === "purchase" &&
                booking.status === "agent_confirmed" &&
                booking.paymentStatus === "pending" &&
                (user?.role === "agent" || user?.role === "admin") && (
                  <button
                    onClick={() => confirmPaymentMutation.mutate(booking._id)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md"
                  >
                    Confirm Payment
                  </button>
                )}

              {/* USER PAY NOW BUTTON */}
              {booking.bookingType === "purchase" &&
                booking.status === "agent_confirmed" &&
                booking.paymentStatus === "pending" &&
                user?.role === "user" && (
                  <PayNowButton booking={booking} userEmail={user.email} />
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
