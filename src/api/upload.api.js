import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/uploads`;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const uploadImage = async (payload) => {
  const res = await api.post("/image", payload);
  return res.data;
};
