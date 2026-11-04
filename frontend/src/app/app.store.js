import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/services/auth.slice.js";
import chatReducer from "../features/chat/service/chat.slice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
  },
});
