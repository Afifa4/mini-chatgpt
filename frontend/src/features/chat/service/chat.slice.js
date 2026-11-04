import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: {},
    currentChatId: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    setChats: (state, action) => {
      const chats = {};
      action.payload.forEach((chat) => {
        chats[chat._id] = {
          ...chat,
          messages: state.chats[chat._id]?.messages || [],
        };
      });
      state.chats = chats;
    },
    setMessages: (state, action) => {
      const { chatId, messages } = action.payload;

      if (state.chats[chatId]) {
        state.chats[chatId].messages = messages;
      }
    },
    addMessages: (state, action) => {
      const { chat, messages } = action.payload;

      if (!state.chats[chat._id]) {
        state.chats[chat._id] = { ...chat, messages: [] };
      }

      state.chats[chat._id].messages.push(...messages);
      state.chats[chat._id].updatedAt = new Date().toISOString();
    },

    setCurrentChatId: (state, action) => {
      state.currentChatId = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    removeChat: (state, action) => {
      const chatId = action.payload;
      delete state.chats[chatId];

      if (state.currentChatId === chatId) {
        state.currentChatId = null;
      }
    },
    resetChat: (state) => {
      state.chats = {};
      state.currentChatId = null;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setChats,
  setMessages,
  addMessages,
  setCurrentChatId,
  setLoading,
  setError,
  removeChat,
  resetChat,
} = chatSlice.actions;

export default chatSlice.reducer;
