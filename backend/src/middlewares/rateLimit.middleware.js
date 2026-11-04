import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  keyGenerator: (req) => req.body?.email ?? "unkown",
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many login attempts .Try again after 15 minutes",
    success: false,
    err: "Rate limit exceeded",
  },
});

const resendLimitMessage = {
  message: "Too many requests. Please try again later",
  success: false,
  err: "Rate limit exceeded",
};

export const resendEmailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  keyGenerator: (req) => req.body.email,
  standardHeaders: true,
  legacyHeaders: false,
  message: resendLimitMessage,
});

export const resendIpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: resendLimitMessage,
});

export const forgotEmailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  keyGenerator: (req) => req.body.email,
  standardHeaders: true,
  legacyHeaders: false,
  message: resendLimitMessage,
});

export const forgotIpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: resendLimitMessage,
});

export const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: resendLimitMessage,
});
