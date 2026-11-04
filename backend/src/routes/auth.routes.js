import { Router } from "express";
import {
  registerValidator,
  loginValidator,
  resendVerificationValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from "../validators/auth.validator.js";
import { authUser } from "../middlewares/auth.middleware.js";
import {
  loginLimiter,
  resendEmailLimiter,
  resendIpLimiter,
  forgotEmailLimiter,
  forgotIpLimiter,
  resetPasswordLimiter,
} from "../middlewares/rateLimit.middleware.js";
import {
  register,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  loginUser,
  getMe,
  logoutUser,
} from "../controllers/auth.controller.js";

const authRouter = Router();

/**
 @route POST/api/auth/registerUser
 @desc Register a new user
 @acess Public
 @body {username,email,password}
 @returns {username,email,password} 
 */
authRouter.post("/register", registerValidator, register);
/**
 @route GET/api/auth/verify-email/:token
 @desc Verify user's email address
 @acess Public
 @returns {token} 
 */
authRouter.get("/verify-email/:token", verifyEmail);

/**
 @route POST/api/auth/resend-verification
 @desc Send a new verification link to an unverified user
 @acess Public
 @body {email}
 @returns {message}
 */
authRouter.post(
  "/resend-verification",
  resendIpLimiter,
  resendVerificationValidator,
  resendEmailLimiter,
  resendVerificationEmail,
);

/**
 @route POST/api/auth/forgot-password
 @desc Send a password reset link
 @acess Public
 @body {email}
 @returns {message}
 */
authRouter.post(
  "/forgot-password",
  forgotIpLimiter,
  forgotPasswordValidator,
  forgotEmailLimiter,
  forgotPassword,
);

/**
 @route POST/api/auth/reset-password
 @desc Set a new password using a reset link
 @acess Public
 @body {token,password}
 @returns {message}
 */
authRouter.post(
  "/reset-password",
  resetPasswordLimiter,
  resetPasswordValidator,
  resetPassword,
);

/**
 @route POST/api/auth/login
 @desc Login a user
 @acess Public
 @returns {token} 
 */

authRouter.post("/login", loginValidator, loginLimiter, loginUser);

/**
 @route GET/api/auth/me
 @desc Get current user's profile
 @acess Private
 @returns {user} 
 */
authRouter.get("/me", authUser, getMe);
/**
 @route POST/api/auth/logout
 @desc Logout a user
 @acess Private
 @returns {message} 
 */

authRouter.post("/logout", authUser, logoutUser);

export default authRouter;
