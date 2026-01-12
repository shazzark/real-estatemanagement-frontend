"use client";

import { Star } from "lucide-react";

export default function StarRating({
  rating = 0,
  onChange,
  size = 20,
  readOnly = false,
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          size={size}
          onClick={() => !readOnly && onChange?.(value)}
          className={`cursor-pointer transition ${
            value <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted-foreground"
          } ${readOnly ? "cursor-default" : "hover:scale-110"}`}
        />
      ))}
    </div>
  );
}
