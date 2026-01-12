"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import StarRating from "./starRating";
import { fetchAPI } from "../../_lib/api"; // ✅ Import your fetchAPI

export default function ReviewsPanel({ propertyId, isOpen, onClose }) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // ✅ Use fetchAPI instead of direct fetch
        const [reviewsData, statsData] = await Promise.all([
          fetchAPI(`/review?property=${propertyId}`),
          fetchAPI(`/review/stats/property/${propertyId}`),
        ]);

        setReviews(reviewsData.data?.reviews || []);
        setStats(statsData.data?.stats || null);
      } catch (err) {
        console.error("Failed to load reviews:", err);
        setError("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen, propertyId]);

  const submitReview = async () => {
    if (!rating || !comment) {
      setError("Rating and comment are required");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // ✅ Use fetchAPI instead of direct fetch
      const data = await fetchAPI("/review", {
        method: "POST",
        body: JSON.stringify({
          property: propertyId,
          rating,
          comment,
        }),
      });

      // Re-fetch reviews
      setRating(0);
      setComment("");
      setReviews((prev) => [data.data?.review, ...prev]);
    } catch (err) {
      console.error("Submit review error:", err);
      setError(err.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={isMobile ? { y: "100%" } : { x: "100%" }}
            animate={{ x: 0, y: 0 }}
            exit={isMobile ? { y: "100%" } : { x: "100%" }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
            className="fixed z-50 bg-background w-full md:w-105 h-[85vh] md:h-full bottom-0 right-0 rounded-t-3xl md:rounded-none p-6 overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground"
            >
              <X />
            </button>

            <h2 className="text-2xl font-semibold mb-2">Reviews</h2>

            {stats && (
              <div className="flex items-center gap-3 mb-6">
                <StarRating rating={Math.round(stats.averageRating)} readOnly />
                <span className="text-sm text-muted-foreground">
                  {stats.totalReviews} reviews
                </span>
              </div>
            )}

            {/* Review form */}
            <div className="border rounded-xl p-4 mb-6">
              <StarRating rating={rating} onChange={setRating} />
              <textarea
                className="w-full mt-3 border rounded-md p-2 text-sm"
                rows={3}
                placeholder="Share your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
              <button
                onClick={submitReview}
                disabled={submitting}
                className="mt-3 w-full bg-primary text-primary-foreground py-2 rounded-full"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>

            {/* Reviews list */}
            {loading ? (
              <p className="text-muted-foreground">Loading reviews…</p>
            ) : reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review._id}
                  className="border-b py-4 last:border-none"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{review.user?.name}</p>
                    <StarRating rating={review.rating} readOnly size={16} />
                  </div>
                  <p className="text-sm mt-2">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No reviews yet</p>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
