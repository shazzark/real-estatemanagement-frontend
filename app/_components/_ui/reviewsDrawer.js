"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { StarRating } from "./starRating";
import { useState } from "react";
import { Button } from "../_ui/button";

export default function ReviewsDrawer({
  open,
  onClose,
  propertyId,
  reviews = [],
  averageRating = 0,
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const variants = {
    hidden: {
      y: isMobile ? "100%" : 0,
      x: isMobile ? 0 : "100%",
    },
    visible: {
      y: 0,
      x: 0,
    },
  };

  const submitReview = async () => {
    if (!rating) return;
    setLoading(true);

    // backend hookup later
    console.log({ rating, comment, propertyId });

    setLoading(false);
    setRating(0);
    setComment("");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Drawer */}
          <motion.div
            className="fixed z-50 bg-background w-full md:w-105 h-[85vh] md:h-full bottom-0 md:right-0 rounded-t-2xl md:rounded-none p-6 overflow-y-auto"
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Reviews</h2>
              <button onClick={onClose}>
                <X />
              </button>
            </div>

            {/* Rating summary */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold">
                  {averageRating.toFixed(1)}
                </span>
                <StarRating value={Math.round(averageRating)} readOnly />
              </div>
              <p className="text-sm text-muted-foreground">
                Based on {reviews.length} reviews
              </p>
            </div>

            {/* Write review */}
            <div className="mb-8">
              <h3 className="font-medium mb-2">Write a review</h3>
              <StarRating value={rating} onChange={setRating} />
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                className="w-full mt-3 p-3 border rounded-md resize-none"
              />
              <Button
                onClick={submitReview}
                className="w-full mt-3"
                disabled={loading}
              >
                Submit Review
              </Button>
            </div>

            {/* Reviews list */}
            <div className="space-y-5">
              {reviews.map((r) => (
                <div key={r._id} className="border-b pb-4">
                  <StarRating value={r.rating} readOnly />
                  <p className="mt-2 text-sm">{r.comment}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {r.user?.name} • {new Date(r.createdAt).toDateString()}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
