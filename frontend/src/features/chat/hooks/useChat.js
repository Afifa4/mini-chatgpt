import { initializeSocketConnection } from "../service/chat.socket";
import { useDispatch, useSelector } from "react-redux";
import {
  setChats,
  setMessages,
  setLoading,
  setError,
  setCurrentChatId,
  addMessages,
  removeChat,
} from "../service/chat.slice.js";

import {
  sendMessage,
  getChats,
  getMessages,
  deleteChat,
  uploadDocument,
} from "../service/chat.api";

export const useChat = () => {
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chat.chats);

  async function handleSendMessage({ message, chatId }) {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const data = await sendMessage({ message, chatId });
      const { chat, userMessage, aiMessage } = data;

      dispatch(addMessages({ chat, messages: [userMessage, aiMessage] }));
      dispatch(setCurrentChatId(chat._id));
    } catch (err) {
      dispatch(setError(err.response?.data?.message || "Message did not send"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetChats() {
    try {
      const data = await getChats();
      dispatch(setChats(data.chats));
    } catch (err) {
      dispatch(setError(err.response?.data?.message || "chats did not load"));
    }
  }

  async function handleOpenChat(chatId) {
    dispatch(setCurrentChatId(chatId));
    dispatch(setError(null));

    if (chats[chatId]?.messages?.length > 0) return;

    try {
      dispatch(setLoading(true));
      const data = await getMessages(chatId);
      dispatch(setMessages({ chatId, messages: data.messages }));
    } catch (err) {
      dispatch(
        setError(err.response?.data?.message || "Messages did not load"),
      );
    } finally {
      dispatch(setLoading(false));
    }
  }

  function handleNewChat() {
    dispatch(setCurrentChatId(null));
    dispatch(setError(null));
  }

  async function handleDeleteChat(chatId) {
    try {
      await deleteChat(chatId);
      dispatch(removeChat(chatId));
    } catch (err) {
      dispatch(setError(err.response?.data?.message || "Chat did not delete"));
    }
  }

  async function handleUploadDocument({ file, chatId }) {
    try {
      dispatch(setError(null));

      const data = await uploadDocument({ file, chatId });

      dispatch(addMessages({ chat: data.chat, messages: [] }));
      dispatch(setCurrentChatId(data.chat._id));
      return data;
    } catch (err) {
      dispatch(setError(err.response?.data?.message || "PDF did not upload"));
      return null;
    }
  }

  return {
    initializeSocketConnection,
    handleSendMessage,
    handleGetChats,
    handleOpenChat,
    handleNewChat,
    handleDeleteChat,
    handleUploadDocument,
  };
};
