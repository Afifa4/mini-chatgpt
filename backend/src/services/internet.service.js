import { tavily } from "@tavily/core";

const tvly = tavily({ apiKey: process.env.TVLY_API_KEY });

export async function searchInternet(query) {
  const response = await tvly.search(query, {
    maxResults: 5,
    searchDepth: "basic",
    timeout: 15, // seconds
  });

  // Only what the AI needs, so fewer tokens are sent to the model
  return response.results.map((result) => ({
    title: result.title,
    url: result.url,
    content: result.content,
  }));
}
