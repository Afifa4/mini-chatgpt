import { generateResponse, generateChatTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";
import { AppError } from "../utils/AppError.js";
import { findRelevantChunks } from "../services/retrieval.service.js";

import documentModel from "../models/document.model.js";
import documentChunkModel from "../models/documentChunk.model.js";
import { deleteFileFromImageKit } from "../services/imagekit.service.js";

export async function sendMessage(req, res) {
  const { message, chat: chatId } = req.body;

  let title = null;
  let chat = null;

  if (!chatId) {
    // A slow or failed title should not block the actual answer
    try {
      title = await generateChatTitle(message);
    } catch (err) {
      console.error("Error generating chat title:", err.message);
    }
    title = title || "New Chat";
    chat = await chatModel.create({
      user: req.user.id,
      title,
    });
  } else {
    chat = await chatModel.findOne({ _id: chatId, user: req.user.id });
  }

  if (!chat) {
    throw new AppError("Chat not found", 404);
  }

  const userMessage = await messageModel.create({
    chat: chat._id,
    content: message,
    role: "user",
  });

  const history = await messageModel
    .find({ chat: chat._id })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  history.reverse();

  // If PDF search fails (e.g. embedding quota), still answer without the PDF
  let relevantChunks = [];
  try {
    relevantChunks = await findRelevantChunks(chat._id, message);
  } catch (err) {
    console.error("Error finding PDF chunks:", err.message);
  }

  let result;
  try {
    result = await generateResponse(history, relevantChunks);
  } catch (err) {
    console.error("Error generating AI response:", err);
    throw new AppError("Failed to generate AI response", 500);
  }

  const aiMessage = await messageModel.create({
    chat: chat._id,
    content: result,
    role: "ai",
  });

  chat.updatedAt = new Date();
  await chat.save();

  res.status(201).json({
    message: "Message sent successfully",
    success: true,
    chat,
    userMessage,
    aiMessage,
    title,
  });
}

export async function getChats(req, res) {
  const user = req.user;

  const chats = await chatModel.find({ user: user.id }).sort({ updatedAt: -1 });

  res.status(200).json({
    message: "Chats received successfully",
    success: true,
    chats,
  });
}

export async function getMessages(req, res) {
  const { chatId } = req.params;
  const chat = await chatModel.findOne({ _id: chatId, user: req.user.id });

  if (!chat) {
    throw new AppError("Chat not found", 404);
  }

  const messages = await messageModel.find({ chat: chatId });

  res.status(200).json({
    message: "Messages retrieved successfully",
    success: true,
    messages,
  });
}

export async function deleteChat(req, res) {
  const { chatId } = req.params;

  const chat = await chatModel.findOneAndDelete({
    _id: chatId,
    user: req.user.id,
  });

  if (!chat) {
    throw new AppError("Chat not found", 404);
  }

  const documents = await documentModel.find({ chat: chatId });

  const results = await Promise.allSettled(
    documents.map((document) => deleteFileFromImageKit(document.fileId)),
  );

  results
    .filter((result) => result.status === "rejected")
    .forEach((result) => {
      console.error("Error deleting file from ImageKit:", result.reason);
    });

  await documentChunkModel.deleteMany({ chat: chatId });
  await documentModel.deleteMany({ chat: chatId });

  await messageModel.deleteMany({
    chat: chatId,
  });

  res.status(200).json({
    message: "Chat deleted Successfully",
    success: true,
  });
}
