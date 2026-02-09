import axios from "axios";
import { API_BASE_URL } from "../config/runtime";

const API_URL = `${API_BASE_URL}/users`;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const signup = async (payload) => {
  const res = await api.post("/signup", payload);
  return res.data;
};

export const signin = async (payload) => {
  const res = await api.post("/signin", payload);
  return res.data;
};

export const requestSignupOtp = async (email) => {
  const res = await api.post("/signup/send-otp", { email });
  return res.data;
};

export const requestForgotOtp = async (email) => {
  const res = await api.post("/forgot/send-otp", { email });
  return res.data;
};

export const verifyResetOtp = async (email, otp) => {
  const res = await api.post("/forgot/verify-otp", { email, otp });
  return res.data;
};

export const resetPassword = async (email, otp, newPassword) => {
  const res = await api.post("/forgot/reset", { email, otp, newPassword });
  return res.data;
};

// Backward-compatible names used across existing pages
export const sendSignupOtp = requestSignupOtp;
export const sendResetOtp = requestForgotOtp;
