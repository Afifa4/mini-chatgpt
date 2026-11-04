import chatModel from "../models/chat.model.js";
import documentModel from "../models/document.model.js";
import documentChunkModel from "../models/documentChunk.model.js";
import { extractChunksFromPdf } from "../services/document.service.js";
import { embedDocuments } from "../services/embedding.service.js";
import {
  uploadPdfToImageKit,
  deleteFileFromImageKit,
} from "../services/imagekit.service.js";
import { AppError } from "../utils/AppError.js";

async function cleanupFailedUpload({ fileId, documentId, newChatId }) {
  const results = await Promise.allSettled([
    deleteFileFromImageKit(fileId),
    documentId && documentChunkModel.deleteMany({ document: documentId }),
    documentId && documentModel.deleteOne({ _id: documentId }),
    newChatId && chatModel.deleteOne({ _id: newChatId }),
  ]);

  results
    .filter((result) => result.status === "rejected")
    .forEach((result) => {
      console.error("Error cleaning up failed upload:", result.reason);
    });
}

export async function uploadDocument(req, res) {
  if (!req.file) {
    throw new AppError("PDF file is required", 400);
  }

  const { chat: chatId } = req.body;
  const fileName = req.file.originalname;

  let chat = null;
  if (chatId) {
    chat = await chatModel.findOne({ _id: chatId, user: req.user.id });
    if (!chat) {
      throw new AppError("Chat not found", 404);
    }
  }

  let chunks;
  try {
    chunks = await extractChunksFromPdf(req.file.buffer);
  } catch (err) {
    console.error("Error reading PDF:", err);
    throw new AppError("Could not read this PDF", 400);
  }

  if (chunks.length === 0) {
    throw new AppError("No readable text found in this PDF", 400);
  }

  const embeddings = await embedDocuments(chunks.map((chunk) => chunk.text));

  const { fileUrl, fileId } = await uploadPdfToImageKit(
    req.file.buffer,
    fileName,
  );

  let document = null;
  let newChatId = null;

  try {
    if (!chat) {
      chat = await chatModel.create({
        user: req.user.id,
        title: fileName.replace(/\.pdf$/i, ""),
      });
      newChatId = chat._id;
    }

    document = await documentModel.create({
      user: req.user.id,
      chat: chat._id,
      fileName,
      fileUrl,
      fileId,
    });

    await documentChunkModel.insertMany(
      chunks.map((chunk, index) => ({
        document: document._id,
        user: req.user.id,
        chat: chat._id,
        text: chunk.text,
        pageNumber: chunk.pageNumber,
        embedding: embeddings[index],
      })),
    );

    document.status = "ready";
    await document.save();
  } catch (err) {
    await cleanupFailedUpload({
      fileId,
      documentId: document?._id,
      newChatId,
    });
    throw err;
  }

  res.status(201).json({
    message: "Document uploaded successfully",
    success: true,
    chat,
    document,
    chunksCount: chunks.length,
  });
}
