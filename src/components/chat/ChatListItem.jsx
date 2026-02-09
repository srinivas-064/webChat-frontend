import React from "react";
import { Link } from "react-router-dom";

export function ChatListItem({ chat }) {
  return (
    <Link
      to={`/chat/${chat.id}`}
      className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:-translate-y-1 hover:shadow-md transition"
    >
      <img
        src={chat.avatar}
        alt={chat.persona}
        className="w-12 h-12 rounded-full object-cover"
        loading="lazy"
      />
      <div className="flex-1">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="font-semibold text-gray-900 flex items-center gap-2">
            {chat.persona}
            {chat.unread ? <span className="inline-block h-2 w-2 rounded-full bg-rose-500" /> : null}
          </span>
          <span>{new Date(chat.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
        <p className="text-sm text-gray-600 line-clamp-1">{chat.lastMessage}</p>
      </div>
    </Link>
  );
}
