import axios from "axios";

const API_URL = "http://localhost:3000/api/confessions";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const createConfession = async (payload) => {
  const res = await api.post("/", payload);
  return res.data; // { confession }
};

export const fetchConfessions = async (params = {}) =>
  (await api.get("/", { params })).data; // { confessions, page, totalPages }

export const fetchConfession = async (id) => (await api.get(`/${id}`)).data; // { confession }

export const likeConfession = async (id) => {
  const res = await api.post(`/${id}/like`);
  return res.data; // { liked, likesCount }
};

export const commentOnConfession = async (id, text) => {
  const res = await api.post(`/${id}/comments`, { text });
  return res.data; // { comment, commentsCount }
};

export const deleteConfession = async (id) => {
  const res = await api.delete(`/${id}`);
  return res.data; // { message }
};

export const updateConfession = async (id, payload) => {
  const res = await api.patch(`/${id}`, payload);
  return res.data; // { confession }
};
