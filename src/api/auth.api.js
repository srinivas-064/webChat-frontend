import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/users`;

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
  const res = await api.post("/signup/otp", { email });
  return res.data;
};

export const requestForgotOtp = async (email) => {
  const res = await api.post("/forgot/otp", { email });
  return res.data;
};

export const resetPassword = async (payload) => {
  const res = await api.post("/reset-password", payload);
  return res.data;
};
