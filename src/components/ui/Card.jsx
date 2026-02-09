import React from "react";

export function Card({ className = "", children }) {
  return (
    <div className={`bg-white border border-gray-100 shadow-sm rounded-2xl ${className}`}>
      {children}
    </div>
  );
}
