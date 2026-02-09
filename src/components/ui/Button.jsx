import React from "react";

const variants = {
  primary: "bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600",
  ghost: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50",
  soft: "bg-cyan-50 text-cyan-700 hover:bg-cyan-100",
  danger: "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100",
};

export function Button({ variant = "primary", className = "", children, as: Element = "button", ...props }) {
  return React.createElement(
    Element,
    {
      className: `inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold transition shadow-sm ${
        variants[variant] || variants.primary
      } ${className}`,
      ...props,
    },
    children
  );
}
