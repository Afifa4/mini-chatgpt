// Koi route match nahi hua
export function notFound(req, res) {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    success: false,
    err: "Invalid route",
  });
}

export function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid id",
      success: false,
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation Error",
      success: false,
      errors: Object.values(err.errors).map((e) => ({
        field: e.path,
        message: e.message,
      })),
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      message: `${field} already exists`,
      success: false,
    });
  }

  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({
      message: "Invalid or expired token",
      success: false,
    });
  }

  if (err.name === "MulterError") {
    return res.status(400).json({
      message:
        err.code === "LIMIT_FILE_SIZE"
          ? "File size must be 10 MB or less"
          : "File upload failed",
      success: false,
    });
  }

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      message: "Invalid JSON body",
      success: false,
    });
  }

  res.status(err.status || 500).json({
    message: err.status
      ? err.message
      : "Something went wrong. Please try again.",
    success: false,
  });
}
