import React from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";

export function ConfirmDeleteModal({ open, onClose, onConfirm, itemLabel = "item" }) {
  return (
    <Modal open={open} onClose={onClose} title={`Delete ${itemLabel}?`}>
      <p className="text-sm text-gray-600 mb-4">This action cannot be undone.</p>
      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </Modal>
  );
}
