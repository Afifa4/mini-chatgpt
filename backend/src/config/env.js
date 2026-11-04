// Local defaults; Render sets the real URLs through environment variables
export const isProduction = process.env.NODE_ENV === "production";

export const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
export const API_URL = process.env.API_URL || "http://localhost:3000";

export const authCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: isProduction,
  path: "/",
};
