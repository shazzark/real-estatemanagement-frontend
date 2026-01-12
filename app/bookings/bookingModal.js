import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "../_components/_ui/button";
import { Card } from "../_components/_ui/card";
import BookingSuccessModal from "./bookingSuccesfullModal";
import { fetchAPI } from "../_lib/api"; // ✅ Add this import

export default function BookingModal({ propertyId, isOpen, onClose }) {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    type: "In-Person",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);

  const addOneHour = (time) => {
    const [h, m] = time.split(":").map(Number);
    const newHour = (h + 1) % 24;
    return `${String(newHour).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
          property: propertyId,
          date: formData.date,
          timeSlot: { start: formData.time, end: addOneHour(formData.time) },
          type: formData.type,
        }),
      });

      // ✅ Instead of onSuccess(), open success modal
      setSuccessOpen(true);
    } catch (err) {
      setError(err.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <Card className="w-full max-w-md p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground"
          >
            <X size={20} />
          </button>

          <h2 className="text-xl font-semibold mb-4">Schedule a Tour</h2>

          <div className="space-y-3">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="In-Person">In-Person</option>
              <option value="Virtual">Virtual</option>
            </select>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button
              onClick={handleSubmit}
              className="w-full"
              disabled={loading}
            >
              {loading ? "Booking..." : "Confirm Booking"}
            </Button>
          </div>
        </Card>
      </div>

      {/* Success Modal */}
      <BookingSuccessModal
        isOpen={successOpen}
        onClose={() => setSuccessOpen(false)}
      />
    </>
  );
}
