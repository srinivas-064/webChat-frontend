import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { fetchBlog, likeBlog, commentOnBlog } from "../api/blog.api";
import { Button } from "../components/ui/Button";
import { Heart, MessageCircle, Share2, Clock, User } from "lucide-react";
import { Skeleton } from "../components/ui/Skeleton";
import { useAuth } from "../context/AuthContext.jsx";

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const navigate = useNavigate();
  const { loggedIn } = useAuth();

  useEffect(() => {
    fetchBlog(id).then((data) => {
      setBlog(data?.blog);
      setLikes(data?.blog?.likesCount || 0);
      setComments(data?.blog?.comments || []);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
        Blog not found.
        <div className="mt-3">
          <Button onClick={() => navigate(-1)} variant="ghost">
            Go back
          </Button>
        </div>
      </div>
    );
  }

  const authorName =
    blog.authorName ||
    blog.author?.username ||
    blog.author?.email ||
    blog.author ||
    "Anonymous";

  const blogId = blog.id || blog._id;

  return (
    <div className="space-y-4 max-w-3xl mx-auto w-full">
      <Link to="/blogs" className="text-sm text-cyan-700 font-semibold">← Back to blogs</Link>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span className="inline-flex items-center gap-2">
            <User size={16} /> {authorName}
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock size={15} />
            {new Date(blog.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{blog.title}</h1>
        {blog.imageUrl && (
          <div className="mb-5 rounded-3xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
            <img
              src={blog.imageUrl}
              alt={blog.title}
              className="w-full h-[420px] object-cover"
              loading="lazy"
            />
          </div>
        )}
        <div className="prose prose-slate max-w-none whitespace-pre-line text-gray-800">
          {blog.content}
        </div>
        <div className="flex items-center gap-3 mt-4">
          <Button
            variant="ghost"
            onClick={async () => {
              if (!loggedIn) {
                navigate("/auth/login", { replace: true });
                return;
              }
              const res = await likeBlog(blogId);
              if (typeof res?.likesCount === "number") setLikes(res.likesCount);
            }}
          >
            <Heart size={18} /> {likes}
          </Button>
          <Button variant="ghost">
            <MessageCircle size={18} /> {comments.length || blog.commentsCount || 0}
          </Button>
          <Button variant="ghost" onClick={() => navigator.clipboard?.writeText(window.location.href)}>
            <Share2 size={18} /> Share
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <MessageCircle size={18} /> Comments ({comments.length})
        </h2>
        <form
          className="space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!loggedIn) {
              navigate("/auth/login", { replace: true });
              return;
            }
            if (!commentText.trim()) return;
            const res = await commentOnBlog(blogId, commentText.trim()).catch(() => null);
            const fresh = res?.comment || { id: crypto.randomUUID(), text: commentText.trim(), authorName: "You" };
            setComments((prev) => [...prev, fresh]);
            setCommentText("");
          }}
        >
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows={3}
            placeholder="Add your comment..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <Button type="submit" className="px-4 py-2">
            Post Comment
          </Button>
        </form>
        <div className="space-y-3">
          {comments.map((c) => (
            <div key={c.id || c._id} className="border border-gray-100 rounded-xl px-4 py-3 bg-gray-50">
              <div className="text-sm font-semibold text-gray-800 mb-1">
                {c.authorName || c.author?.username || c.author?.email || "Anonymous"}
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-line">{c.text}</p>
            </div>
          ))}
          {comments.length === 0 && <p className="text-sm text-gray-600">No comments yet.</p>}
        </div>
      </div>
    </div>
  );
}
