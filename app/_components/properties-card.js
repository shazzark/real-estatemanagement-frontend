"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function PropertyCard({ property }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  // ✅ CORRECT: Use the working path
  const imageUrl =
    property.images && property.images.length > 0
      ? `${API_URL}/img/properties/${property.images[0].filename}` // Use filename with /img/ path
      : "https://images.unsplash.com/photo-1613490493576-7fde63acd811";

  // Format price as Nigerian Naira
  const formattedPrice = property.price
    ? `₦${property.price.toLocaleString()}`
    : "Price on request";

  // Get location
  const location = property.address?.city
    ? `${property.address.city}, ${property.address.state}`
    : "Lagos, Nigeria";

  const propertyId = property._id;
  const propertyUrl = `/properties/${propertyId}`;

  const handleImageError = (e) => {
    console.log("❌ Image failed to load:", imageUrl);

    // Try alternative: Use the URL from database
    if (property.images?.[0]?.url) {
      const altUrl = `${API_URL}${property.images[0].url}`;
      console.log("🔄 Trying alternative:", altUrl);
      e.target.src = altUrl;
      return;
    }

    // Final fallback
    e.target.src =
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811";
  };

  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200"
    >
      {/* Image */}
      <div className="relative h-64 w-full overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={property.title || "Property"}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
          onError={handleImageError}
          loading="lazy"
        />
        <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {property.listingType === "rent" ? "FOR RENT" : "FOR SALE"}
        </div>
        {property.isNewListing && (
          <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            NEW
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-4">
          <p className="text-2xl font-bold text-blue-700">{formattedPrice}</p>
          <h3 className="text-xl font-bold mt-2 text-gray-900 line-clamp-1">
            {property.title}
          </h3>
          <p className="text-gray-600 text-sm mt-1">{location}</p>
        </div>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {property.description}
        </p>
        <div className="flex justify-between text-sm text-gray-500 mb-6 border-t border-b border-gray-100 py-3">
          <div className="text-center">
            <div className="font-bold text-gray-800">
              {property.bedrooms || 0}
            </div>
            <div className="text-xs">Beds</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-gray-800">
              {property.bathrooms || 0}
            </div>
            <div className="text-xs">Baths</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-gray-800">
              {property.area || 0} sq ft
            </div>
            <div className="text-xs">Area</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-gray-800 capitalize">
              {property.propertyType || "Property"}
            </div>
            <div className="text-xs">Type</div>
          </div>
        </div>
        <Link href={propertyUrl} passHref>
          <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer">
            View Details
          </button>
        </Link>
      </div>
    </motion.div>
  );
}
