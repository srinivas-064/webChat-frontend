import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { fetchBlogs } from "../api/blog.api";
import { PostCard } from "../components/post/PostCard";
import { Tabs } from "../components/ui/Tabs";
import { Button } from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";
import { useToast } from "../context/ToastContext.jsx";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("latest");
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
      const data = await fetchBlogs({ page: pageToLoad, limit, sort: filter });
      const items = data?.blogs || [];
      setBlogs((prev) => (replace ? items : [...prev, ...items]));
      setPage(pageToLoad);
      setHasMore(pageToLoad < (data?.totalPages || 1));
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Failed to load blogs";
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
  }, [filter]);

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

  const sorted = useMemo(() => {
    return [...blogs];
  }, [blogs, filter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-cyan-700 uppercase">Blogs</p>
          <h1 className="text-3xl font-bold text-gray-900">Campus stories & tips</h1>
        </div>
        <Link to="/blogs/new">
          <Button>Create Blog</Button>
        </Link>
      </div>

      <Tabs
        value={filter}
        onChange={setFilter}
        options={[
          { value: "latest", label: "Latest" },
          { value: "likes", label: "Most liked" },
        ]}
      />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 space-y-3">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-white border border-red-100 rounded-2xl p-6 text-center text-red-600">
          {error}
        </div>
      ) : sorted.length ? (
        <div className="grid gap-5 sm:grid-cols-2">
          {sorted.map((b) => (
            <PostCard key={b.id || b._id} post={b} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-dashed rounded-2xl p-10 text-center text-gray-600">
          No blogs yet. Be the first to post!
        </div>
      )}
      {sorted.length > 0 && (
        <div className="py-4 flex items-center justify-center text-sm text-gray-500">
          {loadingMore ? "Loading more..." : hasMore ? "Scroll to load more" : "No more blogs"}
        </div>
      )}
      <div ref={sentinelRef} />
    </div>
  );
}
