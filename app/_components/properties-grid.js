"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PropertyCard from "./properties-card";
import { fetchAPI } from "../_lib/api"; // Import fetchAPI

export default function PropertiesGrid() {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProperties() {
      try {
        setIsLoading(true);
        console.log("🌐 Fetching properties...");

        // Use fetchAPI instead of fetch
        const data = await fetchAPI("/properties");
        console.log("📦 API Data structure:", data);
        console.log("🏠 Properties array:", data.data?.properties);
        console.log("🔢 Number of properties:", data.data?.properties?.length);

        // Your API returns: { data: { properties: [...] } }
        if (data.data && data.data.properties) {
          setProperties(data.data.properties);
        } else if (Array.isArray(data)) {
          setProperties(data);
        } else {
          console.log("❌ Unexpected data structure:", data);
          setProperties([]);
        }
      } catch (err) {
        console.error("❌ Error fetching properties:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProperties();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-4">
            Our Properties
          </h1>
          <p className="text-lg text-muted-foreground">
            {isLoading
              ? "Loading..."
              : `${properties.length} properties available`}
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-100">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-destructive">
            <p className="text-xl">{error}</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl">No properties found</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
