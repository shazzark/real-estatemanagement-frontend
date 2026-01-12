"use client";
import { useState } from "react";
import PaystackButton from "../_ui/paystackButton";

export default function PayNowButton({ booking, userEmail }) {
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(false);

  const startPayment = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/payments/initialize/${booking._id}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.status === "success") {
        // setPaymentData({
        //   reference: `ESTATE_${booking._id}_${Math.random()
        //     .toString(36)
        //     .substring(2, 8)}`,
        //   authorizationUrl: data.authorizationUrl,
        // });
        setPaymentData({
          reference: data.reference, // <- use this from backend
          authorizationUrl: data.authorizationUrl,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return paymentData ? (
    <PaystackButton
      email={userEmail}
      amount={booking.price}
      reference={paymentData.reference}
    />
  ) : (
    <button
      onClick={startPayment}
      disabled={loading}
      className="px-3 py-1 text-sm bg-green-500 text-white rounded-md"
    >
      {loading ? "Initializing..." : "Pay Now"}
    </button>
  );
}
