import axios from "axios";
import { API_BASE_URL } from "../config/runtime";

const API_URL = `${API_BASE_URL}/society-updates`;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const fetchSocietyUpdates = async ({ page = 1, limit = 20 } = {}) => {
  const res = await api.get("/", { params: { page, limit } });
  return res.data;
};

export const fetchSocietyUpdateById = async (id) => {
  const res = await api.get(`/${id}`);
  return res.data;
};

export const fetchSocietyUpdate = fetchSocietyUpdateById;

export const createSocietyUpdate = async (payload) => {
  const res = await api.post("/", payload);
  return res.data;
};

export const deleteSocietyUpdate = async (id) => {
  const res = await api.delete(`/${id}`);
  return res.data;
};

export const likeSocietyUpdate = async (id) => {
  const res = await api.post(`/${id}/like`);
  return res.data;
};

export const commentOnSocietyUpdate = async (id, text) => {
  const res = await api.post(`/${id}/comments`, { text });
  return res.data;
};
