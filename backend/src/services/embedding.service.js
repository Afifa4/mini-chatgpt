import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

const embeddingModel = new GoogleGenerativeAIEmbeddings({
  model: "gemini-embedding-001",
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function embedDocuments(texts) {
  return embeddingModel.embedDocuments(texts);
}

export async function embedQuery(text) {
  return embeddingModel.embedQuery(text);
}
