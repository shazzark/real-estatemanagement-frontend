"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import dynamic from "next/dynamic";
import Navbar from "../_components/navbar";

// ✅ Dynamically import LeafletMap to avoid SSR issues
const LeafletMap = dynamic(() => import("../_components/_ui/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-75 text-muted-foreground">
      Loading map…
    </div>
  ),
});

export default function ContactPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  // Office coordinates (Enugu: 16 Onyeneke Street)
  const officeLocation = {
    lat: 6.4521, // Approx latitude of Enugu city
    lng: 7.524, // Approx longitude of Enugu city
    address: "16 Onyeneke Street, Enugu",
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />

      {/* Header Section */}
      <section className="relative h-[60vh] flex flex-col items-center justify-center bg-accent text-accent-foreground overflow-hidden">
        <motion.div
          className="z-10 text-center px-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-8xl font-serif mb-6 uppercase tracking-tighter">
            Get in Touch
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90 font-light leading-relaxed">
            Whether you're looking for your dream home or have a property to
            sell, our dedicated team is here to guide you through every step of
            the journey.
          </p>
        </motion.div>
        <div className="absolute inset-0 opacity-20 bg-[url('/ornate-window-detail.png')] bg-cover bg-center" />
      </section>

      <main className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          {/* Contact Information */}
          <motion.div {...fadeInUp}>
            <h2 className="text-4xl font-serif mb-12 uppercase">
              Contact Info
            </h2>
            <div className="space-y-12">
              <div className="flex items-start gap-6 group">
                <div className="p-4 bg-primary text-primary-foreground rounded-full transition-transform group-hover:scale-110">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-1">
                    Email Us
                  </h3>
                  <p className="text-xl font-medium">
                    hello@artifact-estates.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="p-4 bg-primary text-primary-foreground rounded-full transition-transform group-hover:scale-110">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-1">
                    Call Us
                  </h3>
                  <p className="text-xl font-medium">+1 (555) 234-5678</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="p-4 bg-primary text-primary-foreground rounded-full transition-transform group-hover:scale-110">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-1">
                    Visit Us
                  </h3>
                  <p className="text-xl font-medium leading-relaxed">
                    16 Onyeneke Street,
                    <br />
                    Enugu
                  </p>
                </div>
              </div>
            </div>

            {/* Map Component */}
            <div className="mt-16 rounded-2xl overflow-hidden border border-border h-75">
              <LeafletMap location={officeLocation} />
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.2 }}
            className="bg-card p-12 rounded-3xl border border-border shadow-sm"
          >
            <h2 className="text-4xl font-serif mb-8 uppercase">
              Send a Message
            </h2>
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-transparent border-b border-border py-4 outline-none focus:border-primary transition-colors text-lg"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full bg-transparent border-b border-border py-4 outline-none focus:border-primary transition-colors text-lg"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
                  Your Message
                </label>
                <textarea
                  rows={4}
                  placeholder="How can we help you?"
                  className="w-full bg-transparent border-b border-border py-4 outline-none focus:border-primary transition-colors text-lg resize-none"
                />
              </div>

              <button className="w-full group bg-primary text-primary-foreground py-6 rounded-full text-lg font-semibold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary/90 transition-all">
                Send Message
                <Send
                  size={20}
                  className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </button>
            </form>
          </motion.div>
        </div>
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
  );
}
