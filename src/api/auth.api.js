// for login and signup api calls
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/users';

// Create axios instance with withCredentials enabled
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // CRITICAL: This allows cookies to be sent/received
    headers: {
        'Content-Type': 'application/json',
    }
});

const signup = async (userData) => {
    const response = await api.post('/signup', userData);
    return response; // Return full response
}

const signin = async (userData) => {
    const response = await api.post('/signin', userData);
    return response; // Return full response
}

export const sendSignupOtp = async (email) => {
  const res = await api.post("/signup/send-otp", { email });
  return res.data; // { success, expiresIn }
};

export const verifySignupOtp = async (email, otp) => {
  const res = await api.post("/signup/verify-otp", { email, otp });
  return res.data; // { valid: true }
};

export const sendResetOtp = async (email) => {
  const res = await api.post("/forgot/send-otp", { email });
  return res.data; // { success, expiresAt }
};

export const verifyResetOtp = async (email, otp) => {
  const res = await api.post("/forgot/verify-otp", { email, otp });
  return res.data; // { valid: true, token? }
};

export const resetPassword = async (email, otp, newPassword, token) => {
  const res = await api.post("/forgot/reset", { email, otp, newPassword, token });
  return res.data; // { success: true }
};

export { signup, signin };
