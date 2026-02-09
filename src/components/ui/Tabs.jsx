import React from "react";

export function Tabs({ value, onChange, options = [], className = "" }) {
  return (
    <div className={`inline-flex rounded-full border border-gray-200 bg-gray-50 p-1 ${className}`}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange?.(opt.value)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              active ? "bg-white shadow text-cyan-700" : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
