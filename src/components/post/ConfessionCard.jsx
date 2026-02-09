import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "../ui/Badge";
import { Clock, MessageCircle, Heart } from "lucide-react";

export function ConfessionCard({ confession }) {
  const authorName =
    confession.authorName ||
    confession.author?.username ||
    confession.author?.email ||
    confession.author ||
    "Anonymous";

  return (
    <Link
      to={`/confessions/${confession.id || confession._id || ""}`}
      className="block bg-white border border-gray-100 rounded-2xl shadow-sm p-5 hover:-translate-y-1 hover:shadow-md transition"
    >
      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{confession.mood || "🥲"}</span>
          <span>{authorName}</span>
        </div>
        <span className="inline-flex items-center gap-1">
          <Clock size={14} />
          {new Date(confession.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{confession.title}</h3>
      <p className="text-sm text-gray-700 line-clamp-2 mb-3">{confession.content}</p>
      <div className="flex flex-wrap gap-2 mb-3">
        {confession.tags?.map((tag) => (
          <Badge key={tag} color="teal">#{tag}</Badge>
        ))}
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <span className="inline-flex items-center gap-1">
          <Heart size={14} /> {confession.likesCount ?? confession.likes?.length ?? 0}
        </span>
        <span className="inline-flex items-center gap-1">
          <MessageCircle size={14} /> {confession.commentsCount ?? confession.comments?.length ?? 0}
        </span>
      </div>
    </Link>
  );
}
