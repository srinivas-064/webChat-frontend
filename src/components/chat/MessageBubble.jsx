import React from "react";

export function MessageBubble({ message }) {
  const isMine = message.from === "me";
  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-sm border ${
          isMine
            ? "bg-cyan-50 text-cyan-900 border-cyan-100"
            : "bg-white text-gray-800 border-gray-100"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}
