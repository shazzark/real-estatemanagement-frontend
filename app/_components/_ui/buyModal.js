"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Button } from "../_ui/button";
import { fetchAPI } from "../../_lib/api";
import toast from "react-hot-toast";

export default function BuyModal({ open, onClose, property }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const submitPurchase = async () => {
    try {
      setLoading(true);
      setSuccess(false);

      await fetchAPI("/bookings", {
        method: "POST",
        body: JSON.stringify({
          property: property._id,
          bookingType: "purchase",
          message,
          price: property.price,
        }),
      });

      // Show success
      setSuccess(true);
      toast.success("Purchase intent submitted successfully!");

      // Close after delay
      setTimeout(() => {
        onClose();
        setMessage("");
        setSuccess(false);
      }, 2000);
    } catch (err) {
      console.error("Purchase intent failed", err);
      toast.error(`Failed to submit purchase intent: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="fixed z-50 bg-background w-full max-w-lg rounded-xl p-6 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" /> Buy Property
              </h2>
              <button onClick={onClose}>
                <X />
              </button>
            </div>

            {success ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Success!</h3>
                <p className="text-muted-foreground">
                  Your purchase intent has been submitted. An agent will contact
                  you shortly.
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  Submit your interest to purchase this property. An agent will
                  contact you.
                </p>

                <textarea
                  className="w-full p-3 border rounded-md resize-none mb-4"
                  placeholder="Optional message to the agent..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="3"
                />

                <Button
                  className="w-full"
                  disabled={loading}
                  onClick={submitPurchase}
                >
                  {loading ? "Submitting..." : "Submit Purchase Intent"}
                </Button>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
