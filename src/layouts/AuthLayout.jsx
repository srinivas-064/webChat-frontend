import React from "react";
import { Outlet } from "react-router-dom";
import { ToastHost } from "../components/ui/ToastHost";
import { GlobalErrorToast } from "../components/common/GlobalErrorToast.jsx";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-white to-teal-50 px-4 py-8">
      <GlobalErrorToast />
      <Outlet />
      <ToastHost />
    </div>
  );
}
