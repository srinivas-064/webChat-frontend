import React from "react";

export function Badge({ children, color = "cyan", className = "" }) {
  const colors = {
    cyan: "bg-cyan-50 text-cyan-700",
    teal: "bg-teal-50 text-teal-700",
    rose: "bg-rose-50 text-rose-700",
    gray: "bg-gray-100 text-gray-700",
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${colors[color] || colors.cyan} ${className}`}>
      {children}
    </span>
  );
}
