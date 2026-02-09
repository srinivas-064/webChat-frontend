import React, { useEffect, useMemo, useRef, useState } from "react";
import { Megaphone, Clock, Heart, MessageCircle, Share2, Users } from "lucide-react";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Link } from "react-router-dom";
import { fetchSocietyUpdates } from "../api/societyUpdate.api";
import { useToast } from "../context/ToastContext.jsx";

export default function SocietyUpdates() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const sentinelRef = useRef(null);
  const loadingRef = useRef(false);
  const { addToast } = useToast();
  const limit = 6;

  const loadPage = async (pageToLoad, replace = false) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setError("");
    if (pageToLoad === 1) setLoading(true);
    else setLoadingMore(true);
    try {
      const data = await fetchSocietyUpdates({ page: pageToLoad, limit });
      const items = data?.updates || [];
      setUpdates((prev) => (replace ? items : [...prev, ...items]));
      setPage(pageToLoad);
      setHasMore(pageToLoad < (data?.totalPages || 1));
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Failed to load updates";
      setError(msg);
      addToast({ title: "Error", description: msg });
    } finally {
      loadingRef.current = false;
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadPage(1, true);
  }, []);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
          loadPage(page + 1);
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, page]);

  const displayed = useMemo(() => updates, [updates]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-cyan-50 text-cyan-700">
          <Megaphone size={22} />
        </div>
        <div>
          <p className="text-sm font-semibold text-cyan-700 uppercase">Society Updates</p>
          <h1 className="text-3xl font-bold text-gray-900">Clubs & societies feed</h1>
          <p className="text-sm text-gray-600">Stay updated with the latest society announcements.</p>
        </div>
        <div className="ml-auto">
          <Link to="/society-updates/new">
            <Button>Post update</Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 space-y-3">
              <div className="h-4 w-1/3 bg-gray-100 rounded-full" />
              <div className="h-6 w-2/3 bg-gray-100 rounded-full" />
              <div className="h-40 w-full bg-gray-100 rounded-xl" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-white border border-red-100 rounded-2xl p-6 text-center text-red-600">
          {error}
        </div>
      ) : displayed.length ? (
        <div className="grid gap-5 sm:grid-cols-2">
          {displayed.map((u) => {
            const updateId = u.id || u._id;
            return (
              <Link
                key={updateId}
                to={`/society-updates/${updateId}`}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden hover:-translate-y-1 hover:shadow-md transition"
              >
                <div className="p-5 flex items-center justify-between text-xs text-gray-500">
                  <span className="inline-flex items-center gap-2"><Users size={14} /> {u.club || "Society"}</span>
                  <span className="inline-flex items-center gap-2"><Clock size={14} /> {new Date(u.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</span>
                </div>
                {u.imageUrl && (
                  <div className="w-full h-80 sm:h-96 overflow-hidden">
                    <img src={u.imageUrl} alt={u.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                )}
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900">{u.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {u.tags?.map((t) => (
                      <Badge key={t}>#{t}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <Button variant="ghost" className="px-3 py-2 rounded-full border border-gray-200" onClick={(e) => e.preventDefault()}>
                      <Heart size={16} /> {u.likesCount ?? 0}
                    </Button>
                    <Button variant="ghost" className="px-3 py-2 rounded-full border border-gray-200" onClick={(e) => e.preventDefault()}>
                      <MessageCircle size={16} /> {u.commentsCount ?? 0}
                    </Button>
                    <Button variant="ghost" className="px-3 py-2 rounded-full border border-gray-200" onClick={(e) => e.preventDefault()}>
                      <Share2 size={16} /> 0
                    </Button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-dashed rounded-2xl p-10 text-center text-gray-600">
          No updates yet. Post the first one!
        </div>
      )}
      {displayed.length > 0 && (
        <div className="py-4 flex items-center justify-center text-sm text-gray-500">
          {loadingMore ? "Loading more..." : hasMore ? "Scroll to load more" : "No more updates"}
        </div>
      )}
      <div ref={sentinelRef} />
    </div>
  );
}
