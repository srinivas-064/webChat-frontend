import React, { useState } from "react";
import { createConfession } from "../api/confession.api";
import { Button } from "../components/ui/Button";
import { Input, Textarea } from "../components/ui/Input";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext.jsx";

export default function ConfessionNew() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [form, setForm] = useState({
    title: "",
    content: "",
    tags: "",
    mood: "🥲",
    allowDMs: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      content: form.content,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      mood: form.mood,
      allowDMs: form.allowDMs,
      isAnonymous: true,
      author: form.allowDMs ? "You" : "Anonymous",
    };
    const res = await createConfession(payload);
    const confession = res?.confession || res;
    addToast({ title: "Confession posted", description: "Your confession is live" });
    navigate(`/confessions/${confession.id || confession._id}`);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Share a confession</h1>
      <p className="text-sm text-gray-600 mb-4">Anonymous by default. Toggle DMs if you want replies.</p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1 block">Title</label>
          <Input name="title" value={form.title} onChange={handleChange} required />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1 block">Content</label>
          <Textarea name="content" value={form.content} onChange={handleChange} rows={5} required />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Mood</label>
            <select
              name="mood"
              value={form.mood}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-3"
            >
              {"😍 🥲 😡 😭".split(" ").map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Tags (comma separated)</label>
            <Input name="tags" value={form.tags} onChange={handleChange} placeholder="friendship, labs" />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" name="allowDMs" checked={form.allowDMs} onChange={handleChange} />
          Allow DMs (shows Message anonymously button)
        </label>
        <Button type="submit">Post Confession</Button>
      </form>
    </div>
  );
}
