"use client";

import { motion } from "framer-motion";

export default function LoadingIndicator({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full py-8">
      {/* Spinner */}
      <motion.div
        className="w-12 h-12 border-4 border-t-primary border-gray-200 rounded-full mb-4"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
      {/* Text */}
      <p className="text-muted-foreground text-lg">{message}</p>
    </div>
  );
}
