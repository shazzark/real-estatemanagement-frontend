// app/_lib/imageUtils.js
export const getPropertyImageUrl = (image) => {
  if (!image) {
    return "https://images.unsplash.com/photo-1613490493576-7fde63acd811";
  }

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  // Always use the /img/properties/ path (which we know works)
  if (image.filename) {
    return `${API_URL}/img/properties/${image.filename}`;
  }

  // Fallback
  return "https://images.unsplash.com/photo-1613490493576-7fde63acd811";
};
