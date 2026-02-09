import axios from "axios";
import { API_BASE_URL } from "../config/runtime";

const API_URL = `${API_BASE_URL}`;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export async function searchUsers(query) {
  if (!query?.trim()) return [];
  const res = await api.get("/users/search", { params: { q: query } });
  return res.data?.users || [];
}

export async function sendFriendRequest(toUserId) {
  const res = await api.post("/friends/requests", { toUserId });
  return res.data;
}

export async function fetchFriendRequests() {
  const res = await api.get("/friends/requests/incoming");
  return res.data?.requests || [];
}

export async function respondToFriendRequest(id, action = "accept") {
  const endpoint = action === "accept" ? "accept" : "reject";
  const res = await api.post(`/friends/requests/${id}/${endpoint}`);
  return res.data;
}

export async function fetchFriends() {
  const res = await api.get("/friends");
  return res.data?.friends || [];
}
