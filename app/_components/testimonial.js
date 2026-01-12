"use client";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "Homeowner",
    content:
      "Working with Luxe Estates was a seamless experience. They found us the perfect home within our budget.",
    rating: 5,
    image: "/professional-headshot-woman.png",
  },
  {
    id: 2,
    name: "James Chen",
    role: "Real Estate Investor",
    content:
      "Exceptional service and attention to detail. Highly recommend for any serious buyer.",
    rating: 5,
    image: "/professional-headshot-man.png",
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    role: "First-Time Buyer",
    content:
      "The team guided me through every step. I couldn't have asked for better support.",
    rating: 5,
    image: "/professional-headshot-woman-2.jpg",
  },
];

export default function Testimonials() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <section className="py-20 bg-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-4">
            What Clients Say
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of satisfied homeowners
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              whileHover={{ y: -5 }}
              className="bg-background rounded-xl p-8 shadow-lg border border-border"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className="fill-primary text-primary"
                  />
                ))}
              </div>
              <p className="text-foreground mb-6 leading-relaxed">
                {testimonial.content}
              </p>
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 rounded-full overflow-hidden">
                  <Image
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
