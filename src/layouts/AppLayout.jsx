import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ToastHost } from "../components/ui/ToastHost";
import { GlobalErrorToast } from "../components/common/GlobalErrorToast.jsx";

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-cyan-50 via-white to-teal-50">
      <GlobalErrorToast />
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
      <Footer />
      <ToastHost />
    </div>
  );
}
