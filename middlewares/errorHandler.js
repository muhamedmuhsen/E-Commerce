export default (err, req, res, next) => {
  console.error(err.stack); // Log the error for debugging

  // Use the statusCode from the error object, or default to 500
  const statusCode = err.statusCode || 500;

  // Use the status from the error object, or default based on statusCode
  let status = err.status;
  if (!status) {
    status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
  }

  res.status(statusCode).json({
    success: false,
    status: status,
    code: statusCode,
    message: err.message || "Internal Server Error",
  });
};
