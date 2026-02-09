import axios from "axios";

const API_URL = "http://localhost:3000/api/society-updates";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const createSocietyUpdate = async (payload) => {
  const res = await api.post("/", payload);
  return res.data; // { update }
};

export const fetchSocietyUpdates = async (params = {}) =>
  (await api.get("/", { params })).data; // { updates, page, totalPages }
export const fetchSocietyUpdate = async (id) => (await api.get(`/${id}`)).data; // { update }
export const likeSocietyUpdate = async (id) => (await api.post(`/${id}/like`)).data; // { liked, likesCount }
export const commentOnSocietyUpdate = async (id, text) =>
  (await api.post(`/${id}/comments`, { text })).data; // { comment, commentsCount }
export const deleteSocietyUpdate = async (id) => (await api.delete(`/${id}`)).data; // { message }
