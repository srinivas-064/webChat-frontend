import axios from "axios";
import { API_BASE_URL } from "../config/runtime";

const API_URL = `${API_BASE_URL}/confessions`;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const fetchConfessions = async ({ page = 1, limit = 20 } = {}) => {
  const res = await api.get("/", { params: { page, limit } });
  return res.data;
};

export const fetchConfessionById = async (id) => {
  const res = await api.get(`/${id}`);
  return res.data;
};

export const fetchConfession = fetchConfessionById;

export const createConfession = async (payload) => {
  const res = await api.post("/", payload);
  return res.data;
};

export const updateConfession = async (id, payload) => {
  const res = await api.patch(`/${id}`, payload);
  return res.data;
};

export const deleteConfession = async (id) => {
  const res = await api.delete(`/${id}`);
  return res.data;
};

export const likeConfession = async (id) => {
  const res = await api.post(`/${id}/like`);
  return res.data;
};

export const commentOnConfession = async (id, text) => {
  const res = await api.post(`/${id}/comments`, { text });
  return res.data;
};
