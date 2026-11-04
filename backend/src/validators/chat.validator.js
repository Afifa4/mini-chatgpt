import { body } from "express-validator";
import { validate } from "./auth.validator.js";

export const MAX_MESSAGE_LENGTH = 5000;

export const sendMessageValidator = [
  body("message")
    .isString()
    .withMessage("message must be text")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("message is required")
    .isLength({ max: MAX_MESSAGE_LENGTH })
    .withMessage(`message must be ${MAX_MESSAGE_LENGTH} characters or less`),

  // A new chat sends null here
  body("chat")
    .optional({ values: "null" })
    .isMongoId()
    .withMessage("invalid chat id"),

  validate,
];
