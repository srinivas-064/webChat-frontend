import React, { useEffect, useMemo, useState } from "react";
import { deleteBlog, fetchBlogs, updateBlog } from "../api/blog.api";
import { ConfirmDeleteModal } from "../components/common/ConfirmDeleteModal";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { Input, Textarea } from "../components/ui/Input";
import { useToast } from "../context/ToastContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProfilePosts() {
  const [blogs, setBlogs] = useState([]);
  const [target, setTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", tags: "", content: "" });
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const { user } = useAuth();

  const userId = user?.id;
  const myBlogs = useMemo(() => {
    if (!userId) return blogs;
    return blogs.filter((b) => {
      const authorId = b.author?._id || b.author?.id || b.author;
      return authorId?.toString?.() === userId.toString();
    });
  }, [blogs, userId]);

  useEffect(() => {
    fetchBlogs({ page: 1, limit: 50 })
      .then((data) => setBlogs(data?.blogs || []))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    if (!target) return;
    const targetId = target.id || target._id;
    try {
      await deleteBlog(targetId);
      setBlogs((prev) => prev.filter((b) => (b.id || b._id) !== targetId));
      setTarget(null);
    } catch (err) {
      addToast({ title: "Error", description: err?.response?.data?.message || "Delete failed" });
    }
  };

  const openEdit = (blog) => {
    setEditTarget(blog);
    setEditForm({
      title: blog.title || "",
      tags: (blog.tags || []).join(", "),
      content: blog.content || "",
    });
  };

  const handleUpdate = async () => {
    if (!editTarget) return;
    const targetId = editTarget.id || editTarget._id;
    const payload = {
      title: editForm.title,
      content: editForm.content,
      tags: editForm.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    try {
      const res = await updateBlog(targetId, payload);
      const updated = res?.blog || res;
      setBlogs((prev) =>
        prev.map((b) => ((b.id || b._id) === targetId ? { ...b, ...updated } : b))
      );
      setEditTarget(null);
    } catch (err) {
      addToast({ title: "Error", description: err?.response?.data?.message || "Update failed" });
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Manage posts</h1>
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 text-gray-600">Loading posts...</div>
        ) : myBlogs.map((b) => (
          <div key={b.id || b._id} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">{b.title}</p>
              <p className="text-sm text-gray-600">{(b.tags || []).join(", ")}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="soft" onClick={() => openEdit(b)}>Edit</Button>
              <Button variant="danger" onClick={() => setTarget(b)}>Delete</Button>
            </div>
          </div>
        ))}
        {!loading && !myBlogs.length && (
          <div className="bg-white border border-dashed rounded-2xl p-6 text-center text-gray-600">No posts yet.</div>
        )}
      </div>
      <ConfirmDeleteModal
        open={Boolean(target)}
        onClose={() => setTarget(null)}
        onConfirm={handleDelete}
        itemLabel="blog"
      />
      <Modal open={Boolean(editTarget)} onClose={() => setEditTarget(null)} title="Edit blog">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Title</label>
            <Input value={editForm.title} onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Tags</label>
            <Input value={editForm.tags} onChange={(e) => setEditForm((f) => ({ ...f, tags: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Content</label>
            <Textarea rows={5} value={editForm.content} onChange={(e) => setEditForm((f) => ({ ...f, content: e.target.value }))} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setEditTarget(null)}>Cancel</Button>
            <Button onClick={handleUpdate}>Save changes</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
