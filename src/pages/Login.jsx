import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useToast } from "../context/ToastContext.jsx";
import { sendResetOtp, verifyResetOtp, resetPassword } from "../api/auth.api";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [fpStage, setFpStage] = useState("email");
  const [fpEmail, setFpEmail] = useState("");
  const [fpOtp, setFpOtp] = useState("");
  const [fpToken, setFpToken] = useState(null);
  const [fpNewPassword, setFpNewPassword] = useState("");
  const [fpConfirmPassword, setFpConfirmPassword] = useState("");
  const [fpExpiresAt, setFpExpiresAt] = useState(null);
  const [fpCountdown, setFpCountdown] = useState(0);
  const [fpLoading, setFpLoading] = useState(false);
  const [fpError, setFpError] = useState("");

  useEffect(() => {
    if (!fpExpiresAt) return;
    const tick = () => {
      const remaining = Math.max(0, Math.floor((fpExpiresAt - Date.now()) / 1000));
      setFpCountdown(remaining);
      if (remaining === 0) setFpStage("email");
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [fpExpiresAt]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      addToast({ title: "Welcome back", description: "You are logged in" });
      navigate(location.state?.from || "/");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setFpError("");
    if (!fpEmail.trim()) {
      setFpError("Enter your email");
      return;
    }
    setFpLoading(true);
    try {
      await sendResetOtp(fpEmail.trim());
      setFpExpiresAt(Date.now() + 5 * 60 * 1000);
      setFpStage("otp");
    } catch (err) {
      setFpError(err.response?.data?.message || err.message || "Failed to send OTP");
    } finally {
      setFpLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setFpError("");
    if (!fpOtp.trim()) {
      setFpError("Enter the OTP");
      return;
    }
    setFpLoading(true);
    try {
      const res = await verifyResetOtp(fpEmail.trim(), fpOtp.trim());
      setFpToken(res?.token || null);
      setFpStage("reset");
    } catch (err) {
      setFpError(err.response?.data?.message || err.message || "Invalid OTP");
    } finally {
      setFpLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setFpError("");
    if (!fpNewPassword || fpNewPassword !== fpConfirmPassword) {
      setFpError("Passwords do not match");
      return;
    }
    setFpLoading(true);
    try {
      await resetPassword(fpEmail.trim(), fpOtp.trim(), fpNewPassword, fpToken);
      window.alert("Password changed successfully");
      setShowForgot(false);
      setFpStage("email");
      setFpEmail("");
      setFpOtp("");
      setFpNewPassword("");
      setFpConfirmPassword("");
      setFpToken(null);
      setFpExpiresAt(null);
      navigate("/auth/login");
    } catch (err) {
      setFpError(err.response?.data?.message || err.message || "Failed to reset password");
    } finally {
      setFpLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-xl p-8 w-full max-w-md mx-auto mt-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign in</h1>
      <p className="text-sm text-gray-600 mb-6">Use your college email (placeholder validation).</p>
      {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-3">{error}</div>}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1 block">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@kgp.ac.in"
            required
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1 block">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
        <div className="flex justify-end text-sm text-gray-600">
          <button
            type="button"
            onClick={() => setShowForgot((v) => !v)}
            className="text-cyan-600 hover:text-cyan-700 font-semibold"
          >
            Forgot password?
          </button>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
      {showForgot && (
        <div className="mt-4 p-4 border border-cyan-100 bg-cyan-50/60 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-2">Reset password</h3>
          {fpError && (
            <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-2">
              {fpError}
            </div>
          )}

          {fpStage === "email" && (
            <form className="space-y-3" onSubmit={handleSendOtp}>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={fpEmail}
                onChange={(e) => setFpEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-400"
                placeholder="Enter your email"
                required
              />
              <button
                type="submit"
                className="w-full bg-cyan-600 text-white py-2 rounded-lg font-semibold hover:bg-cyan-700 transition"
                disabled={fpLoading}
              >
                {fpLoading ? "Sending..." : "Generate OTP"}
              </button>
            </form>
          )}

          {fpStage === "otp" && (
            <form className="space-y-3" onSubmit={handleVerifyOtp}>
              <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
              <input
                value={fpOtp}
                onChange={(e) => setFpOtp(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-400"
                placeholder="6-digit OTP"
                required
              />
              {fpCountdown > 0 && (
                <p className="text-xs text-gray-500">
                  Expires in {Math.floor(fpCountdown / 60)}:{`${fpCountdown % 60}`.padStart(2, "0")}
                </p>
              )}
              <button
                type="submit"
                className="w-full bg-cyan-600 text-white py-2 rounded-lg font-semibold hover:bg-cyan-700 transition"
                disabled={fpLoading}
              >
                {fpLoading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          )}

          {fpStage === "reset" && (
            <form className="space-y-3" onSubmit={handleResetPassword}>
              <label className="block text-sm font-medium text-gray-700">New password</label>
              <input
                type="password"
                value={fpNewPassword}
                onChange={(e) => setFpNewPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-400"
                placeholder="New password"
                required
              />
              <label className="block text-sm font-medium text-gray-700">Confirm password</label>
              <input
                type="password"
                value={fpConfirmPassword}
                onChange={(e) => setFpConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-400"
                placeholder="Confirm password"
                required
              />
              <button
                type="submit"
                className="w-full bg-cyan-600 text-white py-2 rounded-lg font-semibold hover:bg-cyan-700 transition"
                disabled={fpLoading}
              >
                {fpLoading ? "Updating..." : "Change password"}
              </button>
            </form>
          )}
        </div>
      )}
      <p className="text-sm text-gray-600 mt-4">
        New here? <Link className="text-cyan-600 font-semibold" to="/auth/signup">Create account</Link>
      </p>
    </div>
  );
}
