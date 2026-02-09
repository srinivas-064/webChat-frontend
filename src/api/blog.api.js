import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/blogs`;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const fetchBlogs = async ({ page = 1, limit = 20 } = {}) => {
  const res = await api.get("/", { params: { page, limit } });
  return res.data;
};

export const fetchBlogById = async (id) => {
  const res = await api.get(`/${id}`);
  return res.data;
};

export const createBlog = async (payload) => {
  const res = await api.post("/", payload);
  return res.data;
};

export const deleteBlog = async (id) => {
  const res = await api.delete(`/${id}`);
  return res.data;
};
