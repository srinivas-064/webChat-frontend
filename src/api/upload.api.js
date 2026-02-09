import axios from "axios";

const API_URL = "http://localhost:3000/api/uploads";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const uploadImage = async (data) => {
  const res = await api.post("/image", { data });
  return res.data; // { url, publicId }
};
