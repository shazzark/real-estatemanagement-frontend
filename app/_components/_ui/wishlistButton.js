"use client";
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { fetchAPI } from "../../_lib/api";
import { useAuth } from "../../hooks/useAuth";

export default function WishlistButton({ propertyId }) {
  const { isAuthenticated, user } = useAuth();
  const [inWishlist, setInWishlist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    if (!propertyId || !isAuthenticated) {
      setLoading(false);
      return;
    }

    async function fetchWishlistStatus() {
      try {
        setLoading(true);
        const data = await fetchAPI(`/wishlist/check/${propertyId}`);
        setInWishlist(!!data.data?.inWishlist);
      } catch (err) {
        console.error("Wishlist check error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchWishlistStatus();
  }, [propertyId, isAuthenticated]); // Re-run when auth changes

  // Don't show button if not logged in
  if (!isAuthenticated) return null;

  const handleToggleWishlist = async () => {
    if (!isLoggedIn) {
      toast.error("Please log in to use wishlist");
      return;
    }

    try {
      const data = await fetchAPI("/wishlist/toggle", {
        Credentials: "include",
        method: "POST",
        body: JSON.stringify({ property: propertyId }),
      });

      setInWishlist(data.data?.wishlist?.isActive || false);
      toast.success(data.message || "Wishlist updated");
    } catch (err) {
      if (err.status === 401) {
        toast.error("Please log in again");
        setIsLoggedIn(false);
      } else {
        toast.error(err.message || "Something went wrong");
      }
    }
  };

  // Don't show button if not logged in
  if (!isLoggedIn) return null;

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleToggleWishlist}
        disabled={loading}
        className={`p-2 rounded-full transition-colors ${
          inWishlist
            ? "text-red-500 bg-red-50 hover:bg-red-100"
            : "text-muted-foreground hover:text-gray-700 hover:bg-gray-100"
        }`}
      >
        <motion.div
          animate={{ scale: inWishlist ? 1.3 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {loading ? (
            <div className="h-6 w-6 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin" />
          ) : (
            <Heart className={`h-6 w-6 ${inWishlist ? "fill-red-500" : ""}`} />
          )}
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs font-medium px-3 py-1 rounded-lg shadow-lg whitespace-nowrap z-50 pointer-events-auto"
          >
            <Link
              href="/dashboard?section=wishlist"
              className="block hover:text-red-200 transition-colors"
            >
              {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
