import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

export async function extractChunksFromPdf(buffer) {
  const loader = new PDFLoader(new Blob([buffer], { type: "application/pdf" }));
  const pages = await loader.load();
  const chunks = await textSplitter.splitDocuments(pages);

  return chunks.map((chunk) => ({
    text: chunk.pageContent,
    pageNumber: chunk.metadata.loc?.pageNumber,
  }));
}
