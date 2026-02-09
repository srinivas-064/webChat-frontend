import React, { useState } from "react";
import { createBlog } from "../api/blog.api";
import { Button } from "../components/ui/Button";
import { Input, Textarea } from "../components/ui/Input";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext.jsx";
import { uploadImage } from "../api/upload.api";

export default function BlogNew() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [form, setForm] = useState({ title: "", tags: "", content: "", imageUrl: "" });
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) =>
      setForm((prev) => ({ ...prev, imageUrl: ev.target?.result || "" }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = form.imageUrl;
    if (imageUrl?.startsWith("data:")) {
      try {
        setUploadingImage(true);
        const uploaded = await uploadImage(imageUrl);
        imageUrl = uploaded?.url || imageUrl;
        setForm((prev) => ({ ...prev, imageUrl }));
    } catch (err) {
      void err;
        addToast({ title: "Upload failed", description: "Unable to upload image" });
        setUploadingImage(false);
        return;
      } finally {
        setUploadingImage(false);
      }
    }
    const payload = {
      title: form.title,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      content: form.content,
      imageUrl,
      author: "You",
    };
    const res = await createBlog(payload);
    const blog = res?.blog || res;
    addToast({ title: "Blog created", description: "Your post is live" });
    navigate(`/blogs/${blog?.id || blog?._id}`);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Create a blog</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Title</label>
            <Input name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Tags</label>
            <Input name="tags" value={form.tags} onChange={handleChange} placeholder="tips, study" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Image URL</label>
            <div className="flex items-stretch rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-cyan-400">
              <Input
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="https://..."
                className="flex-1 h-full border-0 rounded-none focus:ring-0"
              />
              <label className="px-4 self-stretch flex items-center text-xs font-semibold text-cyan-700 bg-cyan-50 border-l border-gray-200 cursor-pointer whitespace-nowrap">
                Choose file
                <input type="file" accept="image/*" onChange={handleImageFile} className="hidden" />
              </label>
            </div>
            <div className="text-xs text-gray-500">Paste a URL or choose a file to upload.</div>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Content</label>
            <Textarea name="content" value={form.content} onChange={handleChange} rows={8} required />
          </div>
          <Button type="submit" disabled={uploadingImage}>
            {uploadingImage ? "Uploading..." : "Publish"}
          </Button>
        </form>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Preview</h2>
        <p className="text-sm text-gray-600 mb-2">Live preview of your post</p>
        <div className="border border-gray-100 rounded-xl p-4 space-y-3">
          <h3 className="text-xl font-semibold">{form.title || "Your title"}</h3>
          {form.imageUrl && (
            <img src={form.imageUrl} alt="preview" className="w-full h-52 object-cover rounded-xl" />
          )}
          <p className="text-sm text-gray-700 whitespace-pre-line">
            {form.content || "Start writing to see preview..."}
          </p>
          <div className="flex flex-wrap gap-2">
            {form.tags
              .split(",")
              .filter(Boolean)
              .map((t) => (
                <span key={t} className="text-xs bg-cyan-50 text-cyan-700 px-2 py-1 rounded-full">
                  #{t.trim()}
                </span>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
