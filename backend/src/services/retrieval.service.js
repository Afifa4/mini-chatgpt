import documentModel from "../models/document.model.js";
import documentChunkModel from "../models/documentChunk.model.js";
import { embedQuery } from "./embedding.service.js";

function cosineSimilarity(a, b) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function findRelevantChunks(chatId, query, limit = 5) {
  // Chunks of unfinished or failed uploads must not reach the AI
  const readyDocumentIds = await documentModel
    .find({ chat: chatId, status: "ready" })
    .distinct("_id");

  if (readyDocumentIds.length === 0) {
    return [];
  }

  const chunks = await documentChunkModel
    .find({ chat: chatId, document: { $in: readyDocumentIds } })
    .select("+embedding")
    .lean();

  if (chunks.length === 0) {
    return [];
  }

  const queryEmbedding = await embedQuery(query);

  return chunks
    .map((chunk) => ({
      text: chunk.text,
      pageNumber: chunk.pageNumber,
      score: cosineSimilarity(queryEmbedding, chunk.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
