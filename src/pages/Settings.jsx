import React, { useState } from "react";
import { Button } from "../components/ui/Button";

export default function Settings() {
  const [prefs, setPrefs] = useState({
    emailAlerts: true,
    darkMode: false,
    allowDMs: true,
  });

  const toggle = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-4 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      <div className="space-y-3">
        {[{ key: "emailAlerts", label: "Email alerts" }, { key: "allowDMs", label: "Allow DMs by default" }, { key: "darkMode", label: "Dark mode (placeholder)" }].map((item) => (
          <label key={item.key} className="flex items-center justify-between gap-3 border border-gray-100 rounded-xl p-3">
            <span className="text-sm text-gray-700">{item.label}</span>
            <input type="checkbox" checked={prefs[item.key]} onChange={() => toggle(item.key)} />
          </label>
        ))}
      </div>
      <Button>Save preferences (mock)</Button>
    </div>
  );
}
