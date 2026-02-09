import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useToast } from "../context/ToastContext.jsx";
import { sendSignupOtp } from "../api/auth.api";

export default function Signup() {
  const { signup, loading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", gender: "" });
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [expiresAt, setExpiresAt] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [sendingOtp, setSendingOtp] = useState(false);
  const campusDomain = "kgpian.iitkgp.ac.in";
  const isCampusEmail = (value) =>
    value.toLowerCase().endsWith(`@${campusDomain}`);

  useEffect(() => {
    if (!expiresAt) return;
    const tick = () => {
      const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setCountdown(remaining);
      if (remaining === 0) setOtpSent(false);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const cleanEmail = form.email.trim();
    if (!isCampusEmail(cleanEmail)) {
      setError(`Use your campus email (@${campusDomain})`);
      return;
    }
    if (!form.gender) {
      setError("Please select a gender");
      return;
    }
    if (!otpSent || !otp.trim()) {
      setError("Please request and enter OTP");
      return;
    }
    try {
      await signup({ ...form, email: cleanEmail, otp: otp.trim() });
      addToast({ title: "Account created", description: "You are signed in" });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Signup failed");
    }
  };

  const handleSendOtp = async () => {
    setError("");
    const cleanEmail = form.email.trim();
    if (!cleanEmail) {
      setError("Enter your email");
      return;
    }
    if (!isCampusEmail(cleanEmail)) {
      setError(`Use your campus email (@${campusDomain})`);
      return;
    }
    try {
      setSendingOtp(true);
      await sendSignupOtp(cleanEmail);
      setOtpSent(true);
      setExpiresAt(Date.now() + 5 * 60 * 1000);
      addToast({ title: "OTP sent", description: "Check your email (expires in 5 min)." });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-xl p-8 w-full max-w-md mx-auto mt-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Create account</h1>
      <p className="text-sm text-gray-600 mb-6">Sign up with your details.</p>
      {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-3">{error}</div>}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1 block">Name</label>
          <Input name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1 block">Email</label>
          <Input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder={`you@${campusDomain}`}
            required
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1 block">Password</label>
          <Input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Create a password" required />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1 block">Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white"
          >
            <option value="" disabled>
              Select gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-end">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">OTP</label>
            <Input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              required
              disabled={!otpSent}
            />
            {otpSent && countdown > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Expires in {Math.floor(countdown / 60)}:{`${countdown % 60}`.padStart(2, "0")}
              </p>
            )}
          </div>
          <Button type="button" variant="soft" onClick={handleSendOtp} disabled={sendingOtp}>
            {sendingOtp ? "Sending..." : otpSent ? "Resend OTP" : "Send OTP"}
          </Button>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating..." : "Sign Up"}
        </Button>
      </form>
      <p className="text-sm text-gray-600 mt-4">
        Already have an account? <Link className="text-cyan-600 font-semibold" to="/auth/login">Sign in</Link>
      </p>
    </div>
  );
}
