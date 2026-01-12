"use client";

import { useState } from "react";
import { Button } from "../_components/_ui/button";
import { Card } from "../_components/_ui/card";
import BookingSuccessModal from "./bookingSuccesfullModal";
import Loading from "../_components/_ui/loadingIndicator";
import ErrorMessage from "../_components/_ui/errorMessage";
import { fetchAPI } from "../_lib/api"; // ✅ Add this import

export default function BookingForm({ propertyId }) {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    type: "In-Person",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const addOneHour = (time) => {
    const [h, m] = time.split(":").map(Number);
    return `${String((h + 1) % 24).padStart(2, "0")}:${String(m).padStart(
      2,
      "0"
    )}`;
  };

  const handleSubmit = async () => {
    if (!formData.date || !formData.time) {
      setError("Date and time are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // ✅ Use fetchAPI instead of direct fetch
      const data = await fetchAPI("/bookings", {
        method: "POST",
        body: JSON.stringify({
          property: propertyId || null,
          date: formData.date,
          timeSlot: { start: formData.time, end: addOneHour(formData.time) },
          type: formData.type,
        }),
      });

      setSuccess(true);
    } catch (err) {
      setError(err.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="max-w-md mx-auto p-6 rounded-2xl shadow-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Schedule a Tour</h2>

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, date: e.target.value }))
          }
          className="w-full mb-3 px-3 py-2 border rounded-md"
        />
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, time: e.target.value }))
          }
          className="w-full mb-3 px-3 py-2 border rounded-md"
        />
        <select
          name="type"
          value={formData.type}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, type: e.target.value }))
          }
          className="w-full mb-3 px-3 py-2 border rounded-md"
        >
          <option value="In-Person">In-Person</option>
          <option value="Virtual">Virtual</option>
        </select>

        {/* Error Message */}
        {error && <ErrorMessage message={error} className="mb-3" />}

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          className="w-full py-3 rounded-full bg-primary text-primary-foreground font-semibold"
          disabled={loading}
        >
          {loading ? <Loading size={20} /> : "Confirm Booking"}
        </Button>
      </Card>

      {/* Success Modal */}
      <BookingSuccessModal isOpen={success} onClose={() => setSuccess(false)} />
    </>
  );
}
