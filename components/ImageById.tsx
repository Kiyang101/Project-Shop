"use client";
import { useState } from "react";
export default function ImageById(prop) {
  const [error, setError] = useState(false);
  const { imageId, orientation, className } = prop;
  const baseClasses = "w-full h-full object-cover shadow-2xl";

  if (error)
    return (
      <img
        src="/image/elon.webp"
        className={`${baseClasses} ${className}`}
        alt=""
        loading="eager"
      />
    );

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

  return (
    <img
      src={`${apiUrl}/api/products/image/view/${imageId}`}
      alt={`${imageId || ""}`}
      className={`${baseClasses} ${className}`}
      onError={() => setError(true)}
      loading="eager"
    />
  );
}
