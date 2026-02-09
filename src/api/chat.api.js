import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/chats`;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const getPreviousChats = async () =>
  (await api.get("/", { params: { type: "friend" } })).data?.chats || [];

export const getRandomChats = async () =>
  (await api.get("/", { params: { type: "random" } })).data?.chats || [];

export const getChat = async (chatId) =>
  (await api.get(`/${chatId}`)).data?.chat;

export const sendMessage = async (chatId, text) =>
  (await api.post(`/${chatId}/messages`, { text })).data?.message;

export const startRandomChat = async () =>
  (await api.post("/random")).data;

export const startFriendChat = async (friendId) =>
  (await api.post(`/friend/${friendId}`)).data;
