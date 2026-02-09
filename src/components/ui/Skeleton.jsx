import React from "react";

export function Skeleton({ className = "h-4" }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}
