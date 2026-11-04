import { Router } from "express";
import {
  sendMessage,
  getChats,
  getMessages,
  deleteChat,
} from "../controllers/chat.controller.js";
import { uploadDocument } from "../controllers/document.controller.js";
import { uploadPdf } from "../middlewares/upload.middleware.js";
import { sendMessageValidator } from "../validators/chat.validator.js";

import { authUser } from "../middlewares/auth.middleware.js";

const chatRouter = Router();

chatRouter.post("/message", authUser, sendMessageValidator, sendMessage);
chatRouter.get("/", authUser, getChats);
chatRouter.get("/:chatId/messages", authUser, getMessages);

chatRouter.delete("/:chatId", authUser, deleteChat);
chatRouter.post("/documents", authUser, uploadPdf, uploadDocument);

export default chatRouter;
