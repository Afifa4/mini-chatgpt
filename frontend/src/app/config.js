// In production the backend serves this app, so API calls use the same URL ("")
export const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? "" : "http://localhost:3000");
