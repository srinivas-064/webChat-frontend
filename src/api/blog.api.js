import axios from "axios";
import { API_BASE_URL } from "../config/runtime";

const API_URL = `${API_BASE_URL}/blogs`;

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

export const fetchBlog = fetchBlogById;

export const createBlog = async (payload) => {
  const res = await api.post("/", payload);
  return res.data;
};

export const updateBlog = async (id, payload) => {
  const res = await api.patch(`/${id}`, payload);
  return res.data;
};

export const deleteBlog = async (id) => {
  const res = await api.delete(`/${id}`);
  return res.data;
};

export const likeBlog = async (id) => {
  const res = await api.post(`/${id}/like`);
  return res.data;
};

export const commentOnBlog = async (id, text) => {
  const res = await api.post(`/${id}/comments`, { text });
  return res.data;
};
