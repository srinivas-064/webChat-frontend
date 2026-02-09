import axios from "axios";

const API_URL = "http://localhost:3000/api/users";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchMe = async () => {
  try {
    const res = await api.get("/me");
    return res.data; // { loggedIn: true, user: {...} }
  } catch (err) {
    // A 401 just means \"not logged in\" — treat as a normal case.
    if (err.response?.status === 401) return { loggedIn: false };
    throw err;
  }
};

export const logout = async () => {
  const res = await api.post("/logout");
  return res.data;
};
