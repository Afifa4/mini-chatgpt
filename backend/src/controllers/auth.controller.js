import { sendEmail } from "../services/mail.services.js";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import redis from "../config/cache.js";
import { AppError } from "../utils/AppError.js";

async function sendVerificationEmail(user) {
  const EmailVerificationToken = jwt.sign(
    {
      id: user._id,
      email: user.email,
      type: "email_verification",
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  await sendEmail({
    to: user.email,
    subject: "Welcome to ChatGpt!",
    html: `<h1>Welcome, ${user.username}!</h1>
    <p>Thank you for registering at ChatGpt.</p>
    <p>We are excited to have you on board. If you have any questions or need assistance, feel free to reach out to our support team.</p>
    <p>To verify your email address, please click the link below:</p>
    <a href="http://localhost:3000/api/auth/verify-email/${EmailVerificationToken}">Verify Email</a>
    <p>If you did not sign up for this account, please ignore this email.</p>
    <p>Best regards,</p>
    <p>The ChatGpt Team</p>`,
  });
}

export async function register(req, res) {
  const { username, email, password } = req.body;
  const isUserExist = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (isUserExist) {
    throw new AppError("User already exists", 409);
  }

  const user = await userModel.create({ username, email, password });

  try {
    await sendVerificationEmail(user);
  } catch (err) {
    console.error("Error sending email:", err.message);

    await userModel.findByIdAndDelete(user._id);

    return res.status(500).json({
      message: "Could not send verification email. Please try again.",
      success: false,
      err: "Email sending failed",
    });
  }

  return res.status(201).json({
    message: "User registered successfully",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

export async function resendVerificationEmail(req, res) {
  const { email } = req.body;
  const user = await userModel.findOne({ email });

  if (user && !user.verified) {
    await sendVerificationEmail(user);
  }

  res.status(200).json({
    message: "If this account needs verification, a new link has been sent.",
    success: true,
  });
}

// Includes the password hash, so a reset link stops working once it is used
function getPasswordResetSecret(user) {
  return `${process.env.JWT_SECRET}${user.password}`;
}

export async function forgotPassword(req, res) {
  const { email } = req.body;
  const user = await userModel.findOne({ email });

  if (user) {
    const resetToken = jwt.sign(
      { id: user._id, type: "password_reset" },
      getPasswordResetSecret(user),
      { expiresIn: "15m" },
    );

    await sendEmail({
      to: user.email,
      subject: "Reset your password",
      html: `<h1>Hi ${user.username},</h1>
    <p>We received a request to reset your password.</p>
    <a href="http://localhost:5173/reset-password?token=${resetToken}">Reset Password</a>
    <p>This link expires in 15 minutes and can be used only once.</p>
    <p>If you did not request this, please ignore this email.</p>`,
    });
  }

  res.status(200).json({
    message: "If this email is registered, a password reset link has been sent.",
    success: true,
  });
}

export async function resetPassword(req, res) {
  const { token, password } = req.body;
  const invalidLinkError = new AppError(
    "This reset link is invalid or has expired",
    400,
  );

  const userId = jwt.decode(token)?.id;
  const user = userId ? await userModel.findById(userId) : null;

  if (!user) {
    throw invalidLinkError;
  }

  let decoded;
  try {
    decoded = jwt.verify(token, getPasswordResetSecret(user));
  } catch {
    throw invalidLinkError;
  }

  if (decoded.type !== "password_reset") {
    throw invalidLinkError;
  }

  // The reset link went to this inbox, so it also proves the email is theirs
  user.password = password;
  user.verified = true;
  await user.save();

  // Logs out every session that started before this password change
  await redis.set(
    `password-changed:${user._id}`,
    Math.floor(Date.now() / 1000),
    "EX",
    24 * 60 * 60,
  );

  res.status(200).json({
    message: "Password reset successful. You can now log in.",
    success: true,
  });
}

export async function verifyEmail(req, res) {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.type !== "email_verification") {
      return res.redirect("http://localhost:5173/email-verified?status=error");
    }

    const user = await userModel.findOne({ email: decoded.email });

    if (!user) {
      return res.redirect("http://localhost:5173/email-verified?status=error");
    }

    user.verified = true;
    await user.save();

    return res.redirect("http://localhost:5173/email-verified?status=success");
  } catch (err) {
    console.error("Error verifying email:", err);
    return res.redirect("http://localhost:5173/email-verified?status=error");
  }
}
export async function loginUser(req, res) {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!user.verified) {
    throw new AppError(
      "Please verify your email address before logging in",
      403,
    );
  }

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // dev mein false; HTTPS par deploy karte waqt true
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
  });

  res.status(200).json({
    message: "Login successful",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

export async function getMe(req, res) {
  const userId = req.user.id;

  const user = await userModel.findById(userId).select("-password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    message: "User found",
    success: true,
    user: user,
  });
}

export async function logoutUser(req, res) {
  const token = req.cookies.token;

  const ttl = req.user.exp - Math.floor(Date.now() / 1000);
  if (ttl > 0) {
    await redis.set(token, "blacklisted", "EX", ttl);
  }

  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
  });

  res.status(200).json({ message: "Logout successful", success: true });
}
