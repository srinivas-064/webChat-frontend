import axios from "axios";
import { API_BASE_URL } from "../config/runtime";

const API_URL = `${API_BASE_URL}/uploads`;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const uploadImage = async (payload) => {
  const res = await api.post("/image", payload);
  return res.data;
};
