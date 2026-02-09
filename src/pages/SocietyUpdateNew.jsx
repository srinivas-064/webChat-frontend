import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Textarea } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { useToast } from "../context/ToastContext.jsx";
import { createSocietyUpdate } from "../api/societyUpdate.api";
import { uploadImage } from "../api/upload.api";

export default function SocietyUpdateNew() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [form, setForm] = useState({ title: "", tags: "", imageUrl: "", club: "Society" });
  const [imageData, setImageData] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (imageData) setForm((f) => ({ ...f, imageUrl: imageData }));
  }, [imageData]);

  const handleImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImageData(ev.target?.result || "");
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
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
      title: form.title.trim(),
      club: form.club || "Society",
      tags,
      imageUrl,
    };
    const res = await createSocietyUpdate(payload);
    const update = res?.update || res;
    addToast({ title: "Update posted", description: "Your society update is live" });
    navigate(`/society-updates/${update.id || update._id}`);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Post a society update</h1>
      <p className="text-sm text-gray-600">Title, tags, and an image are enough. Others will see it in the feed.</p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1 block">Title</label>
          <Input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Event headline"
            required
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Club / Society</label>
            <Input
              value={form.club}
              onChange={(e) => setForm((f) => ({ ...f, club: e.target.value }))}
              placeholder="e.g., DramSoc"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Tags (comma separated)</label>
            <Input
              value={form.tags}
              onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
              placeholder="auditions, cultural"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 mb-1 block">Image URL</label>
          <div className="flex items-stretch rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-cyan-400">
            <Input
              value={form.imageUrl}
              onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
              placeholder="https://example.com/photo.jpg"
              className="flex-1 h-full border-0 rounded-none focus:ring-0"
            />
            <label className="px-4 self-stretch flex items-center text-xs font-semibold text-cyan-700 bg-cyan-50 border-l border-gray-200 cursor-pointer whitespace-nowrap">
              Choose file
              <input type="file" accept="image/*" onChange={handleImageFile} className="hidden" />
            </label>
          </div>
          <div className="text-xs text-gray-500">Paste a URL or choose a file to upload.</div>
          {imageData && (
            <div className="rounded-xl overflow-hidden border mt-2">
              <img src={imageData} alt="preview" className="w-full h-52 object-cover" />
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" type="button" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" disabled={uploadingImage}>
            {uploadingImage ? "Uploading..." : "Post update"}
          </Button>
        </div>
      </form>
    </div>
  );
}
