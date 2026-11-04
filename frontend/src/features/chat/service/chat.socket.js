import { io } from "socket.io-client";
import { API_URL } from "../../../app/config.js";

export const initializeSocketConnection = () => {
  // Empty URL means the page's own server
  const socket = io(API_URL || undefined, {
    withCredentials: true,
  });

  socket.on("connect", () => {
    console.log("Connected to server with socket ID:", socket.id);
  });
};
