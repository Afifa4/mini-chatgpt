import multer from "multer";
import { AppError } from "../utils/AppError.js";

// Vercel rejects request bodies above 4.5 MB
export const MAX_FILE_SIZE = 4 * 1024 * 1024;

export const uploadPdf = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new AppError("Only PDF files are allowed", 400));
    }
    cb(null, true);
  },
}).single("file");
