import axios from "axios";

const API_URL = "http://localhost:3000/api/blogs";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const createBlog = async (payload) => {
  // payload: { title, content, imageUrl?, tags? }
  const res = await api.post("/", payload);
  return res.data; // expected { blog: {...} }
};

export const fetchBlogs = async (params = {}) =>
  (await api.get("/", { params })).data; // { blogs, page, totalPages }
export const fetchBlog = async (id) => (await api.get(`/${id}`)).data; // { blog }
export const likeBlog = async (id) => (await api.post(`/${id}/like`)).data; // { liked, likesCount }
export const commentOnBlog = async (id, text) =>
  (await api.post(`/${id}/comments`, { text })).data; // { comment, commentsCount }
export const deleteBlog = async (id) => (await api.delete(`/${id}`)).data; // { message }
export const updateBlog = async (id, payload) =>
  (await api.patch(`/${id}`, payload)).data; // { blog }
