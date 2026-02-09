import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Button } from "../components/ui/Button";
import { useNavigate, Link } from "react-router-dom";
import { fetchBlogs } from "../api/blog.api";
import { fetchConfessions } from "../api/confession.api";
import { fetchFriends } from "../api/friend.api";
import { useToast } from "../context/ToastContext.jsx";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [stats, setStats] = useState({ posts: 0, confessions: 0, friends: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = user?.id;
    if (!userId) {
      setLoading(false);
      return;
    }
    Promise.all([
      fetchBlogs({ page: 1, limit: 50 }),
      fetchConfessions({ page: 1, limit: 50 }),
      fetchFriends(),
    ])
      .then(([blogsData, confsData, friends]) => {
        const blogs = blogsData?.blogs || [];
        const confs = confsData?.confessions || [];
        const myBlogs = blogs.filter((b) => {
          const authorId = b.author?._id || b.author?.id || b.author;
          return authorId?.toString?.() === userId.toString();
        });
        const myConfs = confs.filter((c) => {
          const authorId = c.author?._id || c.author?.id || c.author;
          return authorId?.toString?.() === userId.toString();
        });
        setStats({ posts: myBlogs.length, confessions: myConfs.length, friends: friends.length });
      })
      .catch((err) => {
        addToast({ title: "Error", description: err?.message || "Failed to load stats" });
      })
      .finally(() => setLoading(false));
  }, [user?.id]);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="flex items-center gap-4">
        <img
          src={user?.profilePic || user?.avatar || "https://api.dicebear.com/9.x/bottts/svg?seed=ChatWeb"}
          alt={user?.username || user?.name}
          className="w-20 h-20 rounded-2xl"
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{user?.username || user?.name || "Guest"}</h1>
          <p className="text-sm text-gray-600">{user?.email || "Not signed in"}</p>
          <p className="text-sm text-gray-600">Bio: {user?.bio || "Add a bio in Settings."}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 justify-end">
        <Button variant="ghost" onClick={() => navigate("/settings")}>Edit profile</Button>
        <Button variant="soft" as={Link} to="/profile/posts">Manage posts</Button>
        <Button variant="soft" as={Link} to="/profile/confessions">Manage confessions</Button>
      </div>

      <div className="col-span-full grid sm:grid-cols-3 gap-4">
        {[
          { label: "My posts", value: stats.posts },
          { label: "My confessions", value: stats.confessions },
          { label: "Friends", value: stats.friends },
        ].map((item) => (
          <div key={item.label} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <p className="text-sm text-gray-600">{item.label}</p>
            <p className="text-2xl font-bold text-gray-900">{loading ? "—" : item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
