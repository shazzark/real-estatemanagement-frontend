"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import dynamic from "next/dynamic";

// ✅ Dynamic import — Leaflet never runs on the server
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-muted-foreground">
      Loading map…
    </div>
  ),
});

export default function PropertyMapModal({ location, isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 flex justify-center items-end"
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 160, damping: 30 }}
            className="bg-white w-full md:w-2/3 lg:w-1/2 h-3/4 rounded-t-3xl shadow-xl relative overflow-hidden"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 text-gray-600 hover:text-gray-900"
            >
              <X size={24} />
            </button>

            {/* Map */}
            <LeafletMap location={location} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
