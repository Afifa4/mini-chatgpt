import jwt from "jsonwebtoken";
import redis from "../config/cache.js";

export async function authUser(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
      success: false,
      err: "No token provided",
    });
  }
  // JWT pehle verify, taaki fake token par Redis call na ho
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({
      message: "Unauthorized Access",
      success: false,
      err: "Invalid Token",
    });
  }

  // Email verify wala token login ke liye use nahi ho sakta
  if (decoded.type === "email_verification") {
    return res.status(401).json({
      message: "Unauthorized Access",
      success: false,
      err: "Invalid Token",
    });
  }

  // Logout blacklist aur password change dono ek hi Redis call mein
  let isBlacklisted;
  let passwordChangedAt;
  try {
    [isBlacklisted, passwordChangedAt] = await redis.mget(
      token,
      `password-changed:${decoded.id}`,
    );
  } catch (err) {
    // Redis ke bina logout check nahi ho sakta, isliye request rok do
    console.error("Redis error:", err.message);
    return res.status(503).json({
      message: "Service temporarily unavailable. Please try again.",
      success: false,
      err: "Session check unavailable",
    });
  }

  if (isBlacklisted) {
    return res.status(401).json({
      message: "Unauthorized",
      success: false,
      err: "Token has been logged out",
    });
  }

  // Password badalne se pehle wala token ab valid nahi
  if (passwordChangedAt && decoded.iat < Number(passwordChangedAt)) {
    return res.status(401).json({
      message: "Unauthorized",
      success: false,
      err: "Password was changed",
    });
  }

  req.user = decoded;
  next();
}
