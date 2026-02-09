import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { fetchConfessions } from "../api/confession.api";
import { ConfessionCard } from "../components/post/ConfessionCard";
import { Button } from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";
import { useToast } from "../context/ToastContext.jsx";

export default function Confessions() {
  const [confessions, setConfessions] = useState([]);
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
      const data = await fetchConfessions({ page: pageToLoad, limit });
      const items = data?.confessions || [];
      setConfessions((prev) => (replace ? items : [...prev, ...items]));
      setPage(pageToLoad);
      setHasMore(pageToLoad < (data?.totalPages || 1));
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Failed to load confessions";
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-rose-700 uppercase">Confessions</p>
          <h1 className="text-3xl font-bold text-gray-900">Anonymous confessions</h1>
        </div>
        <Link to="/confessions/new">
          <Button variant="soft">Add Confession</Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 space-y-3">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-white border border-red-100 rounded-2xl p-6 text-center text-red-600">
          {error}
        </div>
      ) : confessions.length ? (
        <div className="grid gap-5 sm:grid-cols-2">
          {confessions.map((c) => (
            <ConfessionCard key={c.id || c._id} confession={c} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-dashed rounded-2xl p-10 text-center text-gray-600">
          No confessions yet. Share anonymously!
        </div>
      )}
      {confessions.length > 0 && (
        <div className="py-4 flex items-center justify-center text-sm text-gray-500">
          {loadingMore ? "Loading more..." : hasMore ? "Scroll to load more" : "No more confessions"}
        </div>
      )}
      <div ref={sentinelRef} />
    </div>
  );
}
