import { body, validationResult } from "express-validator";

export function validate(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  return res.status(400).json({
    message: "Validation failed",
    success: false,
    errors: errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    })),
  });
}

export const registerValidator = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("username is required")
    .isLength({ min: 3, max: 30 })
    .withMessage("username must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("username can only contain letters, numbers and underscore"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("please provide a valid email")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters long"),

  validate,
];

export const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("please provide a valid email")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("password is required"),

  validate,
];

export const forgotPasswordValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("please provide a valid email")
    .normalizeEmail(),

  validate,
];

export const resetPasswordValidator = [
  body("token").isJWT().withMessage("invalid reset link"),

  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters long"),

  validate,
];

export const resendVerificationValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("please provide a valid email")
    .normalizeEmail(),

  validate,
];
