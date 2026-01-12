"use client";

import Navbar from "../_components/navbar";
import BookingForm from "../bookings/bookingForm"; // your reusable form
import { motion } from "framer-motion";
import ProtectedRoute from "../_components/protectedRoutes";

export default function ScheduleTourPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground font-sans">
        <Navbar />

        {/* Hero Section */}
        <section className="relative h-[50vh] flex flex-col items-center justify-center bg-accent text-accent-foreground overflow-hidden">
          <motion.div className="z-10 text-center px-4" {...fadeInUp}>
            <h1 className="text-5xl md:text-6xl font-serif mb-4 uppercase tracking-tighter">
              Schedule a Tour
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90 font-light leading-relaxed">
              Select a date and time that works for you. Our agents will confirm
              your tour promptly.
            </p>
          </motion.div>
          <div className="absolute inset-0 opacity-20 bg-[url('/ornate-window-detail.png')] bg-cover bg-center" />
        </section>

        {/* Booking Form Section */}
        <main className="max-w-3xl mx-auto px-6 py-24">
          <motion.div {...fadeInUp}>
            <BookingForm />
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="py-12 border-t border-border mt-24">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-3xl font-serif tracking-tighter uppercase">
              Artifact.
            </div>
            <p className="text-muted-foreground text-sm tracking-widest uppercase">
              © 2025 Artifact Property Limited
            </p>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
}
