import React from "react";
import { Heart, MessageCircle, Clock, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "../ui/Badge";

export function PostCard({ post }) {
  const authorName =
    post.authorName ||
    post.author?.username ||
    post.author?.email ||
    post.author ||
    "Anonymous";

  return (
    <Link
      to={`/blogs/${post.id || post._id}`}
      className="block bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden hover:-translate-y-1 hover:shadow-md transition"
    >
      {post.imageUrl && (
        <div className="h-48 w-full overflow-hidden">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="inline-flex items-center gap-2">
            <User size={14} /> {authorName}
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock size={14} /> {new Date(post.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
        <div className="flex flex-wrap gap-2">
          {post.tags?.map((tag) => (
            <Badge key={tag}>#{tag}</Badge>
          ))}
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="inline-flex items-center gap-1"><Heart size={16} /> {post.likesCount ?? post.likes ?? 0}</span>
          <span className="inline-flex items-center gap-1"><MessageCircle size={16} /> {post.commentsCount ?? 0}</span>
        </div>
      </div>
    </Link>
  );
}
