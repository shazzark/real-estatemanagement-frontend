"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-screen bg-linear-to-br from-background via-background to-secondary/10 flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: "url('/hero-luxury-home-exterior.jpg')",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl sm:text-6xl font-serif font-bold text-foreground mb-6"
        >
          Find Your Dream Home
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed"
        >
          Discover exceptional properties curated for those with refined taste.
          Your perfect home awaits.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/properties">
            <button className="w-full sm:w-auto bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Browse Properties
            </button>
          </Link>
          <Link  href="/schedule-tour">
            <button className="w-full sm:w-auto border-2 border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary/10 transition-colors">
              Schedule Tour
            </button>
          </Link>
          {/* <Button
            variant="outline"
            className="w-full h-14 text-lg font-medium bg-transparent"
            size="lg"
            onClick={() => setBookingOpen(true)}
          >
            Schedule a Tour
          </Button> */}
        </motion.div>
      </div>
    </section>
  );
}
