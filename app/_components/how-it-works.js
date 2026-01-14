"use client";

import { motion } from "framer-motion";
import { Search, MessageSquare, FileCheck, Heart } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: Search,
    title: "Discover Your Dream",
    description:
      "Browse our curated collection or schedule a private viewing to explore properties that match your vision and lifestyle.",
    animation: "fadeSlide",
  },
  {
    number: 2,
    icon: MessageSquare,
    title: "Expert Consultation",
    description:
      "Discuss investment goals, financing options, and property specifics with our specialist team in confidential consultations.",
    animation: "scale",
  },
  {
    number: 3,
    icon: FileCheck,
    title: "Seamless Transaction",
    description:
      "Our legal and finance experts handle all documentation, negotiations, and compliance—simplifying the entire closing process.",
    animation: "slidePulse",
  },
  {
    number: 4,
    icon: Heart,
    title: "Ongoing Partnership",
    description:
      "Receive property management support, market updates, and concierge services long after purchase—we're invested in your satisfaction.",
    animation: "bounce",
  },
];

const getAnimationVariants = (type) => {
  const baseVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6 },
    },
  };

  switch (type) {
    case "fadeSlide":
      return {
        ...baseVariants,
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
      };
    case "scale":
      return {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
      };
    case "slidePulse":
      return {
        hidden: { opacity: 0, x: -30 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
      };
    case "bounce":
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.4 } },
      };
    default:
      return baseVariants;
  }
};

export default function HowItWorks() {
  return (
    <section className="py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="mb-16 text-center"
      >
        <h2 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          How It Works
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          A seamless four-step journey to finding your luxury home
        </p>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const variants = getAnimationVariants(step.animation);

          return (
            <motion.div
              key={index}
              variants={variants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="relative"
            >
              {index < steps.length - 1 && (
                <div className="absolute -right-4 top-12 hidden h-1 w-8 bg-linear-to-r from-primary/50 to-transparent lg:block" />
              )}

              <div className="rounded-xl border border-border bg-card p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
                {/* Step number badge */}
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="mb-4">
                  <Icon className="h-8 w-8 text-primary" strokeWidth={1.5} />
                </div>

                {/* Content */}
                <h3 className="mb-3 text-xl font-semibold text-foreground">
                  {step.title}
                </h3>

                <p className="leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
