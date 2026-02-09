import React, { useEffect, useMemo, useState } from "react";
import { deleteConfession, fetchConfessions, updateConfession } from "../api/confession.api";
import { ConfirmDeleteModal } from "../components/common/ConfirmDeleteModal";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { Input, Textarea } from "../components/ui/Input";
import { useToast } from "../context/ToastContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProfileConfessions() {
  const [confs, setConfs] = useState([]);
  const [target, setTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", tags: "", content: "" });
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const { user } = useAuth();

  const userId = user?.id;
  const myConfs = useMemo(() => {
    if (!userId) return confs;
    return confs.filter((c) => {
      const authorId = c.author?._id || c.author?.id || c.author;
      return authorId?.toString?.() === userId.toString();
    });
  }, [confs, userId]);

  useEffect(() => {
    fetchConfessions({ page: 1, limit: 50 })
      .then((data) => setConfs(data?.confessions || []))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    if (!target) return;
    const targetId = target.id || target._id;
    try {
      await deleteConfession(targetId);
      setConfs((prev) => prev.filter((c) => (c.id || c._id) !== targetId));
      setTarget(null);
    } catch (err) {
      addToast({ title: "Error", description: err?.response?.data?.message || "Delete failed" });
    }
  };

  const openEdit = (conf) => {
    setEditTarget(conf);
    setEditForm({
      title: conf.title || "",
      tags: (conf.tags || []).join(", "),
      content: conf.content || "",
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
      const res = await updateConfession(targetId, payload);
      const updated = res?.confession || res;
      setConfs((prev) =>
        prev.map((c) => ((c.id || c._id) === targetId ? { ...c, ...updated } : c))
      );
      setEditTarget(null);
    } catch (err) {
      addToast({ title: "Error", description: err?.response?.data?.message || "Update failed" });
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Manage confessions</h1>
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 text-gray-600">Loading confessions...</div>
        ) : myConfs.map((c) => (
          <div key={c.id || c._id} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">{c.title}</p>
              <p className="text-sm text-gray-600">{(c.tags || []).join(", ")}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="soft" onClick={() => openEdit(c)}>Edit</Button>
              <Button variant="danger" onClick={() => setTarget(c)}>Delete</Button>
            </div>
          </div>
        ))}
        {!loading && !myConfs.length && (
          <div className="bg-white border border-dashed rounded-2xl p-6 text-center text-gray-600">No confessions yet.</div>
        )}
      </div>
      <ConfirmDeleteModal
        open={Boolean(target)}
        onClose={() => setTarget(null)}
        onConfirm={handleDelete}
        itemLabel="confession"
      />
      <Modal open={Boolean(editTarget)} onClose={() => setEditTarget(null)} title="Edit confession">
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
