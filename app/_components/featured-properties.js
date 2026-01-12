"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PropertyCard from "./properties-card";
import { fetchAPI } from "../_lib/api"; // your API utility
import { useRouter } from "next/navigation";

export default function FeaturedProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function getProperties() {
      try {
        setLoading(true);
        const data = await fetchAPI("/properties?limit=3"); // fetch only 3 properties
        // Assuming your API returns { data: { properties: [...] } }
        setProperties(data.data?.properties || []);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load properties");
      } finally {
        setLoading(false);
      }
    }

    getProperties();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-destructive">
        <p className="text-xl">{error}</p>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-xl">No featured properties found</p>
      </div>
    );
  }

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
            Featured Properties
          </h2>
          <p className="text-lg text-muted-foreground">
            Handpicked selection of our most exclusive listings
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {properties.map((property) => (
            <PropertyCard
              key={property._id}
              property={property}
              onViewDetails={() => router.push(`/properties/${property._id}`)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
