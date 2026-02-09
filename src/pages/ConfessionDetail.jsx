import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchConfession, likeConfession, commentOnConfession } from "../api/confession.api";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Skeleton } from "../components/ui/Skeleton";
import { useAuth } from "../context/AuthContext.jsx";

export default function ConfessionDetail() {
  const { id } = useParams();
  const [confession, setConfession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const navigate = useNavigate();
  const { loggedIn, user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    fetchConfession(id).then((data) => {
      setConfession(data?.confession);
      const baseLikes = data?.confession?.likesCount || 0;
      setLikes(baseLikes);
      if (user?.id && Array.isArray(data?.confession?.likes)) {
        setLiked(data.confession.likes.some((uid) => uid.toString() === user.id.toString()));
      }
      setComments(data?.confession?.comments || []);
      setLoading(false);
    });
  }, [id, user?.id]);

  if (loading) return <Skeleton className="h-64 w-full" />;
  if (!confession)
    return (
      <div className="bg-white p-6 rounded-2xl border text-center">
        Confession not found.
        <div className="mt-3">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            Go back
          </Button>
        </div>
      </div>
    );

  const confessionId = confession.id || confession._id;
  const authorName =
    confession.authorName ||
    confession.author?.username ||
    confession.author?.email ||
    confession.author ||
    "Anonymous";

  return (
    <div className="space-y-3">
      <Link to="/confessions" className="text-sm text-rose-700 font-semibold">← Back to confessions</Link>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{confession.mood}</span>
            <span>{authorName}</span>
          </div>
          <span>
            {new Date(confession.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{confession.title}</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {confession.tags?.map((t) => (
            <Badge key={t} color="teal">#{t}</Badge>
          ))}
        </div>
        <p className="text-gray-800 whitespace-pre-line mb-4">{confession.content}</p>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="ghost"
            className={liked ? "text-rose-600" : ""}
            onClick={async () => {
              if (!loggedIn) {
                navigate("/auth/login", { replace: true });
                return;
              }
              const res = await likeConfession(confessionId);
              if (typeof res?.likesCount === "number") setLikes(res.likesCount);
              if (typeof res?.liked === "boolean") setLiked(res.liked);
            }}
          >
            <Heart size={16} /> {likes}
          </Button>
          <Button variant="ghost">
            <MessageCircle size={16} /> {comments.length || confession.commentsCount || 0}
          </Button>
          <Button variant="ghost" onClick={() => navigator.clipboard?.writeText(window.location.href)}>
            <Share2 size={16} /> Share
          </Button>
          {confession.allowDMs && (
            <Button variant="primary" onClick={() => navigate(`/chat/${id}`)}>
              Message anonymously
            </Button>
          )}
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
            const res = await commentOnConfession(confessionId, commentText.trim()).catch(() => null);
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
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-400"
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
