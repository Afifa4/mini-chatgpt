import axios from "axios";
import { API_URL } from "../../../app/config.js";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export async function sendMessage({ message, chatId }) {
  const response = await api.post("/api/chats/message", {
    message,
    chat: chatId,
  });
  return response.data;
}

export async function getChats() {
  const response = await api.get("/api/chats/");
  return response.data;
}

export async function getMessages(chatId) {
  const response = await api.get(`/api/chats/${chatId}/messages`);

  return response.data;
}

export async function deleteChat(chatId) {
  const response = await api.delete(`/api/chats/${chatId}`);
  return response.data;
}

export async function uploadDocument({ file, chatId }) {
  const formData = new FormData();
  formData.append("file", file);
  if (chatId) {
    formData.append("chat", chatId);
  }

  const response = await api.post("/api/chats/documents", formData);
  return response.data;
}
