"use client";
import { useState } from "react";
export default function ImageByUser(prop) {
  const [error, setError] = useState(false);
  const { userId, className } = prop;
  const baseClasses = "w-full h-full object-cover";

  if (error)
    return (
      <img
        src="/image/user_default.webp"
        className={`${baseClasses} ${className}`}
        alt=""
        loading="eager"
      />
    );

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

  return (
    <img
      src={`${apiUrl}/api/users/detail/image/view/${userId}`}
      alt={`${userId || ""}`}
      className={`${baseClasses} ${className}`}
      onError={() => setError(true)}
      loading="eager"
    />
  );
}
