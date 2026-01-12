"use client";

import { useEffect, useState } from "react";
import WishlistButton from "../../_components/_ui/wishlistButton";
import { toast } from "react-hot-toast";
import { fetchAPI } from "../../_lib/api";

export default function WishlistSection() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const data = await fetchAPI("/wishlist");

      setWishlist(data.data?.wishlist || []);
    } catch (err) {
      console.error(err);
      toast.error("Could not load wishlist");
    } finally {
      setLoading(false);
    }
  };

  // Helper function for image URLs (SAME as PropertyCard)
  const getImageUrl = (property) => {
    if (!property.images || property.images.length === 0) {
      return "https://images.unsplash.com/photo-1613490493576-7fde63acd811";
    }

    const firstImage = property.images[0];

    // ✅ Use the WORKING pattern from PropertyCard
    if (firstImage && firstImage.filename) {
      return `${API_URL}/img/properties/${firstImage.filename}`;
    }

    return "https://images.unsplash.com/photo-1613490493576-7fde63acd811";
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (loading) return <p>Loading wishlist...</p>;
  if (!wishlist.length) return <p>No properties in your wishlist yet.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {wishlist.map((item) => (
        <div
          key={item._id}
          className="border rounded-lg shadow hover:shadow-lg p-4 flex flex-col"
        >
          <img
            src={getImageUrl(item.property)} // ✅ Fixed!
            alt={item.property.title}
            className="w-full h-48 object-cover rounded-md mb-2"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1613490493576-7fde63acd811";
            }}
          />
          <h3 className="font-semibold text-lg">{item.property.title}</h3>
          <p className="text-sm text-muted-foreground">
            {item.property.address?.city || "Unknown City"}
          </p>
          <p className="font-bold mt-1">${item.property.price}</p>
          <div className="mt-2">
            <WishlistButton propertyId={item.property._id} />
          </div>
        </div>
      ))}
    </div>
  );
}
