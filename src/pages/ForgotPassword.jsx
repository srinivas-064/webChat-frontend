import React, { useEffect, useState } from "react";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { sendResetOtp, verifyResetOtp, resetPassword } from "../api/auth.api";
import { useToast } from "../context/ToastContext.jsx";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [stage, setStage] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [expiresAt, setExpiresAt] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [verifyToken, setVerifyToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!expiresAt) return;
    const tick = () => {
      const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setCountdown(remaining);
      if (remaining === 0) setStage("email");
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Enter your email");
      return;
    }
    setLoading(true);
    try {
      await sendResetOtp(email.trim());
      setExpiresAt(Date.now() + 5 * 60 * 1000);
      setStage("otp");
      addToast({ title: "OTP sent", description: "Check your email (expires in 5 min)." });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    if (!otp.trim()) {
      setError("Enter the OTP");
      return;
    }
    setLoading(true);
    try {
      const res = await verifyResetOtp(email.trim(), otp.trim());
      setVerifyToken(res?.token || null);
      setStage("reset");
      addToast({ title: "Verified", description: "OTP verified. Set a new password." });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email.trim(), otp.trim(), newPassword, verifyToken);
      addToast({ title: "Password changed", description: "Sign in with your new password." });
      navigate("/auth/login");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-4 mt-6">
      <h1 className="text-2xl font-bold text-gray-900">Forgot password</h1>
      <p className="text-sm text-gray-600">We will send a 5-minute OTP to your email.</p>
      {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-3">{error}</div>}

      {stage === "email" && (
        <form className="space-y-4" onSubmit={handleSendOtp}>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </Button>
        </form>
      )}

      {stage === "otp" && (
        <form className="space-y-4" onSubmit={handleVerify}>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Enter OTP</label>
            <Input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit code"
              required
            />
            {countdown > 0 && (
              <p className="text-xs text-gray-500 mt-1">Expires in {Math.floor(countdown / 60)}:{`${countdown % 60}`.padStart(2, "0")}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={() => setStage("email")}>Back</Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
          </div>
        </form>
      )}

      {stage === "reset" && (
        <form className="space-y-4" onSubmit={handleReset}>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">New password</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Confirm password</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              required
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={() => setStage("email")}>Start over</Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Updating..." : "Update password"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
