import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
import { signin, sendResetOtp, verifyResetOtp, resetPassword } from "../api/auth.api";

function Signin() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.redirectTo || "/";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleSignin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const data = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    try {
      await signin(data);
      window.dispatchEvent(new Event("auth-changed"));
      navigate(redirectTo);
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center shadow-lg">
              <LogIn className="text-white" size={32} />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Welcome Back
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Sign in to continue to Chat Web
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex justify-between text-sm text-gray-600">
              <button
                type="button"
                onClick={() => setShowForgot((v) => !v)}
                className="text-cyan-600 hover:text-cyan-700 font-semibold"
              >
                Forgot password?
              </button>
              <Link to="/auth/signup" className="text-cyan-600 hover:text-cyan-700 font-semibold">
                Create account
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold py-3 rounded-lg hover:from-cyan-600 hover:to-teal-600 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {showForgot && (
            <div className="mt-6 p-4 border border-cyan-100 bg-cyan-50/60 rounded-xl">
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
        </div>
      </div>
    </div>
  );
}

export default Signin;
