import { io } from "socket.io-client";
import { SOCKET_BASE_URL } from "../config/runtime";

const SOCKET_URL = SOCKET_BASE_URL;

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket"],
});
