import React from "react";
import { useToast } from "../../context/ToastContext.jsx";
import { X } from "lucide-react";

export function ToastHost() {
  const { toasts, removeToast } = useToast();
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="bg-white border border-gray-200 shadow-lg rounded-xl px-4 py-3 min-w-[220px]"
        >
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="text-sm font-semibold text-gray-800">{t.title || "Notification"}</p>
              {t.description && (
                <p className="text-xs text-gray-600 mt-1">{t.description}</p>
              )}
            </div>
            <button className="text-gray-400 hover:text-gray-600" onClick={() => removeToast(t.id)}>
              <X size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
