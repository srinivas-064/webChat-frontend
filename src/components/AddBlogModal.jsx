import React, { useState } from "react";
import { X } from "lucide-react";

// Reusable modal for creating a blog post (frontend-only for now)
const AddBlogModal = ({ open, onClose, onSubmit, entityLabel = "blog" }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageData, setImageData] = useState(null);
  const [tagsText, setTagsText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setImageData(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setImageData(ev.target?.result || null);
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setTitle("");
    setContent("");
    setImageData(null);
    setTagsText("");
    setSubmitting(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    setError("");

    const now = new Date().toISOString();
    const tags = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const newPost = {
      id: crypto.randomUUID(),
      author: "You",
      title: title.trim(),
      body: content,
      excerpt: content.trim()
        ? content.trim().slice(0, 160) + (content.length > 160 ? "..." : "")
        : "No content provided.",
      tags,
      createdAt: now,
      comments: [],
      imageUrl: imageData,
    };

    try {
      await onSubmit?.(newPost);
      reset();
      onClose?.();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to add blog. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Add a {entityLabel}
          </h2>
          <button onClick={handleClose} className="p-1 rounded-full hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Give your post a clear headline"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Content (optional)
            </label>
            <textarea
              rows="4"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Share your story, confession, or tips..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tags (comma separated, optional)
            </label>
            <input
              type="text"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="e.g. study, confession, food"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Image (optional)
            </label>
            <label
              htmlFor="blog-image"
              className="block w-full border-2 border-dashed border-gray-200 rounded-xl px-4 py-5 text-center text-sm text-gray-600 cursor-pointer hover:border-cyan-300 hover:bg-cyan-50/40 transition"
            >
              <div className="font-semibold text-gray-700 mb-1">Choose an image</div>
              <div className="text-xs text-gray-500">JPG, PNG, or GIF • Max ~3 MB</div>
            </label>
            <input
              id="blog-image"
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="hidden"
            />
            {imageData && (
              <div className="mt-3 rounded-xl overflow-hidden border">
                <img src={imageData} alt="Preview" className="w-full h-48 object-cover" />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold shadow hover:from-cyan-600 hover:to-teal-600 disabled:opacity-60"
            >
              {submitting ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBlogModal;
