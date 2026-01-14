"use client";

import { motion } from "framer-motion";
import { Crown, Building2, User, Shield, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Crown,
    title: "Unparalleled Expertise",
    description:
      "We bring decades of combined experience in luxury real estate, delivering insider knowledge and market mastery to every transaction.",
  },
  {
    icon: Building2,
    title: "Exclusive Portfolio",
    description:
      "Access curated properties unavailable to the general market—handpicked estates that represent the pinnacle of luxury and investment potential.",
  },
  {
    icon: User,
    title: "Personalized Service",
    description:
      "Dedicated concierge-level support tailored to your unique needs, preferences, and lifestyle aspirations throughout every step.",
  },
  {
    icon: Shield,
    title: "Trusted Network",
    description:
      "Vetted architects, designers, legal experts, and financiers—a trusted ecosystem ensuring seamless transactions and peace of mind.",
  },
  {
    icon: TrendingUp,
    title: "Market Intelligence",
    description:
      "Real-time insights into market trends, property valuations, and emerging opportunities that shape sophisticated investment decisions.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function WhyChooseUs() {
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
          Why Choose Us
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Discover what sets Luxe Estate apart in the world of luxury real
          estate
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-8 shadow-lg transition-shadow duration-300 hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative z-10">
                <div className="mb-6 inline-flex rounded-lg bg-primary/10 p-3">
                  <Icon className="h-8 w-8 text-primary" strokeWidth={1.5} />
                </div>

                <h3 className="mb-3 text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>

                <p className="leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
